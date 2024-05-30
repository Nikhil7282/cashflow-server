import { Router } from "express";
import {
  loginUser,
  users,
  signUpUser,
  refreshToken,
  logout,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import {
  loginValidator,
  signUpValidator,
  updateUserValidator,
} from "../utils/validations.js";
import { verifyJwt } from "../utils/jwtConfig.js";

let userRouter = Router();

userRouter.get("/", users);
userRouter.get("/user", verifyJwt, getUser);
userRouter.post("/login", loginValidator, loginUser);
userRouter.post("/signup", signUpValidator, signUpUser);
userRouter.put("/updateUser", updateUserValidator, verifyJwt, updateUser);
userRouter.get("/refreshToken", refreshToken);
userRouter.get("/logout", logout);

export default userRouter;
