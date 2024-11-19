import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false); // Track visibility of results
  const searchBarRef = useRef(null); // Reference for the search bar container
  const navigate = useNavigate();

  const fetchMovies = async (term) => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${term}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTllNGRmMWY4ZDZhNmE1NDBjY2YyN2JiNmVmYzI1MyIsIm5iZiI6MTczMjAyNTU0Mi43Nzg4NDksInN1YiI6IjY3MzlmODRlNmEwMmEyNGQ3YjIxODE2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fXqSiWv07snaUkxoAsWteUTZNE1hdIuNNodLDtkC1nM'
      }
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      fetchMovies(value);
      setIsResultsVisible(true); // Show results when typing
    } else {
      setSearchResults([]);
      setIsResultsVisible(false); // Hide results if input is empty
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    setIsResultsVisible(false); // Hide results when a movie is clicked
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsResultsVisible(false); // Hide results if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show results when clicking on the input
  const handleInputClick = () => {
    if (searchTerm) {
      setIsResultsVisible(true); // Show results if there is a search term
    }
  };

  return (
    <div className="search-bar" ref={searchBarRef}>
      <input
        type="text"
        placeholder="Search for a movie..."
        className="search-input"
        value={searchTerm}
        onChange={handleInputChange}
        onClick={handleInputClick} // Show results on input click
      />
      <button className="search-button">
        <FontAwesomeIcon icon={faSearch} />
      </button>
      {isResultsVisible && searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.slice(0, 4).map(movie => (
            <li key={movie.id} onClick={() => handleMovieClick(movie.id)}>
              {movie.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
