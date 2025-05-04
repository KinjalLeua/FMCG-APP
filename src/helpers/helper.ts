import { hashSync, compareSync } from "bcrypt";
import CryptoJS from "crypto-js";
import { decode } from "jsonwebtoken";
import User from "../models/user";
import constants from "../utils/constants";
import crypto from "crypto";
import mongoose from "mongoose";

const getMessage = async (msg: any) => {
  const errMsg: any = Object.values(msg.errors)[0];
  return errMsg[0];
};

const unixTime = async (date: any) => {
  return new Date(date).getTime();
};


const randomKey = async () => {
  const str = Array.from({ length: 64 }, () =>
    "0123456789abcdef".charAt(Math.floor(Math.random() * 16))
  ).join("");
  const key = CryptoJS.enc.Hex.parse(str);
  return key;
};

const randomiv = async () => {
  const str = Array.from({ length: 32 }, () =>
    "0123456789abcdef".charAt(Math.floor(Math.random() * 16))
  ).join("");
  const iv = CryptoJS.enc.Hex.parse(str);
  return iv;
};

const randomToken = async () => {
  const str = Array.from({ length: 48 }, () =>
    "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ".charAt(
      Math.floor(Math.random() * 62)
    )
  ).join("");

  return str;
};

const jwtDecode = async (token: string) => {
  return decode(token);
};

const getFileName = async (fileUrl: string) => {
  let index = fileUrl.lastIndexOf("/") + 1;
  let filename = fileUrl.substring(index);
  return filename;
};


const createPassword = async (name: any, dob: any) => {
  const newName = name.charAt(0).toUpperCase() + name.slice(1);
  const date = new Date(dob);
  const year = date.getFullYear();
  return `${newName}@${year}`;
};

const isDateValid = async (date: any) => {
  const newDate: any = new Date(date);
  return !isNaN(newDate);
};

const encryptMsg = async (msg: string, key: any) => {
  const encrypted = CryptoJS.AES.encrypt(msg, key);
  return encrypted.toString();
};

const decryptMsg = async (msg: string, key: any) => {
  const decrypted = CryptoJS.AES.decrypt(msg, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const encryptObj = async (msg: any, key: any) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(msg), key);
    return encrypted.toString();
  } catch (err) {
    return false;
  }
};

const decryptObj = async (msg: any, key: any) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(msg, key);
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    return false;
  }
};

const timeString = async () => {
  return Date.now().toString();
};

const hashPassword = async (password: string) => {
  const saltRounds = 15;
  return hashSync(password, saltRounds);
};


export {
  getMessage,
  hashPassword,
  unixTime,
  randomKey,
  randomiv,
  randomToken,
  jwtDecode,
  getFileName,
  createPassword,
  isDateValid,
  encryptMsg,
  decryptMsg,
  encryptObj,
  decryptObj,
  timeString,
};
