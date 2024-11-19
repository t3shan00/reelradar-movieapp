import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/PopularMovies';
import MovieDetail from './components/MovieDetail';
import UpcomingMovies from './components/UpcomingMovies'; // Import UpcomingMovies
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const API_KEY = '6e9e4df1f8d6a6a540ccf27bb6efc253';
const BASE_URL = 'https://api.themoviedb.org/3';

function App() {
  const [movies, setMovies] = useState([]);

  // Movie info fetch code
  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <SearchBar />
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/" element={
            <>
              <MovieGrid movies={movies} />
              <UpcomingMovies /> {/* Add UpcomingMovies component here */}
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;