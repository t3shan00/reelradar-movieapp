import express from "express";
import { forgotPassword, resetPassword } from "../controllers/userControllers.js";

const authRouter = express.Router();

// Forgot password route
authRouter.post("/forgot-password", forgotPassword);

// Reset password route
authRouter.post("/reset-password/:token", resetPassword);

export default authRouter;