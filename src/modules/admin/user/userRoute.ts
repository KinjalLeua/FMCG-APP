import { Router } from "express";
const router = Router({ caseSensitive: true, strict: false });
import checkAuth from "../../../middlewares/checkAuth";
import validation from "./userValidation";
import controller from "./userController";

router.post(
  `/add-user`,
  checkAuth.Admin,
  validation.create,
  controller.create
);

router.post(
  `/user-list`,
  checkAuth.Admin,
  validation.usersList,
  controller.usersList
);



export default router;
