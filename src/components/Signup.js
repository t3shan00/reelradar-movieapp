import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import "./styles/Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isUsernameFocused, setUsernameFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);

  const navigate = useNavigate(); // For navigation

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // Redirect to dashboard
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(email, username, password);

      // Show success message in popup
      setMessage(`Register successful! Welcome, ${response.data.username}`);
      setShowPopup(true);

      // Clear input fields after successful signup
      setEmail("");
      setUsername("");
      setPassword("");
    } catch (error) {
      // Handle unique constraint violations
      if (error.response?.data?.error?.includes("users_username_key")) {
        setMessage("The username already exists. Please choose a different one.");
      } else if (error.response?.data?.error?.includes("users_email_key")) {
        setMessage("The email address is already registered. Please use a different email.");
      } else {
        setMessage("Registration failed! Please try again.");
      }
    }
  };

  const closePopup = () => {
    setShowPopup(false); // Hide popup
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className={`floating-label ${isEmailFocused || email ? "focused" : ""}`}>
              Email
            </label>
            <input
              type="email"
              className="input-field"
              value={email}
              onFocus={() => setEmailFocused(true)}
              onBlur={(e) => setEmailFocused(e.target.value !== "")}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className={`floating-label ${isUsernameFocused || username ? "focused" : ""}`}>
              Username
            </label>
            <input
              type="text"
              className="input-field"
              value={username}
              onFocus={() => setUsernameFocused(true)}
              onBlur={(e) => setUsernameFocused(e.target.value !== "")}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className={`floating-label ${isPasswordFocused || password ? "focused" : ""}`}>
              Password
            </label>
            <input
              type="password"
              className="input-field"
              value={password}
              onFocus={() => setPasswordFocused(true)}
              onBlur={(e) => setPasswordFocused(e.target.value !== "")}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p>
            <a href="/login" className="signup-link">
              Already have an account? Log in.
            </a>
          </p>
          <button type="submit" className="login-button">
            Register
          </button>
        </form>
        {message && <p className="error-message">{message}</p>}
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{message}</p>
            <button className="close-popup-button" onClick={closePopup}>
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
