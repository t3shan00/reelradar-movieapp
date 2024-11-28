import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/MovieDetail.css';
import FavoriteButton from "./FavoriteButton";
import ReviewSection from "./ReviewSection";

const formatRuntime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [cinemaAreas, setCinemaAreas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState('');
  const [showtimes, setShowtimes] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    const fetchMovieDetail = async () => {
      const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTllNGRmMWY4ZDZhNmE1NDBjY2YyN2JiNmVmYzI1MyIsIm5iZiI6MTczMjAyNTU0Mi43Nzg4NDksInN1YiI6IjY3MzlmODRlNmEwMmEyNGQ3YjIxODE2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fXqSiWv07snaUkxoAsWteUTZNE1hdIuNNodLDtkC1nM'
        }
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError(error.message);
      }
    };

    const fetchCinemaAreas = async () => {
      try {
        const response = await fetch('https://www.finnkino.fi/xml/TheatreAreas/');
        const xml = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'application/xml');
        const theatres = xmlDoc.getElementsByTagName('TheatreArea');
        const areas = Array.from(theatres).map((theatre) => ({
          id: theatre.getElementsByTagName('ID')[0].textContent,
          name: theatre.getElementsByTagName('Name')[0].textContent,
        }));
        setCinemaAreas(areas);
      } catch (error) {
        console.error("Error fetching cinema locations:", error);
      }
    };

    const fetchUserGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3001/api/groups/my-groups",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched user groups:", response.data);
        setUserGroups(response.data);
      } catch (err) {
        console.error("Failed to load user groups:", err);
        setError("Failed to load user groups. Please try again.");
      }
    };

    fetchMovieDetail();
    fetchCinemaAreas();
    fetchUserGroups();
  }, [id]);

  const fetchShowtimes = async (cinemaId) => {
    try {
      const response = await fetch(`https://www.finnkino.fi/xml/Schedule/?area=${cinemaId}`);
      const xml = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'application/xml');
      const shows = xmlDoc.getElementsByTagName('Show');
      const showtimesData = Array.from(shows)
        .filter(show => show.getElementsByTagName('Title')[0].textContent === movie.title)
        .map(show => ({
          id: show.getElementsByTagName('ID')[0].textContent,
          startTime: show.getElementsByTagName('dttmShowStart')[0].textContent,
          theatre: show.getElementsByTagName('Theatre')[0].textContent,
          auditorium: show.getElementsByTagName('TheatreAuditorium')[0].textContent,
        }));
      setShowtimes(showtimesData);
    } catch (error) {
      console.error("Error fetching showtimes:", error);
    }
  };

  const handleCinemaSelection = (e) => {
    const cinemaId = e.target.value;
    setSelectedCinema(cinemaId);
    if (cinemaId) {
      fetchShowtimes(cinemaId);
    }
  };

  const handleGroupSelection = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const groupId = selectedOption.getAttribute('data-group-id');
    console.log('Selected option:', selectedOption);
    console.log('Group ID from data attribute:', groupId);
    setSelectedGroup(groupId);
    console.log(`Selected group ID: ${groupId}`);
  };

  const shareMovieToGroup = async () => {
    if (!selectedGroup) {
      alert("Please select a group to share the movie.");
      return;
    }
  
    const token = localStorage.getItem("token");
    const movieData = {
      tmdbMovieId: movie.id,
      title: movie.title,
      releaseDate: movie.release_date,
      runtime: movie.runtime,
      overview: movie.overview,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      voteAverage: movie.vote_average
    };
  
    try {
      console.log(`Sharing movie to group ID: ${selectedGroup}`);
      console.log("Movie data being shared:", movieData);
      const response = await axios.post(
        `http://localhost:3001/api/groups/${selectedGroup}/movies`,
        movieData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Share movie response:", response);
      alert("Movie shared successfully!");
    } catch (err) {
      console.error("Failed to share movie:", err);
      alert("Failed to share movie. Please try again.");
    }
  };

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  if (!movie) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="movie-detail">
      <div className="backdrop-container">
        <div className="backdrop-overlay"></div>
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt=""
          className="backdrop-image"
        />
      </div>

      <div className="content-container">
        <div className="movie-grid">
          <div className="poster-section">
            <div className="poster-wrapper">
              <img
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
            </div>
          </div>

          <div className="details-section">
            <h1 className="movie-title">{movie.title}</h1>
            <div className="metadata-container">
              <div className="metadata-item">
                <span className="icon-star">⭐</span>
                <span>{movie.vote_average.toFixed(1)}/10</span>
              </div>
              <div className="metadata-item">
                <span className="icon-calendar">📅</span>
                <span>{movie.release_date}</span>
              </div>
              {movie.runtime && (
                <div className="metadata-item">
                  <span className="icon-clock">⏱️</span>
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>

            <div className="genres-container">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  🏷️ {genre.name}
                </span>
              ))}
            </div>

            <div className="overview-section">
              <h2 className="section-title">Overview</h2>
              <p className="overview-text">{movie.overview}</p>
            </div>

            <div className="showtimes-section">
              <h2>Select Cinema Location:</h2>
              <select onChange={handleCinemaSelection} value={selectedCinema}>
                <option value="">-- Choose a Cinema --</option>
                {cinemaAreas.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>

              <div className="showtimes-display">
                {showtimes.length > 0 ? (
                  showtimes.map(showtime => (
                    <div key={showtime.id} className="showtime-item">
                      <p><span>Cinema:</span> {showtime.theatre}</p>
                      <p><span>Auditorium:</span> {showtime.auditorium}</p>
                      <p><span>Start Time:</span> {new Date(showtime.startTime).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p>No showtimes available for the selected Movie or Location.</p>
                )}
              </div>
            </div>
          </div>

          <FavoriteButton movieId={movie.id} />
          <div className="share-section">
            <h2>Share Movie to Group:</h2>
            <select onChange={handleGroupSelection} value={selectedGroup}>
              <option value="">-- Choose a Group --</option>
              {userGroups.map(group => (
                <option key={group.group_id} value={group.group_id} data-group-id={group.group_id}>
                  {group.name}
                </option>
              ))}
            </select>
            <button onClick={shareMovieToGroup}>Share</button>
          </div>
        </div>
      </div>
      <ReviewSection />
    </div>
  );
};

export default MovieDetail;