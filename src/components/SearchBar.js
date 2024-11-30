import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/SearchBar.module.css';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchBarRef = useRef(null);
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
      setIsResultsVisible(true);
    } else {
      setSearchResults([]);
      setIsResultsVisible(false);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    setIsResultsVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputClick = () => {
    if (searchTerm) {
      setIsResultsVisible(true);
    }
  };

  return (
    <div className={styles.searchBar} ref={searchBarRef}>
      <input
        type="text"
        placeholder="Search for a movie..."
        className={styles.searchInput}
        value={searchTerm}
        onChange={handleInputChange}
        onClick={handleInputClick}
      />
      <button className={styles.searchButton}>
        <FontAwesomeIcon icon={faSearch} />
      </button>
      {isResultsVisible && searchResults.length > 0 && (
        <ul className={styles.searchResults}>
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