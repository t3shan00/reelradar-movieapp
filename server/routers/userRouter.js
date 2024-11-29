import { Router } from "express";
import { register, login, deleteUserHandler, getUserProfile, getFavoritesByUsername } from '../controllers/userControllers.js';
import { auth } from "../utils/auth.js";

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

export { userRouter };