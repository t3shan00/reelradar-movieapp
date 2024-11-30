import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./styles/AllReviewsPage.module.css";

const AllReviewsPage = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/reviews");
        console.log("Fetched reviews:", response.data); // Add this line
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching all reviews:", err.message);
      }
    };

    fetchAllReviews();
  }, []);

  return (
    <div className={styles.allReviewsPage}>
      <h2>All Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className={styles.review}>
            <p>{review.review_text}</p>
            <p className={styles.rating}>Rating: {review.rating} ⭐</p>
            <small>
              — by{" "}
              <a
                href={`/profile/${review.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {review.username || "Unknown User"}
              </a>
              , on{" "}
              {review.created_at
                ? new Date(review.created_at).toLocaleString()
                : "Unknown Date"}
            </small>
            <Link to={`/movie/${review.movie_id}`}>
              <p className={styles.movieTitle}>Movie: {review.movie_title}</p>
            </Link>
          </div>
        ))
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
};

export default AllReviewsPage;