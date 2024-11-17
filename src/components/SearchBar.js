import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';  // Import the search icon
import './SearchBar.css';

function SearchBar() {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for a movie..."
        className="search-input"
      />
      <button className="search-button">
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
}

export default SearchBar;
