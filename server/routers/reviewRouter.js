import { Router } from "express";
import { createReviewHandler, getReviewsHandler } from "../controllers/reviewController.js";
import { auth } from "../utils/auth.js";

const reviewRouter = Router();

reviewRouter.post("/", auth, createReviewHandler); 
reviewRouter.get("/:movieId", getReviewsHandler); 

export default reviewRouter;
