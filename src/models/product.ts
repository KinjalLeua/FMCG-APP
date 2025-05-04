import { Schema, model } from "mongoose";
import constants from "../utils/constants";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String
    },
    category:{
      type:String
    },
    price:{
      type:String
    },
    status: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

productSchema.method("getProductDetail", async function getAuthDetail() {
  return {
    name: this.name,
  };
});

const Product = model("product", productSchema);
export default Product;