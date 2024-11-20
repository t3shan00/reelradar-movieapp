import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetail.css';

const formatRuntime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTllNGRmMWY4ZDZhNmE1NDBjY2YyN2JiNmVmYzI1MyIsIm5iZiI6MTczMjAyNTU0Mi43Nzg4NDksInN1YiI6IjY3MzlmODRlNmEwMmEyNGQ3YjIxODE2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fXqSiWv07snaUkxoAsWteUTZNE1hdIuNNodLDtkC1nM'
        }
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError(error.message);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  if (!movie) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="movie-detail">
      {/* Backdrop */}
      <div className="backdrop-container">
        <div className="backdrop-overlay"></div>
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt=""
          className="backdrop-image"
        />
      </div>

      <div className="content-container">
        <div className="movie-grid">
          {/* Poster */}
          <div className="poster-section">
            <div className="poster-wrapper">
              <img
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
            </div>
          </div>

          {/* Movie Details */}
          <div className="details-section">
            <h1 className="movie-title">{movie.title}</h1>

            {/* Movie Meta */}
            <div className="metadata-container">
              <div className="metadata-item">
                <span className="icon-star">⭐</span>
                <span>{movie.vote_average.toFixed(1)}/10</span>
              </div>
              <div className="metadata-item">
                <span className="icon-calendar">📅</span>
                <span>{movie.release_date}</span>
              </div>
              {movie.runtime && (
                <div className="metadata-item">
                  <span className="icon-clock">⏱️</span>
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="genres-container">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  🏷️ {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="overview-section">
              <h2 className="section-title">Overview</h2>
              <p className="overview-text">{movie.overview}</p>
            </div>

            {/* Additional Info */}
            <div className="additional-info">
              {movie.budget > 0 && (
                <div className="info-card">
                  <h3 className="info-title">Budget</h3>
                  <p className="info-text">${movie.budget.toLocaleString()}</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div className="info-card">
                  <h3 className="info-title">Revenue</h3>
                  <p className="info-text">${movie.revenue.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;