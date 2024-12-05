import { pool } from "../utils/db.js";

// Share a movie with a group
export const shareMovie = async (groupId, movieId, sharedByUserId) => {
    const query = `
      INSERT INTO GroupMovies (GroupID, MovieID, SharedByUserID) 
      VALUES ($1, $2, $3)
    `;
    try {
      const result = await pool.query(query, [groupId, movieId, sharedByUserId]);
      return result;
    } catch (error) {
      console.error('Error sharing movie with group:', error);
      throw error;
    }
  };

// Check if movie exists in Movies table
export const findMovieByTmdbId = async (tmdbMovieId) => {
  const query = 'SELECT MovieID FROM Movies WHERE TMDB_MovieID = $1';
  try {
    const result = await pool.query(query, [tmdbMovieId]);
    return result;
  } catch (error) {
    console.error('Error finding movie by TMDB ID:', error);
    throw error;
  }
};

// Insert a new movie
export const insertMovie = async (movieData) => {
  const { tmdbMovieId, title, releaseDate, runtime, overview, posterPath, backdropPath, voteAverage } = movieData;
  const query = `
    INSERT INTO Movies 
    (TMDB_MovieID, Title, ReleaseDate, Runtime, Overview, PosterPath, BackdropPath, VoteAverage)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING MovieID
  `;
  try {
    const result = await pool.query(query, [tmdbMovieId, title, releaseDate, runtime, overview, posterPath, backdropPath, voteAverage]);
    return result;
  } catch (error) {
    console.error('Error inserting movie:', error);
    throw error;
  }
};

// Share a showtime
export const shareShowtime = async (showtimeData) => {
  const { movieId, theatre, auditorium, startTime } = showtimeData;
  const query = `
    INSERT INTO Showtimes 
    (MovieID, Theatre, Auditorium, StartTime)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (MovieID, StartTime, Theatre, Auditorium) 
    DO NOTHING
    RETURNING ShowtimeID
  `;
  try {
    const result = await pool.query(query, [movieId, theatre, auditorium, startTime]);
    return result;
  } catch (error) {
    console.error('Error sharing showtime:', error);
    throw error;
  }
};

// Fetch shared movies for a group
export const getSharedMovies = async (groupId) => {
  const query = `
    SELECT 
      m.TMDB_MovieID,
      m.Title, 
      m.ReleaseDate, 
      m.PosterPath,
      m.VoteAverage,
      gm.SharedAt,
      u.username AS SharedByUsername
    FROM GroupMovies gm
    JOIN Movies m ON gm.MovieID = m.MovieID
    JOIN Users u ON gm.SharedByUserID = u.UserID
    WHERE gm.GroupID = $1
    ORDER BY gm.SharedAt DESC
  `;
  return await pool.query(query, [groupId]);
};

// Fetch shared showtimes for a group
export const getSharedShowtimes = async (groupId) => {
  const query = `
    SELECT 
      s.ShowtimeID as showtimeid,
      m.Title AS movietitle,
      s.Theatre as theatre,
      s.Auditorium as auditorium,
      s.StartTime as starttime,
      gm.SharedAt as sharedat,
      u.username AS sharedbyusername
    FROM Showtimes s
    JOIN Movies m ON s.MovieID = m.MovieID
    JOIN GroupMovies gm ON m.MovieID = gm.MovieID
    JOIN Users u ON gm.SharedByUserID = u.UserID
    WHERE gm.GroupID = $1
    ORDER BY s.StartTime ASC
  `;
  try {
    const result = await pool.query(query, [groupId]);
    return result;
  } catch (error) {
    console.error('Error fetching shared showtimes:', error);
    throw error;
  }
};

// Remove a shared movie from a group
export const removeSharedMovie = async (groupId, movieId) => {
  const query = `
    DELETE FROM GroupMovies 
    WHERE GroupID = $1 AND MovieID = $2
  `;
  try {
    const result = await pool.query(query, [groupId, movieId]);
    return result;
  } catch (error) {
    console.error('Error removing shared movie:', error);
    throw error;
  }
};

// Remove a shared showtime from a group
export const removeSharedShowtime = async (groupId, showtimeId) => {
  const query = `
    DELETE FROM Showtimes 
    WHERE ShowtimeID = $1 AND MovieID IN (
      SELECT MovieID FROM GroupMovies WHERE GroupID = $2
    )
    RETURNING *
  `;
  try {
    const result = await pool.query(query, [showtimeId, groupId]);
    return result;
  } catch (error) {
    console.error('Error removing shared showtime:', error);
    throw error;
  }
};