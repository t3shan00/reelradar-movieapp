import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const lastPage = sessionStorage.getItem("lastPage") || "/dashboard";
      navigate(lastPage, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser (identifier, password);
  
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("user", JSON.stringify(response.data));
  
      setMessage(`Welcome, ${response.data.username}`);
  
      const lastPage = sessionStorage.getItem("lastPage") || "/dashboard";
      navigate(lastPage, { replace: true });
      window.location.reload();
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className={`floating-label ${identifier ? "focused" : ""}`}>
              Email or Username
            </label>
            <input
              type="text"
              className="input-field"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className={`floating-label ${password ? "focused" : ""}`}>
              Password
            </label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p>
            <a href="/signup" className="signup-link">
              Don't have an account yet? Sign up here.
            </a>
          </p>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
