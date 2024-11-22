import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/FavoriteButton.css";

const FavoriteButton = ({ movieId }) => {
  const [isFavorite, setIsFavorite] = useState(null); // null indicates loading state
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user and favorite status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);

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
          setIsFavorite(data.isFavorite); // Set favorite status from API response
        })
        .catch((err) => {
          console.error("Error fetching favorite status:", err.message);
          setIsFavorite(false); // Assume not favorite if error occurs
        });
    } else {
      setIsFavorite(false); // Assume not favorite if user is not logged in
    }
  }, [movieId]);

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
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
        setIsFavorite(!isFavorite); // Toggle the state on success
      })
      .catch((err) => {
        console.error("Error toggling favorite status:", err.message);
      });
  };

  if (isFavorite === null) {
    // Show loading state
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
          {isFavorite ? "Remove from Favorite" : "Add to Favorite"}
        </button>
      ) : (
        <div className="favorite-disabled">
          <button disabled className="favorite-button disabled">
            Add to Favorite
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
