import React from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faUser  } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Header() {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <header className="header">
      <h1 className="title" onClick={() => navigate('/')}>ReelRadar</h1> {/* Add onClick handler */}
      <div className="icons">
        <span className="icon"><FontAwesomeIcon icon={faRightToBracket} /></span>
        <span className="icon"><FontAwesomeIcon icon={faUser } /></span>
      </div>
    </header>
  );
}

export default Header;