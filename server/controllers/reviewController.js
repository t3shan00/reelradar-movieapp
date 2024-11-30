import { pool } from "../utils/db.js";
import { createReview, getReviewsByMovie, getAllReviews, findMovieByTmdbId, insertMovie } from "../models/reviewModel.js";
import { fetchMovieDetails } from "../utils/movieUtils.js"; // Adjust the import path as needed

export const createReviewHandler = async (req, res, next) => {
  const { movieId, reviewText, rating } = req.body;
  const userId = req.userId;

  if (!movieId || !reviewText) {
    return res.status(400).json({ error: "Movie ID and review text are required." });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Fetch and insert movie details if not already in the database
    let movieResult = await findMovieByTmdbId(client, movieId);
    let finalMovieId = movieId;
    if (movieResult.rows.length === 0) {
      const movieDetails = await fetchMovieDetails(movieId);
      const insertMovieResult = await insertMovie(client, movieDetails);
      finalMovieId = insertMovieResult.rows[0].movieid;
    } else {
      finalMovieId = movieResult.rows[0].movieid;
    }

    // Create the review
    const review = await createReview(client, finalMovieId, userId, reviewText, rating);
    await client.query('COMMIT');
    res.status(201).json(review);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

export const getReviewsHandler = async (req, res, next) => {
  const { movieId } = req.params;

  try {
    const reviews = await getReviewsByMovie(movieId);
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

export const getAllReviewsHandler = async (req, res, next) => {
  try {
    const reviews = await getAllReviews();
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching all reviews:", err.message);
    next(err);
  }
};