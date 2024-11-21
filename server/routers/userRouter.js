import { Router } from "express";
import { register, login } from '../controllers/userControllers.js';

const userRouter = Router();

// Register route
userRouter.post("/register", register);

// Login route
userRouter.post("/login", login);

export { userRouter };