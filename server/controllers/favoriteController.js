import { pool } from "../utils/db.js";

// Add a movie to the user's favorites
export const addFavorite = async (req, res) => {
    const userId = req.userId; // Extracted from auth middleware
    const { movieId } = req.params; // TMDB Movie ID
  
    try {
      const result = await pool.query(
        `INSERT INTO Favorites (UserID, TMDB_MovieID) VALUES ($1, $2) ON CONFLICT (UserID, TMDB_MovieID) DO NOTHING RETURNING *`,
        [userId, movieId]
      );
  
      if (result.rowCount === 0) {
        return res.status(409).json({ message: "Movie is already in favorites" });
      }
  
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error adding movie to favorites:", err.message);
      res.status(500).json({ error: "Failed to add movie to favorites" });
    }
  };  

  export const removeFavorite = async (req, res) => {
    const userId = req.userId;
    const { movieId } = req.params; // TMDB Movie ID
  
    try {
      const result = await pool.query(
        `DELETE FROM Favorites WHERE UserID = $1 AND TMDB_MovieID = $2 RETURNING *`,
        [userId, movieId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Favorite not found" });
      }
  
      res.status(200).json({ message: "Favorite removed successfully" });
    } catch (err) {
      console.error("Error removing movie from favorites:", err.message);
      res.status(500).json({ error: "Failed to remove movie from favorites" });
    }
  };
  

  export const isFavorite = async (req, res) => {
    const userId = req.userId; // Retrieved from auth middleware
    const { movieId } = req.params;
  
    try {
      const result = await pool.query(
        "SELECT 1 FROM Favorites WHERE UserID = $1 AND TMDB_MovieID = $2",
        [userId, movieId]
      );
  
      const isFavorite = result.rowCount > 0;
      res.status(200).json({ isFavorite });
    } catch (err) {
      console.error("Error checking favorite status:", err.message);
      res.status(500).json({ error: "Failed to check favorite status" });
    }
  };

  export const getUserFavorites = async (req, res) => {
    const userId = req.userId;
  
    try {
      const favorites = await fetchUserFavorites(userId);
      res.status(200).json(favorites); // Send favorite movies to the client
    } catch (err) {
      console.error("Error fetching favorite movies:", err.message);
      res.status(500).json({ error: "Failed to fetch favorite movies" });
    }
  };