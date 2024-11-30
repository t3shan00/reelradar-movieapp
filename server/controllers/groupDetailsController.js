import { pool } from '../utils/db.js';
import {
    shareMovie,
    findMovieByTmdbId,
    insertMovie,
    shareShowtime,
    getSharedMovies,
    getSharedShowtimes
} from '../models/groupDetailsModel.js';

// Function to share a movie with a group
export const shareMovieWithGroup = async (req, res) => {
    const { groupId } = req.params;
    const { tmdbMovieId, title, releaseDate, runtime, overview, posterPath, backdropPath, voteAverage } = req.body;
    const sharedByUserId = req.userId; // Use req.userId instead of req.user.id
  
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      let movieResult = await findMovieByTmdbId(tmdbMovieId);
      let movieId;
  
      if (movieResult.rows.length === 0) {
        // Insert the movie into the database if it does not exist
        const insertMovieResult = await insertMovie({
          tmdbMovieId,
          title,
          releaseDate,
          runtime,
          overview,
          posterPath,
          backdropPath,
          voteAverage
        });
        movieId = insertMovieResult.rows[0].movieid;
      } else {
        movieId = movieResult.rows[0].movieid;
      }
  
      await shareMovie(groupId, movieId, sharedByUserId);
      await client.query('COMMIT');
  
      res.status(201).json({ message: 'Movie shared successfully', movieId });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error sharing movie:', error);
      res.status(500).json({ message: 'Error sharing movie', error: error.message });
    } finally {
      client.release();
    }
  };

// Function to share showtime with a group
export const shareShowtimeWithGroup = async (req, res) => {
    const { groupId } = req.params;
    const { tmdbMovieId, title, startTime, theatre, auditorium, imageUrl } = req.body;
    const sharedByUserId = req.userId; // Use req.userId instead of req.user.id
  
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      let movieResult = await findMovieByTmdbId(tmdbMovieId);
      let movieId;
  
      if (movieResult.rows.length === 0) {
        // Insert the movie into the database if it does not exist
        const insertMovieResult = await insertMovie({
          tmdbMovieId,
          title,
          releaseDate: null, // Add appropriate release date if available
          runtime: null, // Add appropriate runtime if available
          overview: null, // Add appropriate overview if available
          posterPath: imageUrl, // Use imageUrl as posterPath
          backdropPath: null, // Add appropriate backdropPath if available
          voteAverage: null // Add appropriate voteAverage if available
        });
        movieId = insertMovieResult.rows[0].movieid;
      } else {
        movieId = movieResult.rows[0].movieid;
      }
  
      const showtimeResult = await shareShowtime({
        movieId,
        theatre,
        auditorium,
        startTime
      });
  
      // Ensure the movie is associated with the group
      await shareMovie(groupId, movieId, sharedByUserId);
  
      await client.query('COMMIT');
  
      res.status(201).json({ 
        message: 'Showtime shared successfully', 
        showtimeId: showtimeResult.rows[0]?.showtimeid,
        movieId 
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error sharing showtime:', error);
      res.status(500).json({ message: 'Error sharing showtime', error: error.message });
    } finally {
      client.release();
    }
  };

// Function to fetch shared movies
export const fetchSharedMovies = async (req, res) => {
    const { groupId } = req.params;
    try {
      const sharedMovies = await getSharedMovies(groupId);
      res.status(200).json(sharedMovies.rows);
    } catch (error) {
      console.error('Error fetching shared movies:', error);
      res.status(500).json({ message: 'Error fetching shared movies', error: error.message });
    }
  };

// Function to fetch shared showtimes
export const fetchSharedShowtimes = async (req, res) => {
    const { groupId } = req.params;
    try {
      const sharedShowtimes = await getSharedShowtimes(groupId);
      res.status(200).json(sharedShowtimes.rows);
    } catch (error) {
      console.error('Error fetching shared showtimes:', error);
      res.status(500).json({ message: 'Error fetching shared showtimes', error: error.message });
    }
  };