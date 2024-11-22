import { Router } from "express";
import { auth } from "../utils/auth.js";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
  getUserFavorites,
} from "../controllers/favoriteController.js";

const favoriteRouter = Router();

// Add a movie to favorites
favoriteRouter.post("/:movieId", auth, addFavorite);

// Remove a movie from favorites
favoriteRouter.delete("/:movieId", auth, removeFavorite);

// Check if a movie is in the user's favorites
favoriteRouter.get("/:movieId", auth, isFavorite); // <-- Ensure this route exists

// Fetch all favorite movies for the user
favoriteRouter.get("/", auth, getUserFavorites);

export default favoriteRouter;
