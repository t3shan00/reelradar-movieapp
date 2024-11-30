import { pool } from "../utils/db.js";

export const createReview = async (client, movieId, userId, reviewText, rating) => {
  const query = `
    INSERT INTO Reviews (MovieID, UserID, ReviewText, Rating)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [movieId, userId, reviewText, rating];
  const result = await client.query(query, values);
  return result.rows[0];
};

export const getReviewsByMovie = async (tmdbMovieId) => {
  const query = `
    SELECT 
      r.ReviewText AS review_text, 
      r.Rating AS rating, 
      r.CreatedAt AS created_at, 
      u.Username AS username,
      m.Title AS movie_title,
      m.tmdb_movieid AS movie_id
    FROM Reviews r
    JOIN Users u ON r.UserID = u.UserID
    JOIN Movies m ON r.MovieID = m.MovieID
    WHERE m.tmdb_movieid = $1
    ORDER BY r.CreatedAt DESC;
  `;
  try {
    const result = await pool.query(query, [tmdbMovieId]);
    return result.rows;
  } catch (err) {
    console.error("Error executing query:", err.message);
    throw err;
  }
};

export const getAllReviews = async () => {
  const query = `
    SELECT 
      r.ReviewText AS review_text, 
      r.Rating AS rating, 
      r.CreatedAt AS created_at, 
      u.Username AS username,
      m.Title AS movie_title,
      m.tmdb_movieid AS movie_id
    FROM Reviews r
    JOIN Users u ON r.UserID = u.UserID
    JOIN Movies m ON r.MovieID = m.MovieID
    ORDER BY r.CreatedAt DESC;
  `;
  try {
    console.log("Executing query to fetch all reviews");
    const result = await pool.query(query);
    console.log("Fetched reviews from DB:", result.rows);
    return result.rows;
  } catch (err) {
    console.error("Error executing query:", err.message);
    throw err;
  }
};

export const findMovieByTmdbId = async (client, tmdbMovieId) => {
  const query = 'SELECT MovieID FROM Movies WHERE TMDB_MovieID = $1';
  try {
    const result = await client.query(query, [tmdbMovieId]);
    return result;
  } catch (error) {
    console.error('Error finding movie by TMDB ID:', error);
    throw error;
  }
};

export const insertMovie = async (client, movieData) => {
  const { id, title, release_date, runtime, overview, poster_path, backdrop_path, vote_average } = movieData;
  const query = `
    INSERT INTO Movies 
    (TMDB_MovieID, Title, ReleaseDate, Runtime, Overview, PosterPath, BackdropPath, VoteAverage)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING MovieID
  `;
  try {
    const result = await client.query(query, [id, title, release_date, runtime, overview, poster_path, backdrop_path, vote_average]);
    return result;
  } catch (error) {
    console.error('Error inserting movie:', error);
    throw error;
  }
};