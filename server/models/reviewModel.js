import { pool } from "../utils/db.js";

export const createReview = async (movieId, userId, reviewText, rating) => {
    const query = `
        INSERT INTO Reviews (MovieID, UserID, ReviewText, Rating)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [movieId, userId, reviewText, rating];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getReviewsByMovie = async (movieId) => {
    const query = `
      SELECT 
        r.ReviewText AS review_text, 
        r.Rating AS rating, 
        r.CreatedAt AS created_at, 
        u.Username AS username
      FROM Reviews r
      JOIN Users u ON r.UserID = u.UserID
      WHERE r.MovieID = $1
      ORDER BY r.CreatedAt DESC;
    `;
    const result = await pool.query(query, [movieId]);
    // console.log("Fetched reviews from DB:", result.rows);
    return result.rows;
  };

  export const getAllReviews = async () => {
    const query = `
      SELECT 
        r.ReviewText AS review_text, 
        r.Rating AS rating, 
        r.CreatedAt AS created_at, 
        u.Username AS username,
        m.Title AS movie_title,
        m.MovieID AS movie_id
      FROM Reviews r
      JOIN Users u ON r.UserID = u.UserID
      JOIN Movies m ON r.MovieID = m.MovieID
      ORDER BY r.CreatedAt DESC;
    `;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (err) {
      console.error("Error executing query:", err.message);
      throw err;
    }
  };