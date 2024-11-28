import { Router } from "express";
import { 
    shareMovieWithGroup,
    shareShowtimeWithGroup,
    fetchSharedMovies,
    fetchSharedShowtimes 
} from '../controllers/groupDetailsController.js';

const router = Router();

// Route to share a movie with a group
router.post('/groups/:groupId/movies', shareMovieWithGroup);

// Route to share a showtime with a group
router.post('/groups/:groupId/showtimes', shareShowtimeWithGroup);

// Route to fetch shared movies for a group
router.get('/groups/:groupId/movies', fetchSharedMovies);

// Route to fetch shared showtimes for a group
router.get('/groups/:groupId/showtimes', fetchSharedShowtimes);

export default router;