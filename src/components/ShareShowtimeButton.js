import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './styles/ShareShowtimeButton.module.css';

const ShareShowtimeButton = ({ showtime }) => {
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
        setUserGroups(response.data);
      } catch (err) {
        console.error("Failed to load user groups:", err);
      }
    };

    fetchUserGroups();
  }, []);

  const handleGroupSelection = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const groupId = selectedOption.getAttribute('data-group-id');
    setSelectedGroup(groupId);
  };

  const shareShowtimeToGroup = async () => {
    if (!selectedGroup) {
      alert("Please select a group to share the showtime.");
      return;
    }
  
    const token = localStorage.getItem("token");
    const showtimeData = {
      tmdbMovieId: showtime.id,
      title: showtime.title,
      startTime: showtime.startTime,
      theatre: showtime.theatre,
      auditorium: showtime.auditorium,
      imageUrl: showtime.imageUrl
    };
  
    try {
      const response = await axios.post(
        `http://localhost:3001/api/groups/${selectedGroup}/showtimes`,
        showtimeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Share showtime response:", response);
      alert("Showtime shared successfully!");
    } catch (err) {
      if (err.response) {
        console.error("Server responded with an error:", err.response.data);
      } else {
        console.error("Failed to share showtime:", err);
      }
      alert("Failed to share showtime. Please try again.");
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMouseLeave = () => {
    setMenuOpen(false);
  };

  return (
    <div className={styles.shareSection}>
      <button className={styles.shareButton} onClick={toggleMenu}>Share Showtime</button>
      <div ref={menuRef} className={`${styles.shareMenu} ${menuOpen ? styles.open : ''}`} onMouseLeave={handleMouseLeave}>
        <select onChange={handleGroupSelection} value={selectedGroup}>
          <option value="">-- Choose a Group --</option>
          {userGroups.map(group => (
            <option key={group.group_id} value={group.group_id} data-group-id={group.group_id}>
              {group.name}
            </option>
          ))}
        </select>
        <button onClick={shareShowtimeToGroup}>Share</button>
      </div>
    </div>
  );
};

export default ShareShowtimeButton;