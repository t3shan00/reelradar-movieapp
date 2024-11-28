import {
    shareMovie,
    findMovieByTmdbId,
    insertMovie,
    shareShowtime,
    getSharedMovies,
    getSharedShowtimes
} from '../models/groupDetailsModel.js';
import { pool } from '../utils/db.js';

export const shareMovieWithGroup = async (req, res) => {
    const { groupId } = req.params;
    const { 
        tmdbMovieId, 
        title, 
        releaseDate, 
        runtime, 
        overview, 
        posterPath, 
        backdropPath, 
        voteAverage 
    } = req.body;
    const sharedByUserId = req.user.id; // Corrected variable name

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let movieResult = await findMovieByTmdbId(tmdbMovieId);
        let movieId;

        if (movieResult.rows.length === 0) {
            const insertMovieResult = await insertMovie([
                tmdbMovieId,
                title,
                releaseDate,
                runtime,
                overview,
                posterPath,
                backdropPath,
                voteAverage
            ]);
            movieId = insertMovieResult.rows[0].MovieID; // Ensure this is correct
        } else {
            movieId = movieResult.rows[0].MovieID;
        }

        const existingShare = await client.query(
            'SELECT 1 FROM GroupMovies WHERE GroupID = $1 AND MovieID = $2',
            [groupId, movieId]
        );

        if (existingShare.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Movie already shared to this group' });
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

// Function to share showtime
export const shareShowtimeWithGroup = async (req, res) => {
    const { groupId } = req.params;
    const { 
        tmdbMovieId, 
        theatre, 
        auditorium, 
        startTime 
    } = req.body;
    const sharedByUserId = req.user.id;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const movieResult = await findMovieByTmdbId(tmdbMovieId);
        if (movieResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Movie not found in database' });
        }

        const movieId = movieResult.rows[0].MovieID;
        const showtimeResult = await shareShowtime([
            movieId,
            theatre,
            auditorium,
            startTime
        ]);

        await client.query('COMMIT');

        res.status(201).json({ 
            message: 'Showtime shared successfully', 
            showtimeId: showtimeResult.rows[0].ShowtimeID,
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