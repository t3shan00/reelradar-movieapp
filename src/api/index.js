import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001", // Backend URL
});

// Auth APIs
export const registerUser = (email, username, password) =>
  API.post("/user/register", { email, username, password });

export const loginUser = (identifier, password) =>
  API.post("/user/login", { identifier, password });

export default API;