import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in by looking for token and user data
    const token = localStorage.getItem("token");
    const userDetails = JSON.parse(localStorage.getItem("user"));

    if (!token || !userDetails) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      setUser(userDetails);
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data and token on logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {user ? (
        <>
          <h1>Welcome to the Dashboard, {user.username || user.email}</h1>
          <p>Your email: {user.email}</p>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
