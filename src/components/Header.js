import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser , faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
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
        <h1 className="title" onClick={() => navigate('/')}>ReelRadar</h1>
      </div>
      <div className="icons">
        <span className="icon" onClick={() => navigate('/login')}> {/* Make the icon clickable */}
          <FontAwesomeIcon icon={faUser } />
        </span>
      </div>
      {menuVisible && (
        <div className={`menu ${menuVisible ? 'menu-visible' : ''}`} ref={menuRef}>
          <ul>
            <li onClick={() => navigate('/genres')}>Genres</li>
            <li onClick={() => navigate('/path2')}>Filter by Year</li>
            <li onClick={() => navigate('/path2')}>Filter by Rating</li>
            <li onClick={() => navigate('/path2')}>Groups</li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;