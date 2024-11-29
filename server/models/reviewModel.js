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