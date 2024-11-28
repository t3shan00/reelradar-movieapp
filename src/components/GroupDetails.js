import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const GroupDetail = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [sharedMovies, setSharedMovies] = useState([]);
  const [sharedShowtimes, setSharedShowtimes] = useState([]);

  // Fetch group details
  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/groups/${id}`);
        const data = await response.json();
        setGroup(data);
        // Fetch shared movies and showtimes for the group
        setSharedMovies(data.sharedMovies || []);
        setSharedShowtimes(data.sharedShowtimes || []);
      } catch (error) {
        console.error("Error fetching group details:", error);
      }
    };

    fetchGroupDetails();
  }, [id]);

  // Share movie to group
  // const shareMovie = async (groupId, movieData) => {
  //   try {
  //       const response = await axios.post(`/api/groups/${groupId}/movies`, movieData);
  //       console.log('Movie shared successfully:', response.data);
  //   } catch (error) {
  //       console.error('Error sharing movie:', error.response?.data || error.message);
  //   }
  // };

  // Share showtime to group
  // const shareShowtime = async (groupId, showtimeData) => {
  //   try {
  //       const response = await axios.post(`/api/groups/${groupId}/showtimes`, showtimeData);
  //       console.log('Showtime shared successfully:', response.data);
  //   } catch (error) {
  //       console.error('Error sharing showtime:', error.response?.data || error.message);
  //   }
  // };

  return (
    <div className="group-detail">
      <h1>{group?.name}</h1>
      <p>{group?.description}</p>

      {/* Shared Movies Section */}
      <div className="shared-movies">
        <h2>Shared Movies</h2>
        {sharedMovies.length > 0 ? (
          sharedMovies.map(movie => (
            <div key={movie.movieId} className="shared-movie">
              <img 
                src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`} 
                alt={movie.title} 
              />
              <div>
                <h3>{movie.title}</h3>
                <p>Release Date: {movie.releaseDate}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No shared movies available.</p>
        )}
      </div>

      {/* Shared Showtimes Section */}
      <div className="shared-showtimes">
        <h2>Shared Showtimes</h2>
        {sharedShowtimes.length > 0 ? (
          sharedShowtimes.map((showtime, index) => (
            <div key={index} className="shared-showtime">
              <h3>{showtime.title}</h3>
              <p>Theatre: {showtime.theatre}</p>
              <p>Auditorium: {showtime.auditorium}</p>
              <p>Time: {new Date(showtime.startTime).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No shared showtimes available.</p>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;