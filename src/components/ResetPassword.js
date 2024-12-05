import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      await resetPassword(token, password);
      setMessage("Password reset successfully.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div>
    <div className="forgot-password-container">
        <div className="forgot-password-box">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
            <div className="input-group">
                <input
                type="password"
                className="input-field"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <input
                type="password"
                className="input-field"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                />
            </div>
                <button type="submit" className="forgot-password-button">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    </div>
    </div>
  );
};

export default ResetPassword;