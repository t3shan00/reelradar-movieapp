import React, { useState, useEffect } from "react";
import { sendResetEmail } from "../api";
import { useNavigate } from "react-router-dom";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const checkIfLoggedIn = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        navigate("/dashboard");
      }
    };

    checkIfLoggedIn();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendResetEmail(email);
      setMessage("A password reset link has been sent to your email.");
    } catch (err) {
      setMessage("Error sending reset email. Please try again.");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              className="input-field"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="forgot-password-button">
            Send Reset Link
          </button>
        </form>
        {message && <p className="forgot-password-message">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;