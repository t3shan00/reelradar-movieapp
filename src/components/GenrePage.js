import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GenrePage.css';

const GenrePage = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
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

  const fetchMoviesByGenre = async (genreId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&api_key=${API_KEY}`);
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
    }
  };

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    fetchMoviesByGenre(genreId);
  };

  return (
    <div className="genre-page">
      <h1>Select a Genre</h1>
      <div className="genre-list">
        {Array.isArray(genres) && genres.length > 0 ? (
          genres.map(genre => (
            <button key={genre.id} onClick={() => handleGenreClick(genre.id)} className="genre-button">
              {genre.name}
            </button>
          ))
        ) : (
          <p>Loading genres...</p>
        )}
      </div>
      {selectedGenre && (
        <div className="movies-section">
          <h2>Movies in {genres.find(g => g.id === selectedGenre)?.name}:</h2>
          <div className="movies-list">
            {movies.map(movie => (
              <div key={movie.id} className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <h3>{movie.title}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenrePage;
