import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001", 
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const registerUser = (email, username, password) =>
  API.post("/user/register", { email, username, password });

export const loginUser = (identifier, password) =>
  API.post("/user/login", { identifier, password });

export const getReviews = (movieId) =>
  API.get(`/reviews/${movieId}`); 

export const addReview = (movieId, reviewText) =>
  API.post("/reviews", { movieId, reviewText }); 

export default API;