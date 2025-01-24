import React, { useState } from "react";
import CommentList from "./CommentList";

const ReviewList = ({ reviews, setReviews, itemId, isAuthenticated }) => {
  const [commentsVisibility, setCommentsVisibility] = useState({}); // Track visibility of comments per review
  const [editReviewId, setEditReviewId] = useState(null); // Track the review being edited
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState("");

  const toggleComments = (reviewId) => {
    setCommentsVisibility((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleEditReview = async (reviewId) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to edit a review.");
      return;
    }

    try {
      const response = await fetch(`/api/items/${itemId}/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          review_text: editReviewText,
          rating: editReviewRating,
        }),
      });

      if (!response.ok) {
        alert("Failed to edit review");
        return;
      }

      const updatedReview = await response.json();
      setReviews((prev) =>
        prev.map((review) => (review.id === reviewId ? updatedReview : review))
      );
      setEditReviewId(null); // Exit edit mode
    } catch (err) {
      console.error("Error editing review:", err);
    }
  };

  return (
    <ul>
      {reviews.map((review) => (
        <li key={review.id}>
          {editReviewId === review.id ? (
            <div>
              <textarea
                value={editReviewText}
                onChange={(e) => setEditReviewText(e.target.value)}
                placeholder="Edit review text"
              />
              <input
                type="number"
                value={editReviewRating}
                onChange={(e) => setEditReviewRating(e.target.value)}
                min="1"
                max="5"
                placeholder="Rating (1-5)"
              />
              <button onClick={() => handleEditReview(review.id)}>Save</button>
              <button onClick={() => setEditReviewId(null)}>Cancel</button>
            </div>
          ) : (
            <>
              <p>Rating: {review.rating}</p>
              <p>{review.review_text}</p>
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      setEditReviewId(review.id);
                      setEditReviewText(review.review_text);
                      setEditReviewRating(review.rating);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => alert("Delete functionality here")}>
                    Delete
                  </button>
                </>
              )}
              <button onClick={() => toggleComments(review.id)}>
                {commentsVisibility[review.id]
                  ? "Hide Comments"
                  : "Show Comments"}
              </button>
              {commentsVisibility[review.id] && (
                <CommentList
                  reviewId={review.id}
                  itemId={itemId}
                  isAuthenticated={isAuthenticated}
                />
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ReviewList;
