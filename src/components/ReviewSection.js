import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addReview, getReviews } from "../api";
import "./styles/ReviewSection.css";

const ReviewSection = () => {
  const { id } = useParams(); 
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0); 
  const [hoveredRating, setHoveredRating] = useState(0); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }

    const fetchReviews = async () => {
      try {
        const response = await getReviews(id);
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err.message);
      }
    };

    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!newReview.trim() || newRating === 0) {
      alert("Either Review or Star rating is missing.");
      return;
    }
  
    try {
      const response = await addReview(id, newReview, newRating); 
  
      const addedReview = {
        review_text: newReview,
        rating: newRating,
        username: user.username,
        created_at: new Date().toISOString(),
        ...response.data,
      };
  
      setReviews((prev) => [addedReview, ...prev]);
      setNewReview("");
      setNewRating(0); 
    } catch (err) {
      console.error("Error submitting review:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to add review.");
    }
  };
  

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / reviews.length).toFixed(1); 
  };

  return (
    <div className="reviews-section">
      <h2>Reviews</h2>
      <p className="average-rating">
        Average Rating: {calculateAverageRating()} ⭐
      </p>

      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="review">
            <p>{review.review_text}</p>
            <p className="rating">Rating: {review.rating} ⭐</p>
            <small>
           — by{" "}
              <a
                href={`/profile/${review.username}`}
                target="_blank"
                rel="noopener noreferrer" // Security for external links
                >
                {review.username || "Unknown User"}
              </a>
        , on{" "}
        {review.created_at
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
          <div className="rating-input">
            <span>Rate this movie:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${
                  hoveredRating >= star || newRating >= star ? "filled" : "empty"
                }`}
                onMouseEnter={() => setHoveredRating(star)} 
                onMouseLeave={() => setHoveredRating(0)} 
                onClick={() => setNewRating(star)} 
              >
                ★
              </span>
            ))}
          </div>
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