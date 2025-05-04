import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import message from "./userConstant";
import mongoose from "mongoose";
import User from "../../../models/user";
import {
  createPassword,
  hashPassword,
} from "../../../helpers/helper";


const create = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Find if an admin exists
    const managerData = await User.findOne({
      role: constants.accountLevel.admin,
    });

    if (!managerData) {
      // If no manager exists, create a new user
      const user = new User({
        fname: req.body.first_name,
        lname: req.body.last_name,
        email: req.body.email,
        role: req.body.role,
        createdBy: req.id,
      });

      const data = await user.save();  

      if (!data) {
        throw {
          statusCode: constants.code.dataNotFound,
          msg: constants.message.dataNotFound,
        };
      }

      res.status(constants.code.success).json({
        status: constants.status.statusTrue,
        userStatus: req.status,
        message: message.userAddSuccess,
      });
    } else {
      res.status(constants.code.badRequest).json({
        status: constants.status.statusFalse,
        message: "Admin already exists.",
      });
    }
  } catch (err) {
    res.status(err.statusCode || constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      message: err.msg || err.message,
    });
  }
};

const usersList = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;
    const sort = req.query.sort === "desc" ? -1 : 1;

    if (Number(req.query.limit) !== 0) {
      User.aggregate([
        {
          $match: {
            _id: { $nin: [new mongoose.Types.ObjectId(req.id)] },
            role: { $nin: [constants.accountLevel.admin] },
            isDeleted: false,
            $or: [
              {
                fname: {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
              {
                "email": {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
            ],
          },
        },
  
        {
          $project: {
            _id: 1,
    
            fname: 1,
            lname: 1,
            email: 1,
            phone: 1,
            status: 1,
            isDeleted: 1,
            role: 1,
            createdAt: { $toLong: "$createdAt" },
          },
        },
        {
          $sort: { createdAt: sort },
        },
        {
          $facet: {
            metadata: [
              { $count: "total" },
              { $addFields: { page: Number(page) } },
              {
                $addFields: {
                  totalPages: {
                    $ceil: { $divide: ["$total", limit] },
                  },
                },
              },
              {
                $addFields: {
                  hasPrevPage: {
                    $cond: {
                      if: {
                        $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
                      },
                      then: false,
                      else: true,
                    },
                  },
                },
              },
              {
                $addFields: {
                  prevPage: {
                    $cond: {
                      if: {
                        $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
                      },
                      then: null,
                      else: { $subtract: [page, Number(1)] },
                    },
                  },
                },
              },
              {
                $addFields: {
                  hasNextPage: {
                    $cond: {
                      if: {
                        $gt: [
                          {
                            $subtract: [
                              {
                                $ceil: { $divide: ["$total", limit] },
                              },
                              Number(1),
                            ],
                          },
                          "$page",
                        ],
                      },
                      then: true,
                      else: false,
                    },
                  },
                },
              },
              { $addFields: { nextPage: { $sum: [page, Number(1)] } } },
            ],
            data: [{ $skip: skip }, { $limit: limit }],
          },
        },
      ])
        .then((data: any) => {
          if (!data[0].data.length) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.userListSuccess,
              metadata: data[0].metadata,
              data: data[0].data,
            });
          }
        })
        .catch((err) => {
          res.status(err.statusCode).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: err.msg,
          });
        });
    } else {
      User.aggregate([
        {
          $match: {
            _id: { $nin: [new mongoose.Types.ObjectId(req.id)] },
            role: { $nin: [constants.accountLevel.admin] },
            isDeleted: false,
            $or: [
              {
                fname: {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
              {
                "email": {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
            ],
          },
        },

        {
          $project: {
            _id: 1,
            fname: 1,
            lname: 1,
            email: 1,
            phone: 1,
            status: 1,
            isDeleted: 1,
            role: 1,
            createdAt: { $toLong: "$createdAt" },
          },
        },
        {
          $sort: { createdAt: sort },
        },
        {
          $facet: {
            metadata: [
              { $count: "total" },
              { $addFields: { page: Number(page) } },
              {
                $addFields: { totalPages: { $sum: [Number(page), Number(1)] } },
              },
              { $addFields: { hasPrevPage: false } },
              { $addFields: { prevPage: null } },
              { $addFields: { hasNextPage: false } },
              { $addFields: { nextPage: null } },
            ],
            data: [],
          },
        },
      ])
        .then((data) => {
          if (!data[0].data.length) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.userListSuccess,
              metadata: data[0].metadata,
              data: data[0].data,
            });
          }
        })
        .catch((err) => {
          res.status(err.statusCode).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: err.msg,
          });
        });
    }
  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
};




export default {
  create,
  usersList,
};
