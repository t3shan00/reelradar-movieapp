import { Router } from "express";
import { createReviewHandler, getReviewsHandler } from "../controllers/reviewController.js";
import { auth } from "../utils/auth.js";

const reviewRouter = Router();

// POST a new review
reviewRouter.post("/", auth, createReviewHandler);

// GET reviews for a specific movie
reviewRouter.get("/:movieId", getReviewsHandler);

export default reviewRouter;
