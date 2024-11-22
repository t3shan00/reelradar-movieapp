import { pool } from "../utils/db.js";

export const addFavoriteToDB = async (userId, movieId) => {
  return pool.query(
    `INSERT INTO Favorites (UserID, MovieID) 
     VALUES ($1, $2) 
     ON CONFLICT (UserID, MovieID) DO NOTHING`,
    [userId, movieId]
  );
};

export const removeFavoriteFromDB = async (userId, movieId) => {
  return pool.query(
    `DELETE FROM Favorites WHERE UserID = $1 AND MovieID = $2`,
    [userId, movieId]
  );
};

export const checkFavoriteStatus = async (userId, movieId) => {
  return pool.query(
    `SELECT * FROM Favorites WHERE UserID = $1 AND MovieID = $2`,
    [userId, movieId]
  );
};

export const fetchUserFavorites = async (userId) => {
    try {
      const result = await pool.query(
        `SELECT 
           TMDB_MovieID AS movieId, 
           title, 
           poster_path 
         FROM Favorites 
         WHERE UserID = $1
         ORDER BY CreatedAt DESC`,
        [userId]
      );
  
      return result.rows; // Return rows directly from the database
    } catch (err) {
      console.error("Error fetching favorite movies from database:", err.message);
      throw new Error("Failed to fetch favorite movies");
    }
  };