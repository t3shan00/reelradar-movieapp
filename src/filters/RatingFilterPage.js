import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './RatingFilterPage.module.css';

const RatingFilterPage = () => {
  const [movies, setMovies] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_KEY = '6e9e4df1f8d6a6a540ccf27bb6efc253';

  const fetchMoviesByRating = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?vote_average.gte=${selectedRating}&sort_by=popularity.desc&page=${page}&api_key=${API_KEY}`
      );
      const data = await response.json();
      setMovies(prevMovies => page === 1 ? data.results : [...prevMovies, ...data.results]);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching movies by rating:", error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRating, API_KEY]);

  const handleApplyFilter = () => {
    setCurrentPage(1);
    fetchMoviesByRating(1);
  };

  useEffect(() => {
    if (selectedRating) {
      fetchMoviesByRating(currentPage);
    }
  }, [selectedRating, currentPage, fetchMoviesByRating]);

  const paginationRange = useMemo(() => {
    const delta = 2;
    const range = [];
    
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    return {
      first: 1,
      last: totalPages,
      range,
      hasPrevious: currentPage > 1,
      hasNext: currentPage < totalPages
    };
  }, [currentPage, totalPages]);

  return (
    <div className={styles.ratingFilterPage}>
      <h1>Filter by Rating</h1>
      <div className={styles.filterOptions}>
        <select 
          value={selectedRating} 
          onChange={(e) => setSelectedRating(e.target.value)}
          className={styles.ratingSelect}
        >
          <option value="">Select Rating</option>
          <option value="1">&gt; 1</option>
          <option value="2">&gt; 2</option>
          <option value="3">&gt; 3</option>
          <option value="4">&gt; 4</option>
          <option value="5">&gt; 5</option>
          <option value="6">&gt; 6</option>
          <option value="7">&gt; 7</option>
          <option value="8">&gt; 8</option>
          <option value="9">&gt; 9</option>
        </select>
        <button onClick={handleApplyFilter} className={styles.applyButton}>
          Apply Filter
        </button>
      </div>
      {isLoading && (
        <div style={{textAlign: 'center', color: 'black', padding: '2rem'}}>Loading movies...</div>
      )}
      {!isLoading && movies.length > 0 && (
        <div className={styles.moviesSection}>
          <div className={styles.moviesList}>
            {movies.slice((currentPage - 1) * 16, currentPage * 16).map(movie => (
              <div 
                key={movie.id} 
                className={styles.movieCard}
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title} 
                />
                <h3>{movie.title}</h3>
                <p>Rating: {movie.vote_average.toFixed(1)}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button 
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={!paginationRange.hasPrevious}
            >
              <ChevronLeft />
            </button>

            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!paginationRange.hasNext}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      )}
      {!isLoading && movies.length === 0 && (
        <div style={{textAlign: 'center', color: 'black', padding: '2rem'}}>
          No movies found for the selected rating range.
        </div>
      )}
    </div>
  );
};

export default RatingFilterPage;