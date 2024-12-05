import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, getFavoritesByUsername } from "../api";
import { Helmet } from "react-helmet";
import styles from './styles/ProfilePage.module.css';

const ProfilePage = () => {
  const { username } = useParams();
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

  const generateShareLinks = () => {
    const profileUrl = `${window.location.origin}/profile/${username}`;
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        profileUrl
      )}&text=Check out ${username}'s profile on ReelRadar!`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        profileUrl
      )}`,
      whatsapp: `https://api.whatsapp.com/send?text=Check out ${username}'s profile on ReelRadar! ${encodeURIComponent(
        profileUrl
      )}`,
      email: `mailto:?subject=Check out ${username}'s profile on ReelRadar!&body=Check out ${username}'s profile: ${encodeURIComponent(
        profileUrl
      )}`,
    };
  };

  const shareLinks = generateShareLinks();

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
    <div className={styles.profileContainer}>
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
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>{profile.username}'s Profile</h1>

        <h2 className={styles.shareTitle}>Share {username}'s Profile</h2>
        <div className={styles.shareLinks}>
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.facebook}
          >
            Share on Facebook
          </a>
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.twitter}
          >
            Share on Twitter
          </a>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkedin}
          >
            Share on LinkedIn
          </a>
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsapp}
          >
            Share on WhatsApp
          </a>
          <a
            href={shareLinks.email}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.email}
          >
            Share via Email
          </a>
        </div>

        <h2 className={styles.title}>Favorite Movies</h2>
        {favorites.length > 0 ? (
          <div className={styles.favoriteMoviesGrid}>
            {favorites.map((movie) => (
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
          <p className={styles.userInfo}>This user has not added any favorite movies yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
