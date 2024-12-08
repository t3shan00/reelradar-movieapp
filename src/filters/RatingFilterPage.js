// RatingFilterPage.js
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './RatingFilterPage.module.css';

const RatingFilterPage = () => {
  const [movies, setMovies] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const filterListRef = useRef(null);
  const navigate = useNavigate();

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const ratings = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const scrollRatings = (direction) => {
    if (filterListRef.current) {
      const scrollAmount = 200;
      filterListRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
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
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
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

  const renderFilterOptions = () => (
    <div className={styles.filterListWrapper}>
      <div className={styles.filterListContainer}>
        <button 
          className={`${styles.scrollButton} ${styles.scrollLeft}`}
          onClick={() => scrollRatings('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className={styles.filterList} ref={filterListRef}>
          {ratings.map(rating => (
            <button 
              key={rating}
              onClick={() => handleRatingClick(rating)}
              className={`${styles.ratingButton} ${selectedRating === rating ? styles.selected : ''}`}
            >
              {`> ${rating}`}
            </button>
          ))}
        </div>

        <button 
          className={`${styles.scrollButton} ${styles.scrollRight}`}
          onClick={() => scrollRatings('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.ratingFilterPage}>
      <h1>Filter by Rating</h1>
      {renderFilterOptions()}
      
      {isLoading && (
        <div className={styles.loadingState}>Loading movies...</div>
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
                  loading="lazy"
                />
                <h3>{movie.title}</h3>
                <p>Rating: {movie.vote_average.toFixed(1)}</p>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button 
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={!paginationRange.hasPrevious}
              aria-label="Previous page"
            >
              <ChevronLeft />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!paginationRange.hasNext}
              aria-label="Next page"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      )}
      
      {!isLoading && movies.length === 0 && (
        <div className={styles.emptyState}>
          No movies found for the selected rating range.
        </div>
      )}
    </div>
  );
};

export default RatingFilterPage;