import { Schema, model } from "mongoose";
import constants from "../utils/constants";
import { hashPassword } from "../helpers/helper";

const userSchema = new Schema(
  {
   
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: {
     type: String, required: true, unique: true },
    role: {
      type: Number,
      enum: [
        constants.accountLevel.admin,
        constants.accountLevel.user,
      ],
      default: constants.accountLevel.user,
      required: true,
    },
    status: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

userSchema.method("getUserDetail", async function getUserDetail() {
  return {
    _id: this._id,
    fname: this.fname,
    lname: this.lname,
    email: this.email,
    role: this.role,
    status: this.status,
    isDeleted: this.isDeleted,
    createdBy: this.createdBy,
    updatedBy: this.updatedBy,
    deletedBy: this.deletedBy,
  };
});

userSchema.method("getAuthDetail", async function getAuthDetail() {
  return {
    email: this.email, 
    role: this.role,
  };
});

const User = model("user", userSchema);

User.exists({
  "email": `fmcg@service.com`,
}).then(async (data) => {
  if (!data) {
    await User.create({
      fname: "Super",
      lname: "Admin",
      email: {
        value: `fmcg@service.com`,
      },

      role: constants.accountLevel.admin,
    })
      .then((data) => {
        console.log(constants.message.superAdmin);
      })
      .catch((err) => {
        console.log(err);
      });
  }

});


export default User;
