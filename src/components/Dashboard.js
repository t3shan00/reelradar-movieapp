import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
    <div className="dashboard-container">
      {user ? (
        <>
          <h1>Welcome to the Dashboard, {user.username || user.email}</h1>
          <p>Your email: {user.email}</p>

          <h2>Your Favorite Movies</h2>
          {favoriteMovies.length > 0 ? (
            <div className="favorite-movies-grid">
              {favoriteMovies.map((movie) => (
                <div key={movie.tmdb_movieid} className="favorite-movie-card">
                  <a href={`/movie/${movie.tmdb_movieid}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={movie.title || "Movie Poster"}
                      className="favorite-movie-poster"
                    />
                  </a>
                  <p>{movie.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven't added any favorite movies yet.</p>
          )}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
          <button onClick={handleDeleteAccount} className="delete-account-button">
            Delete Account
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
