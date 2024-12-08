import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './GenrePage.module.css';

const GenrePage = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const genreListRef = useRef(null);
  const navigate = useNavigate();

  const API_KEY = '6e9e4df1f8d6a6a540ccf27bb6efc253';

  const scrollGenres = (direction) => {
    if (genreListRef.current) {
      const scrollAmount = 200;
      genreListRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${API_KEY}`;
    fetch(url)
      .then(res => res.json())
      .then(json => {
        setGenres(json.genres || []);
      })
      .catch(err => console.error("Error fetching genres:", err));
  }, []);

  const fetchMoviesByGenre = async (genreId, page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&page=${page}&api_key=${API_KEY}`
      );
      const data = await response.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
    fetchMoviesByGenre(genreId, 1);
  };

  useEffect(() => {
    if (selectedGenre) {
      fetchMoviesByGenre(selectedGenre, currentPage);
    }
  }, [selectedGenre, currentPage]);

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

  const renderGenreList = () => (
    <div className={styles.genreListWrapper}>
      <div className={styles.genreListContainer}>
        <button 
          className={`${styles.scrollButton} ${styles.scrollLeft}`}
          onClick={() => scrollGenres('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className={styles.genreList} ref={genreListRef}>
          {genres.length > 0 ? (
            genres.map(genre => (
              <button 
                key={genre.id} 
                onClick={() => handleGenreClick(genre.id)} 
                className={`${styles.genreButton} ${selectedGenre === genre.id ? styles.selected : ''}`}
              >
                {genre.name}
              </button>
            ))
          ) : (
            <p>Loading genres...</p>
          )}
        </div>

        <button 
          className={`${styles.scrollButton} ${styles.scrollRight}`}
          onClick={() => scrollGenres('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );

  const renderMovies = () => (
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
  );

  return (
    <div className={styles.genrePage}>
      <h1>Select a Genre</h1>
      {renderGenreList()}
      
      {isLoading && (
        <div className={styles.loadingState}>Loading movies...</div>
      )}
      
      {!isLoading && movies.length > 0 && renderMovies()}
      
      {!isLoading && movies.length === 0 && (
        <div className={styles.emptyState}>
          No movies found for the selected genre.
        </div>
      )}
    </div>
  );
};

export default GenrePage;