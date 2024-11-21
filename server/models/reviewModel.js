import { pool } from "../utils/db.js";

export const createReview = async (movieId, userId, reviewText) => {
    const query = `
        INSERT INTO Reviews (MovieID, UserID, ReviewText)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [movieId, userId, reviewText];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getReviewsByMovie = async (movieId) => {
    const query = `
      SELECT 
        r.ReviewText AS review_text, 
        r.CreatedAt AS created_at, 
        u.Username AS username
      FROM Reviews r
      JOIN Users u ON r.UserID = u.UserID
      WHERE r.MovieID = $1
      ORDER BY r.CreatedAt DESC;
    `;
    const result = await pool.query(query, [movieId]);
    console.log("Fetched reviews from DB:", result.rows); // Log database result
    return result.rows;
  };