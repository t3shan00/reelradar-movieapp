import React from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faUser } from '@fortawesome/free-solid-svg-icons';

function Header() {
  return (
    <header className="header">
      <h1 className="title">ReelRadar</h1>
      <div className="icons">
        <span className="icon"><FontAwesomeIcon icon={faRightToBracket} /></span>
        <span className="icon"><FontAwesomeIcon icon={faUser} /></span>
      </div>
    </header>
  );
}

export default Header;
