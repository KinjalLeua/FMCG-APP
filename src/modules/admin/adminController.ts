import { Request, Response, NextFunction } from "express";
import constants from "../../utils/constants";
import mongoose from "mongoose";
import User from "../../models/user";
import Device from "../../models/device";
import {
  hashPassword,
  jwtDecode,
,
} from "../../helpers/helper";
import {
  createToken,
} from "../../helpers/token";


const login = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({ "email.value": await toLowerCase(req.body.email) })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.invalidEmail,
          };
        } else if (!data.status) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.userInactive,
          };
        } else if (data.isDeleted) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.userDeleted,
          };
        } else if (
          data.role !== constants.accountLevel.admin &&
          data.role !== constants.accountLevel.user
        ) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.invalidUser,
          };
        } else {
          Device.findOneAndUpdate(
            { deviceId: req.body.device_info.device_id, userId: data._id },
            {
              userId: data._id,
              deviceId: req.body.device_info.device_id,
              appId: req.body.device_info.app_id,
              name: req.body.device_info.name,
              model: req.body.device_info.model,
              platform: req.body.device_info.platform,
              version: req.body.device_info.version,
              ipAddress: req.body.device_info.ip,
              latitude: req.body.device_info.latitude,
              longitude: req.body.device_info.longitude,
              createdBy: data._id,
            },
            {
              upsert: true,
              new: true,
            }
          )
            .then(async (device_detail) => {
              if (!device_detail) {
                throw {
                  statusCode: constants.code.internalServerError,
                  msg: constants.message.internalServerError,
                };
              } else {
                const payload = {
                  id: data._id,
                };
                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: data.status,
                  message: constants.message.userLogin,
                  token:
                    req.body.device_info.platform !==
                      constants.deviceTypes.android &&
                    req.body.device_info.platform !==
                      constants.deviceTypes.iphone
                      ? await createToken(payload)
                  data: await data.getAuthDetail(),
                });
              }
            })
            .catch((err) => {
              res.status(err.statusCode).json({
                status: constants.status.statusFalse,
                userStatus: constants.status.statusFalse,
                message: err.msg,
              });
            });
        }
      })
      .catch((err) => {
        res.status(err.statusCode).json({
          status: constants.status.statusFalse,
          userStatus: constants.status.statusFalse,
          message: err.msg,
        });
      });
  } catch (err) {
    res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      userStatus: constants.status.statusFalse,
      message: err,
    });
  }
};




export default {
  login,
};
