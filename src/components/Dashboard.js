import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import styles from './styles/Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userDetails = JSON.parse(localStorage.getItem("user"));

    if (!token || !userDetails) {
      navigate("/login"); 
    } else {
      setUser(userDetails);
    }
    const fetchFavorites = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/favorites", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch favorite movies");
        }

        const movieIds = await response.json(); 
        console.log("Fetched movie IDs:", movieIds);

        const tmdbBearerToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTllNGRmMWY4ZDZhNmE1NDBjY2YyN2JiNmVmYzI1MyIsIm5iZiI6MTczMjAyNTU0Mi43Nzg4NDksInN1YiI6IjY3MzlmODRlNmEwMmEyNGQ3YjIxODE2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fXqSiWv07snaUkxoAsWteUTZNE1hdIuNNodLDtkC1nM";

        const promises = movieIds.map((movie) =>
          fetch(`https://api.themoviedb.org/3/movie/${movie.tmdb_movieid}`, {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${tmdbBearerToken}`,
            },
          })
            .then((res) => res.json())
            .then((data) => ({
              tmdb_movieid: movie.tmdb_movieid,
              title: data.title,
              poster_path: data.poster_path,
              release_date: data.release_date,
              overview: data.overview,
            }))
            .catch((err) => {
              console.error(`Error fetching TMDB data for movie ID ${movie.tmdb_movieid}`, err);
              return null;
            })
        );

        const movies = await Promise.all(promises);
        const validMovies = movies.filter((movie) => movie !== null);
        setFavoriteMovies(validMovies);
      } catch (err) {
        console.error("Error fetching favorite movies:", err.message);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
  
      if (decodedToken.exp < currentTime) {
        handleLogout();
      } else {
        const timeout = (decodedToken.exp - currentTime) * 1000;
        setTimeout(handleLogout, timeout);
      }
    }
  }, [navigate, handleLogout]);

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await fetch("http://localhost:3001/user/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Account deleted successfully.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/signup"); // Redirect to signup page
        } else {
          const errorData = await response.json();
          alert(`Failed to delete account: ${errorData.error}`);
        }
      } catch (err) {
        console.error("Error deleting account:", err.message);
        alert("An error occurred while trying to delete your account. Please try again later.");
      }
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {user ? (
        <div className={styles.contentWrapper}>
          <h1 className={styles.title}>Welcome, {user.username || user.email}</h1>
          <div className={styles.userInfo}>
            <p>Email: {user.email}</p>
            <p>Username: {user.username}</p>
            <p>Public Profile: <a className={styles.userLink} href={`/profile/${user.username}`} target="_blank" rel="noopener noreferrer">{user.username}</a></p>
            <p>Member since {user.createdat ? new Date(user.createdat).toLocaleDateString() : "N/A"}</p>
          </div>
          <h2 className={styles.title}>Your Favorite Movies</h2>
          {favoriteMovies.length > 0 ? (
            <div className={styles.favoriteMoviesGrid}>
              {favoriteMovies.map((movie) => (
                <div key={movie.tmdb_movieid} className={styles.movieCard}>
                  <a href={`/movie/${movie.tmdb_movieid}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={movie.title || "Movie Poster"}
                      className={styles.moviePoster}
                    />
                    <p className={styles.movieTitle}>{movie.title}</p>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.userInfo}>You haven't added any favorite movies yet.</p>
          )}
          <div>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
            <button onClick={handleDeleteAccount} className={styles.deleteButton}>
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
