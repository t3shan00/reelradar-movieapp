import { createReview, getReviewsByMovie } from "../models/reviewModel.js";

export const createReviewHandler = async (req, res, next) => {
    const { movieId, reviewText } = req.body;
    const userId = req.userId; 

    if (!movieId || !reviewText) {
        return res.status(400).json({ error: "Movie ID and review text are required." });
    }

    try {
        const review = await createReview(movieId, userId, reviewText);
        res.status(201).json(review);
    } catch (err) {
        next(err);
    }
};

export const getReviewsHandler = async (req, res, next) => {
    const { movieId } = req.params;
  
    try {
      const reviews = await getReviewsByMovie(movieId);
      console.log("Reviews fetched for movie:", reviews); 
      res.status(200).json(reviews);
    } catch (err) {
      console.error("Error fetching reviews:", err.message);
      next(err);
    }
  };
