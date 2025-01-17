import React, { useState } from "react";

const ReviewForm = ({ itemId, setReviews }) => {
  const [newReview, setNewReview] = useState({ rating: "", review_text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/items/${itemId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1, // Replace with the logged-in user's ID when authentication is implemented
          ...newReview,
        }),
      });
      const createdReview = await response.json();
      setReviews((prev) => [...prev, createdReview]); // Add the new review to the existing reviews
      setNewReview({ rating: "", review_text: "" }); // Reset the form
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rating (1-5):
        <input
          type="number"
          value={newReview.rating}
          onChange={(e) =>
            setNewReview({ ...newReview, rating: e.target.value })
          }
          min="1"
          max="5"
          required
        />
      </label>
      <br />
      <label>
        Review:
        <textarea
          value={newReview.review_text}
          onChange={(e) =>
            setNewReview({ ...newReview, review_text: e.target.value })
          }
          required
        />
      </label>
      <br />
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
