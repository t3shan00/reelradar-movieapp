import { Router } from "express";
import { register, login } from '../controllers/userControllers.js';
import { auth } from "../utils/auth.js";
import { deleteUserHandler } from "../controllers/userControllers.js";

const userRouter = Router();

// Register route
userRouter.post("/register", register);

// Login route
userRouter.post("/login", login);

// Delete account route
userRouter.delete("/delete", auth, deleteUserHandler);

export { userRouter };