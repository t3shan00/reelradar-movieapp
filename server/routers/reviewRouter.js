import { Router } from "express";
import { createReviewHandler, getReviewsHandler, getAllReviewsHandler } from "../controllers/reviewController.js";
import { auth } from "../utils/auth.js";

const reviewRouter = Router();

// POST a new review
reviewRouter.post("/", auth, createReviewHandler);

// GET reviews for a specific movie
reviewRouter.get("/:movieId", getReviewsHandler);

// GET all reviews
reviewRouter.get("/", getAllReviewsHandler);

export default reviewRouter;