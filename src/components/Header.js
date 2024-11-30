import React, { useState, useRef, useEffect } from 'react';
import styles from './styles/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    const intervalId = setInterval(() => {
      if (!isTokenValid()) {
        handleLogout();
      } else {
        refreshToken();
      }
    }, 60000); // Check every minute

    const activityEvents = ['click', 'mousemove', 'keydown'];
    activityEvents.forEach(event => {
      window.addEventListener(event, refreshToken);
    });

    return () => {
      clearInterval(intervalId);
      activityEvents.forEach(event => {
        window.removeEventListener(event, refreshToken);
      });
    };
  }, []);

  const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    return Date.now() < expiry;
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
    } catch (err) {
      console.error('Failed to refresh token:', err);
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    window.location.reload();
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <button className={styles.menuButton} onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h1 className={styles.title} onClick={() => handleNavigate('/')}>ReelRadar</h1>
      </div>
      <div className={styles.icons}>
        <span className={styles.showtimesText} onClick={() => handleNavigate('/showtimes')}>Showtimes</span>
        
        {user ? (
          <>
            <span className={styles.username} onClick={() => handleNavigate('/dashboard')}>{user.username || user.email}</span>
            <span className={styles.icon} onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </span>
          </>
        ) : (
          <span className={styles.icon} onClick={() => handleNavigate('/login')}>
            <FontAwesomeIcon icon={faUser} />
          </span>
        )}
      </div>
      {menuVisible && (
        <div className={`${styles.menu} ${menuVisible ? styles.menuVisible : ''}`} ref={menuRef}>
          <ul>
            <li onClick={() => handleNavigate('/genres')}>Filter Movies by Genre</li>
            <li onClick={() => handleNavigate('/filter-by-year')}>Filter Movies by Year</li>
            <li onClick={() => handleNavigate('/filter-by-rating')}>Filter Movies by Rating</li>
            <li onClick={() => handleNavigate('/groups')}>Groups</li>
            <li onClick={() => handleNavigate('/reviews')}>Browse Reviews</li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;