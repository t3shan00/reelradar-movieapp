import { Router } from "express";
import { 
    shareMovieWithGroup,
    shareShowtimeWithGroup,
    fetchSharedMovies,
    fetchSharedShowtimes 
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

export default router;