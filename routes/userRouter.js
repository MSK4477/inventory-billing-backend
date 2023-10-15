import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  // getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
const userRouter = Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.get("/verify", verifyUser);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.post("/resetPassword", resetPassword);
// userRouter.get("/", protect, getAllUsers);
userRouter.get("/", protect, getSingleUser);
userRouter.post("/update/:id", protect, updateUser);
userRouter.delete("/delete/:id", protect, deleteUser);
export default userRouter;
