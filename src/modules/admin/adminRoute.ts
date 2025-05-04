import { Router } from "express";
const router = Router({ caseSensitive: true, strict: true });
import accessRateLimiter from "../../middlewares/accessRateLimiter";
import checkAccessKey from "../../middlewares/checkAccessKey";
import checkAuth from "../../middlewares/checkAuth";
import validation from "./adminValidation";
import controller from "./adminController";
import { handleLogoUpload, handleProfileUpload } from "../../middlewares/multer";

router.post(
  `/login`,
  accessRateLimiter,
  checkAccessKey,
  validation.login,
  controller.login
);


export default router;
