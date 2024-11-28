import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './styles/ShareMovieButton.css';

const ShareButton = ({ movieId, movie }) => {
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
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
      }
    };

    fetchUserGroups();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

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
      tmdbMovieId: movieId,
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="share-section">
      <button className="share-button" onClick={toggleMenu}>Share to Group</button>
      <div ref={menuRef} className={`share-menu ${menuOpen ? 'open' : ''}`}>
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
  );
};

export default ShareButton;