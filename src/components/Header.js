import React, { useState, useRef, useEffect } from 'react';
import './styles/Header.css';
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
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
    <header className="header">
      <div className="header-content">
        <button className="menu-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h1 className="title" onClick={() => handleNavigate('/')}>ReelRadar</h1>
      </div>
      <div className="icons">
        <span className="showtimes-text" onClick={() => handleNavigate('/showtimes')}>Showtimes</span>
        
        {user && (
          <>
            <span className="username" onClick={() => handleNavigate(user ? '/dashboard' : '/login')}>{user.username || user.email}</span>
            <span className="icon" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </span>
          </>
        )}
        <span className="icon" onClick={() => handleNavigate(user ? '/dashboard' : '/login')}>
          <FontAwesomeIcon icon={faUser} />
        </span>
      </div>
      {menuVisible && (
        <div className={`menu ${menuVisible ? 'menu-visible' : ''}`} ref={menuRef}>
          <ul>
            <li onClick={() => handleNavigate('/genres')}>Filter Movies by Genre</li>
            <li onClick={() => handleNavigate('/filter-by-year')}>Filter Movies by Year</li>
            <li onClick={() => handleNavigate('/filter-by-rating')}>Filter Movies by Rating</li>
            <li onClick={() => handleNavigate('/groups')}>Groups</li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;