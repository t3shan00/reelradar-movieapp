import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/GroupDetail.css';

const GroupDetail = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [sharedMovies, setSharedMovies] = useState([]);
  const [sharedShowtimes, setSharedShowtimes] = useState([]);

  // Fetch group details
  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/groups/${id}`);
        setGroup(response.data);
      } catch (error) {
        console.error("Error fetching group details:", error);
      }
    };

    const fetchSharedMovies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3001/api/groups/${id}/movies`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSharedMovies(response.data);
      } catch (error) {
        console.error("Error fetching shared movies:", error);
      }
    };

    const fetchSharedShowtimes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3001/api/groups/${id}/showtimes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSharedShowtimes(response.data);
      } catch (error) {
        console.error("Error fetching shared showtimes:", error);
      }
    };

    fetchGroupDetails();
    fetchSharedMovies();
    fetchSharedShowtimes();
  }, [id]);

  return (
    <div className="group-detail">
      <div className="group-header">
        <h1>{group?.name}</h1>
        <p>{group?.description}</p>
      </div>

      {/* Shared Movies Section */}
      <div className="shared-section">
        <h2>Shared Movies</h2>
        <div className="shared-movies">
          {sharedMovies.length > 0 ? (
            sharedMovies.map(movie => (
              <div key={movie.tmdb_movie_id} className="shared-item">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.posterpath}`} 
                  alt={movie.title} 
                />
                <div className="shared-item-content">
                  <div>
                    <h3>{movie.title}</h3>
                    <p>Release Date: {movie.releasedate}</p>
                    <p>Shared By: {movie.sharedbyusername}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No shared movies available.</p>
          )}
        </div>
      </div>

      {/* Shared Showtimes Section */}
      <div className="shared-section">
        <h2>Shared Showtimes</h2>
        <div className="shared-showtimes">
          {sharedShowtimes.length > 0 ? (
            sharedShowtimes.map((showtime, index) => (
              <div key={index} className="shared-item">
                <div className="shared-item-content">
                  <div>
                    <h3>{showtime.movietitle}</h3>
                    <p>Theatre: {showtime.theatre}</p>
                    <p>Auditorium: {showtime.auditorium}</p>
                    <p>Time: {new Date(showtime.starttime).toLocaleString()}</p>
                    <p>Shared By: {showtime.sharedbyusername}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No shared showtimes available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;