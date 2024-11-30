import React, { useEffect, useState, useMemo } from 'react';
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
  const navigate = useNavigate();

  const API_KEY = '6e9e4df1f8d6a6a540ccf27bb6efc253';

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${API_KEY}`;
    fetch(url)
      .then(res => res.json())
      .then(json => {
        setGenres(json.genres || []);
      })
      .catch(err => console.error("Error fetching genres:", err));
  }, [API_KEY]);

  const fetchMoviesByGenre = async (genreId, page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&page=${page}&api_key=${API_KEY}`);
      const data = await response.json();
      setMovies(prevMovies => page === 1 ? data.results : [...prevMovies, ...data.results]);
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

  return (
    <div className={styles.genrePage}>
      <h1>Select a Genre</h1>
      <div className={styles.genreList}>
        {Array.isArray(genres) && genres.length > 0 ? (
          genres.map(genre => (
            <button key={genre.id} onClick={() => handleGenreClick(genre.id)} className={styles.genreButton}>
              {genre.name}
            </button>
          ))
        ) : (
          <p>Loading genres...</p>
        )}
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
          No movies found for the selected genre.
        </div>
      )}
    </div>
  );
};

export default GenrePage;