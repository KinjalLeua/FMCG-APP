import { sign } from "jsonwebtoken";
import CryptoJS from "crypto-js";
import Token from "../models/token";
import { randomKey, randomiv, randomToken } from "./helper";


const createToken = async (payload: Object) => {
  try {
    const token = sign(payload, `${process.env.JWT_SECRET}`, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    })

    const key = await randomKey();
    const iv = await randomiv();
    const newToken = await randomToken();

    const encrypted = CryptoJS.AES.encrypt(token, key, { iv: iv });
    const msg = encrypted.toString();

    await Token.create({
      tokenable_type: "jwt",
      tokenable_id: newToken,
      name: "bearer",
      token: msg,
      key: key,
      iv: iv,
    }).catch((err) => {
      console.log(err);
    });

    return newToken;
  } catch (err) {
    console.log(err);
  }
};



export { createToken };
