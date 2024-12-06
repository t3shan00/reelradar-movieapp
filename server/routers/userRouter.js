import { Router } from "express";
import { register, login, deleteUserHandler, getUserProfile, getFavoritesByUsername } from '../controllers/userControllers.js';
import { auth } from "../utils/auth.js";
import { forgotPassword, resetPassword } from "../controllers/userControllers.js";


const userRouter = Router();

// Register route
userRouter.post("/register", register);

// Login route
userRouter.post("/login", login);

// Get user profile route
userRouter.get("/:username", getUserProfile);

// Get user favorites route
userRouter.get("/:username/favorites", getFavoritesByUsername);

// Delete account route
userRouter.delete("/delete", auth, deleteUserHandler);

userRouter.post("/forgot-password", forgotPassword);

// Reset password route
userRouter.post("/reset-password", resetPassword);

userRouter.post("/logout", auth, (req, res) => {
  res.status(200).json({ message: 'Successfully logged out' });
});

export { userRouter };