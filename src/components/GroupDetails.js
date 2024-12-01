import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './styles/GroupDetail.module.css';

const GroupDetail = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [sharedMovies, setSharedMovies] = useState([]);
  const [sharedShowtimes, setSharedShowtimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGroupDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3001/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroup(response.data);
    } catch (error) {
      console.error("Error fetching group details:", error);
      toast.error('Failed to load group details');
    }
  }, [id]);

  const fetchSharedMovies = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3001/api/groups/${id}/movies`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSharedMovies(response.data);
    } catch (error) {
      console.error("Error fetching shared movies:", error);
      toast.error('Failed to load shared movies');
    }
  }, [id]);

  const fetchSharedShowtimes = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3001/api/groups/${id}/showtimes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSharedShowtimes(response.data);
    } catch (error) {
      console.error("Error fetching shared showtimes:", error);
      toast.error('Failed to load shared showtimes');
    }
  }, [id]);

  useEffect(() => {
    fetchGroupDetails();
    fetchSharedMovies();
    fetchSharedShowtimes();
  }, [fetchGroupDetails, fetchSharedMovies, fetchSharedShowtimes]);

  const removeMovie = async (tmdbMovieId) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const movieResponse = await axios.get(`http://localhost:3001/api/movies/tmdb/${tmdbMovieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const movieId = movieResponse.data.movieId;

      await axios.delete(`http://localhost:3001/api/groups/${id}/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optimistic update
      setSharedMovies(prevMovies => 
        prevMovies.filter(movie => movie.tmdb_movie_id !== tmdbMovieId)
      );
      
      // Refresh data
      await fetchSharedMovies();
      
      toast.success('Movie removed successfully!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error removing movie:", error);
      toast.error('Failed to remove movie. Please try again.');
      // Refresh to ensure consistency
      await fetchSharedMovies();
    } finally {
      setIsLoading(false);
    }
  };

  const removeShowtime = async (showtimeId) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3001/api/groups/${id}/showtimes/${showtimeId}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Optimistic update
      setSharedShowtimes(prevShowtimes => 
        prevShowtimes.filter(showtime => showtime.showtimeid !== showtimeId)
      );

      // Refresh data
      await fetchSharedShowtimes();
      
      toast.success('Showtime removed successfully!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error removing showtime:", error);
      toast.error('Failed to remove showtime. Please try again.');
      // Refresh to ensure consistency
      await fetchSharedShowtimes();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className={styles.groupDetail}>
        <div className={styles.groupHeader}>
          <h1>{group?.name}</h1>
          <p>{group?.description}</p>
        </div>

        <div className={styles.sharedSection}>
          <h2>Shared Movies</h2>
          <div className={styles.sharedMovies}>
            {sharedMovies.length > 0 ? (
              sharedMovies.map(movie => (
                <div key={movie.tmdb_movie_id} className={styles.sharedItem}>
                  <img 
                    src={movie.posterpath.startsWith('http') ? movie.posterpath : `https://image.tmdb.org/t/p/w500${movie.posterpath}`}
                    alt={movie.title} 
                  />
                  <div className={styles.sharedItemContent}>
                    <div>
                      <h3>{movie.title}</h3>
                      <p>Release Date: {new Date(movie.releasedate).toLocaleDateString()}</p>
                      <p>Shared By: {movie.sharedbyusername}</p>
                      <button 
                        onClick={() => removeMovie(movie.tmdb_movieid)}
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No shared movies available.</p>
            )}
          </div>
        </div>

        <div className={styles.sharedSection}>
          <h2>Shared Showtimes</h2>
          <div className={styles.sharedShowtimes}>
            {sharedShowtimes.length > 0 ? (
              sharedShowtimes.map((showtime) => (
                <div key={showtime.showtimeid} className={styles.sharedItem}>
                  <div className={styles.sharedItemContent}>
                    <div>
                      <h3>{showtime.movietitle}</h3>
                      <p>Theatre: {showtime.theatre}</p>
                      <p>Auditorium: {showtime.auditorium}</p>
                      <p>Time: {new Date(showtime.starttime).toLocaleString()}</p>
                      <p>Shared By: {showtime.sharedbyusername}</p>
                      <button 
                        onClick={() => removeShowtime(showtime.showtimeid)}
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No shared showtimes available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupDetail;