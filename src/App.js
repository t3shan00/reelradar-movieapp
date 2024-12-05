import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/PopularMovies';
import MovieDetail from './components/MovieDetail';
import UpcomingMovies from './components/UpcomingMovies';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import GenrePage from './filters/GenrePage';
import YearFilterPage from './filters/YearFilterPage';
import ShowTimes from './components/ShowTimes';
import RatingFilterPage from './filters/RatingFilterPage';
import GroupManagement from './components/GroupManagement';
import GroupDetail from './components/GroupDetails';
import ManageGroup from './components/ManageGroup';
import ProfilePage from './components/ProfilePage';
import AllReviewsPage from "./components/AllReviewsPage";

const API_KEY = '6e9e4df1f8d6a6a540ccf27bb6efc253';
const BASE_URL = 'https://api.themoviedb.org/3';

function App() {
  const [movies, setMovies] = useState([]);

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

  const RouteListener = () => {
    const location = useLocation();

    useEffect(() => {
      if (location.pathname !== '/login') {
        sessionStorage.setItem('lastPage', location.pathname + location.search);
      }
    }, [location]);

    return null;
  };

  return (
    <Router>
      <div className={styles.App}>
        <Header />
        <RouteListener />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/genres" element={<GenrePage />} />
          <Route path="/filter-by-year" element={<YearFilterPage />} />
          <Route path="/filter-by-rating" element={<RatingFilterPage />} />
          <Route path="/showtimes" element={<ShowTimes />} />
          <Route path="/groups" element={<GroupManagement />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/groups/:groupId/manage" element={<ManageGroup />} />
          <Route path="/reviews" element={<AllReviewsPage />} />
          <Route path="/" element={
            <>
              <SearchBar />
              <MovieGrid movies={movies} />
              <UpcomingMovies />
            </>
          } />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App;