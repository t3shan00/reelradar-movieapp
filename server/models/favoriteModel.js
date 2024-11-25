import { pool } from "../utils/db.js";

// Add a movie to the user's favorites
export const addFavoriteToDB = async (userId, tmdbMovieId) => {
  return pool.query(
    `INSERT INTO Favorites (UserID, TMDB_MovieID) 
     VALUES ($1, $2) 
     ON CONFLICT (UserID, TMDB_MovieID) DO NOTHING`,
    [userId, tmdbMovieId]
  );
};

// Remove a movie from the user's favorites
export const removeFavoriteFromDB = async (userId, tmdbMovieId) => {
  return pool.query(
    `DELETE FROM Favorites WHERE UserID = $1 AND TMDB_MovieID = $2`,
    [userId, tmdbMovieId]
  );
};

// Check if a movie is in the user's favorites
export const checkFavoriteStatus = async (userId, tmdbMovieId) => {
  return pool.query(
    `SELECT * FROM Favorites WHERE UserID = $1 AND TMDB_MovieID = $2`,
    [userId, tmdbMovieId]
  );
};

// Fetch all favorite movies for the user
export const fetchUserFavorites = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT 
         TMDB_MovieID AS tmdb_movieid 
       FROM Favorites 
       WHERE UserID = $1
       ORDER BY CreatedAt DESC`,
      [userId]
    );

    return result.rows;
  } catch (err) {
    console.error("Error fetching favorite movies from database:", err.message);
    throw new Error("Failed to fetch favorite movies");
  }
};
