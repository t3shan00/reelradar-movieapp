import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './YearFilterPage.css';

const YearFilterPage = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const API_KEY = '6e9e4df1f8d6a6a540ccf27bb6efc253';

  useEffect(() => {
    // Generate a list of years from 2000 to the current year
    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);
    setYears(yearsArray);
  }, []);

  const fetchMoviesByYear = async (year) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&api_key=${API_KEY}`);
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error("Error fetching movies by year:", error);
    }
  };

  const handleYearClick = (year) => {
    setSelectedYear(year);
    fetchMoviesByYear(year);
  };

  return (
    <div className="year-filter-page">
      <h1>Select a Year</h1>
      <div className="year-list">
        {years.map(year => (
          <button key={year} onClick={() => handleYearClick(year)} className="year-button">
            {year}
          </button>
        ))}
      </div>
      {selectedYear && (
        <div className="movies-section">
          <h2>Movies released in {selectedYear}:</h2>
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

export default YearFilterPage;
