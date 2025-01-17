import React, { useState } from "react";
import CommentList from "./CommentList";

const ReviewList = ({ reviews, setReviews, itemId }) => {
  const [comments, setComments] = useState({}); // Comments for each review

  // Fetch comments for a review
  const fetchComments = async (reviewId) => {
    try {
      const response = await fetch(
        `/api/items/${itemId}/reviews/${reviewId}/comments`
      );
      const commentsData = await response.json();
      setComments((prev) => ({ ...prev, [reviewId]: commentsData }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // Handle edit review
  const handleEdit = async (reviewId, updatedReview) => {
    try {
      const response = await fetch(`/api/items/${itemId}/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedReview),
      });
      const editedReview = await response.json();
      setReviews((prev) =>
        prev.map((review) => (review.id === reviewId ? editedReview : review))
      );
    } catch (err) {
      console.error("Error editing review:", err);
    }
  };

  // Handle delete review
  const handleDelete = async (reviewId) => {
    try {
      await fetch(`/api/items/${itemId}/reviews/${reviewId}`, {
        method: "DELETE",
      });
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    <ul>
      {reviews.map((review) => (
        <li key={review.id}>
          <p>Rating: {review.rating}</p>
          <p>{review.review_text}</p>
          <button
            onClick={() =>
              handleEdit(review.id, {
                rating: 5,
                review_text: "Updated review",
              })
            }
          >
            Edit
          </button>
          <button onClick={() => handleDelete(review.id)}>Delete</button>
          <button onClick={() => fetchComments(review.id)}>
            {comments[review.id] ? "Hide Comments" : "Show Comments"}
          </button>
          {comments[review.id] && (
            <CommentList
              reviewId={review.id}
              comments={comments[review.id]}
              setComments={setComments}
              itemId={itemId}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default ReviewList;
