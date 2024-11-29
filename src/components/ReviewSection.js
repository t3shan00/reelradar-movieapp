import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addReview } from "../api";
import "./styles/ReviewSection.css";

const ReviewSection = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/reviews/${id}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        // console.log("Fetched reviews:", data);
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err.message);
      }
    };

    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return;

    try {
      // console.log("Submitting review:", { movieId: id, reviewText: newReview });
      const response = await addReview(id, newReview);

      // Enrich the review with local user data
      const addedReview = {
        review_text: newReview,
        username: user.username,
        created_at: new Date().toISOString(),
        ...response.data,
      };

      // console.log("Review added:", addedReview);

      // Add the enriched review to the state
      setReviews((prev) => [addedReview, ...prev]);

      // Clear the new review input
      setNewReview("");
    } catch (err) {
      console.error("Error submitting review:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to add review.");
    }
  };

  return (
    <div className="reviews-section">
      <h2>Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="review">
            <p>{review.review_text}</p>
            <small>
              — by {review.username || "Unknown User"},{" "}
              on {review.created_at
                ? new Date(review.created_at).toLocaleString()
                : "Unknown Date"}
            </small>
          </div>
        ))
      ) : (
        <p>No reviews yet. Be the first to review!</p>
      )}

      {user ? (
        <div className="add-review">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
          />
          <button onClick={handleReviewSubmit}>Submit</button>
        </div>
      ) : (
        <p className="login-prompt">
          Please <a href="/login">log in</a> to add a review.
        </p>
      )}
    </div>
  );
};

export default ReviewSection;
