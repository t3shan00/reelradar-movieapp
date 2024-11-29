import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserProfile, getFavoritesByUsername } from "../api";
import { Helmet } from "react-helmet";
import "./styles/Dashboard.css";
import "./styles/ProfilePage.css";

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileAndFavorites = async () => {
      try {
        const profileResponse = await getUserProfile(username);
        setProfile(profileResponse.data);

        const favoritesResponse = await getFavoritesByUsername(username);
        const tmdbBearerToken =
          "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTllNGRmMWY4ZDZhNmE1NDBjY2YyN2JiNmVmYzI1MyIsIm5iZiI6MTczMjAyNTU0Mi43Nzg4NDksInN1YiI6IjY3MzlmODRlNmEwMmEyNGQ3YjIxODE2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fXqSiWv07snaUkxoAsWteUTZNE1hdIuNNodLDtkC1nM";

        const promises = favoritesResponse.data.map((movie) =>
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
              console.error(
                `Error fetching TMDB data for movie ID ${movie.tmdb_movieid}`,
                err
              );
              return null;
            })
        );

        const movies = await Promise.all(promises);
        const validMovies = movies.filter((movie) => movie !== null);
        setFavorites(validMovies);
      } catch (err) {
        setError("Failed to fetch profile or favorite movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndFavorites();
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const generateShareLinks = () => {
    const profileUrl = `${window.location.origin}/profile/${username}`;
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        profileUrl
      )}&text=Check out my Favorite movies list on ReelRadar!`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        profileUrl
      )}`,
      whatsapp: `https://api.whatsapp.com/send?text=Check out my Favorite movies list on ReelRadar! ${encodeURIComponent(
        profileUrl
      )}`,
      email: `mailto:?subject=Check out my Favorite movies list on ReelRadar!&body=Check out my Favorite movies list on ReelRadar! ${encodeURIComponent(
        profileUrl
      )}`,
    };
  };

  const shareLinks = generateShareLinks();
  const isLoggedIn = !!localStorage.getItem("token");

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  const ogImage =
    favorites.length > 0
      ? `https://image.tmdb.org/t/p/w500/${favorites[0].poster_path}`
      : "https://localhost.com/path-to-default-image.jpg";

  const profileUrl = `${window.location.origin}/profile/${username}`;

  return (
    <div>
        <Helmet>
        <title>{`${profile.username}'s Profile - ReelRadar`}</title>
        <meta
          property="og:title"
          content={`${profile.username}'s Profile - ReelRadar`}
        />
        <meta
          property="og:description"
          content={`Check out ${profile.username}'s favorite movies on ReelRadar!`}
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={profileUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <h1>{profile.username}'s Profile</h1>

      {isLoggedIn && (
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      )}

      <h2 className="share-h2">Share Your Profile</h2>
      <div className="share-links">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button facebook"
        >
          Share on Facebook
        </a>
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button twitter"
        >
          Share on Twitter
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button linkedin"
        >
          Share on LinkedIn
        </a>
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button whatsapp"
        >
          Share on WhatsApp
        </a>
        <a
          href={shareLinks.email}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button email"
        >
          Share via Email
        </a>
      </div>

      <h2>Favorite Movies</h2>
      {favorites.length > 0 ? (
        <div className="favorite-movies-grid">
          {favorites.map((movie) => (
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
        <p>This user has not added any favorite movies yet.</p>
      )}
    </div>
  );
};

export default ProfilePage;
