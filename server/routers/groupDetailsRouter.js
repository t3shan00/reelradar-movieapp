import { Router } from "express";
import { 
    shareMovieWithGroup,
    shareShowtimeWithGroup,
    fetchSharedMovies,
    fetchSharedShowtimes,
    deleteSharedMovie,
    deleteSharedShowtime,
    getMovieIdByTmdbId
} from '../controllers/groupDetailsController.js';
import { auth } from '../utils/auth.js';

const router = Router();

// Route to share a movie with a group
router.post('/groups/:groupId/movies', auth, shareMovieWithGroup);

// Route to share a showtime with a group
router.post('/groups/:groupId/showtimes', auth, shareShowtimeWithGroup);

// Route to fetch shared movies for a group
router.get('/groups/:groupId/movies', auth, fetchSharedMovies);

// Route to fetch shared showtimes for a group
router.get('/groups/:groupId/showtimes', auth, fetchSharedShowtimes);

// Route to delete a shared movie
router.delete('/groups/:groupId/movies/:movieId', auth, deleteSharedMovie);

// Route to delete a shared showtime
router.delete('/groups/:groupId/showtimes/:showtimeId', auth, deleteSharedShowtime);

// Route to get movieid from tmdbid
router.get('/movies/tmdb/:tmdbMovieId', auth, getMovieIdByTmdbId);

export default router;