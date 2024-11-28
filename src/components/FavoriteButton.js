import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Import the star icon
import "./styles/FavoriteButton.css";

const FavoriteButton = ({ movieId }) => {
  const [isFavorite, setIsFavorite] = useState(null); 
  const [user, setUser ] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieId) {
      console.error("Error: movieId is undefined.");
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser (userData);

      // Fetch favorite status
      fetch(`http://localhost:3001/api/favorites/${movieId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch favorite status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setIsFavorite(data.isFavorite); 
        })
        .catch((err) => {
          console.error("Error fetching favorite status:", err.message);
          setIsFavorite(false); 
        });
    } else {
      setIsFavorite(false); 
    }
  }, [movieId]);

  const handleFavoriteToggle = () => {
    console.log("Toggling favorite status for movieId:", movieId); 

    if (!movieId) {
      console.error("Error: Cannot toggle favorite status because movieId is undefined.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const url = `http://localhost:3001/api/favorites/${movieId}`;
    const method = isFavorite ? "DELETE" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to toggle favorite status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setIsFavorite(!isFavorite); 
      })
      .catch((err) => {
        console.error("Error toggling favorite status:", err.message);
      });
  };

  if (isFavorite === null) {
    return (
      <div className="favorite-section">
        <button className="favorite-button loading" disabled>
          Loading...
        </button>
      </div>
    );
  }

  return (
    <div className="favorite-section">
      {user ? (
        <button
          onClick={handleFavoriteToggle}
          className={`favorite-button ${isFavorite ? "favorited" : ""}`}
        >
          <FontAwesomeIcon icon={faStar} /> {/* Add the star icon here */}
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
      ) : (
        <div className="favorite-disabled">
          <button disabled className="favorite-button disabled">
            <FontAwesomeIcon icon={faStar} /> {/* Add the star icon here */}
            Add to Favorites
          </button>
          <p>
            Please <a href="/login">log in</a> to add this movie to your favorites.
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoriteButton;