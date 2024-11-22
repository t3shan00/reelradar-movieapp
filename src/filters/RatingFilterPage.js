import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RatingFilterPage.css';

const RatingFilterPage = () => {
  const [movies, setMovies] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const navigate = useNavigate();

  const API_KEY = '6e9e4df1f8d6a6a540ccf27bb6efc253';

  const fetchMoviesByRating = async (rating) => {
    try {
      const minRating = rating;
      const maxRating = rating + 0.9;
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?vote_average.gte=${minRating}&vote_average.lte=${maxRating}&sort_by=popularity.desc&api_key=${API_KEY}`
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error("Error fetching movies by rating:", error);
    }
  };

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    fetchMoviesByRating(rating);
  };

  return (
    <div className="rating-filter-page">
      <h1>Select a Rating (1 to 10)</h1>
      <div className="rating-list">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
          <button key={rating} onClick={() => handleRatingClick(rating)} className="rating-button">
            {rating}
          </button>
        ))}
      </div>
      {selectedRating && (
        <div className="movies-section">
          <h2>Movies with Rating {selectedRating}:</h2>
          <div className="movies-list">
            {movies.map(movie => (
              <div key={movie.id} className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <h3>{movie.title}</h3>
                <p>Rating: {movie.vote_average.toFixed(1)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingFilterPage;