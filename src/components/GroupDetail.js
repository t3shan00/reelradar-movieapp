import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const GroupDetail = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [movie, setMovie] = useState('');
  const [showtime, setShowtime] = useState('');

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/groups/${id}`);
        const data = await response.json();
        setGroup(data);
      } catch (error) {
        console.error("Error fetching group details:", error);
      }
    };

    fetchGroupDetails();
  }, [id]);

  const handleAddMovie = async () => {
    // Logic to add movie to the group's page
  };

  const handleAddShowtime = async () => {
    // Logic to add showtime to the group's page
  };

  if (!group) return <div>Loading...</div>;

  return (
    <div>
      <h1>{group.name}</h1>
      <p>{group.description}</p>

      <h2>Add Movie</h2>
      <input
        type="text"
        value={movie}
        onChange={(e) => setMovie(e.target.value)}
        placeholder="Movie title"
      />
      <button onClick={handleAddMovie}>Add Movie</button>

      <h2>Add Showtime</h2>
      <input
        type="text"
        value={showtime}
        onChange={(e) => setShowtime(e.target.value)}
        placeholder="Showtime details"
      />
      <button onClick={handleAddShowtime}>Add Showtime</button>
    </div>
  );
};

export default GroupDetail;