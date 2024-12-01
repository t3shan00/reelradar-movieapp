import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './styles/GroupDetail.module.css';

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [sharedMovies, setSharedMovies] = useState([]);
  const [sharedShowtimes, setSharedShowtimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieIdByTitle = async (title) => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&language=en-US`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTllNGRmMWY4ZDZhNmE1NDBjY2YyN2JiNmVmYzI1MyIsIm5iZiI6MTczMjAyNTU0Mi43Nzg4NDksInN1YiI6IjY3MzlmODRlNmEwMmEyNGQ3YjIxODE2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fXqSiWv07snaUkxoAsWteUTZNE1hdIuNNodLDtkC1nM'
      }
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.results?.[0]?.id ?? null;
    } catch (error) {
      console.error("Error fetching movie ID:", error);
      return null;
    }
  };

  const handleMovieClick = async (title) => {
    try {
      const movieId = await fetchMovieIdByTitle(title);
      if (movieId) {
        navigate(`/movie/${movieId}`);
      } else {
        toast.error('Movie details not found');
      }
    } catch (error) {
      toast.error('Error navigating to movie details');
    }
  };

  const fetchGroupDetails = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error('Authentication required');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroup(response.data);
    } catch (error) {
      setError('Failed to load group details');
      toast.error('Failed to load group details');
    }
  }, [id, navigate]);

  const fetchSharedMovies = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:3001/api/groups/${id}/movies`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSharedMovies(response.data);
    } catch (error) {
      toast.error('Failed to load shared movies');
    }
  }, [id]);

  const fetchSharedShowtimes = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:3001/api/groups/${id}/showtimes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSharedShowtimes(response.data);
    } catch (error) {
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
    const token = localStorage.getItem("token");

    try {
      const movieResponse = await axios.get(`http://localhost:3001/api/movies/tmdb/${tmdbMovieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const movieId = movieResponse.data.movieId;

      await axios.delete(`http://localhost:3001/api/groups/${id}/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSharedMovies(prevMovies => 
        prevMovies.filter(movie => movie.tmdb_movie_id !== tmdbMovieId)
      );
      toast.success('Movie removed successfully!');
    } catch (error) {
      console.error("Error removing movie:", error);
      toast.error('Failed to remove movie. Please try again.');
    } finally {
      setIsLoading(false);
      await fetchSharedMovies();
    }
  };

  const removeShowtime = async (showtimeId) => {
    if (isLoading) return;
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:3001/api/groups/${id}/showtimes/${showtimeId}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSharedShowtimes(prevShowtimes => 
        prevShowtimes.filter(showtime => showtime.showtimeid !== showtimeId)
      );
      toast.success('Showtime removed successfully!');
    } catch (error) {
      console.error("Error removing showtime:", error);
      toast.error('Failed to remove showtime. Please try again.');
    } finally {
      setIsLoading(false);
      await fetchSharedShowtimes();
    }
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

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
                      <h3 
                        onClick={() => handleMovieClick(movie.title)}
                        className={styles.clickableTitle}
                      >
                        {movie.title}
                      </h3>
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
                <div key={`content-${showtime.showtimeid}`} className={styles.sharedItemContent}>
                  <div key={`inner-${showtime.showtimeid}`}>
                    <h3 
                      onClick={() => handleMovieClick(showtime.movietitle)}
                      className={styles.clickableTitle}
                    >
                      {showtime.movietitle}
                    </h3>
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