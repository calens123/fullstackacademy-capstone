import React, { useState } from "react";
import CommentList from "./CommentList";

const ReviewList = ({ reviews, setReviews, itemId, isAuthenticated }) => {
  const [comments, setComments] = useState({}); // Comments for each review
  const [editingReviewId, setEditingReviewId] = useState(null); // Track which review is being edited
  const [updatedReview, setUpdatedReview] = useState({
    rating: "",
    review_text: "",
  }); // Updated review data

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

  const handleEdit = async (reviewId) => {
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
        body: JSON.stringify(updatedReview),
      });

      if (!response.ok) {
        console.error("Error editing review:", await response.json());
        return;
      }

      const editedReview = await response.json();
      setReviews((prev) =>
        prev.map((review) => (review.id === reviewId ? editedReview : review))
      );
      setEditingReviewId(null); // Stop editing
    } catch (err) {
      console.error("Error editing review:", err);
    }
  };

  const handleDelete = async (reviewId) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to delete a review.");
      return;
    }

    try {
      await fetch(`/api/items/${itemId}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          {editingReviewId === review.id ? (
            <>
              <label>
                Rating:
                <input
                  type="number"
                  value={updatedReview.rating}
                  onChange={(e) =>
                    setUpdatedReview({
                      ...updatedReview,
                      rating: e.target.value,
                    })
                  }
                  min="1"
                  max="5"
                />
              </label>
              <label>
                Review Text:
                <textarea
                  value={updatedReview.review_text}
                  onChange={(e) =>
                    setUpdatedReview({
                      ...updatedReview,
                      review_text: e.target.value,
                    })
                  }
                />
              </label>
              <button onClick={() => handleEdit(review.id)}>Save</button>
              <button onClick={() => setEditingReviewId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <p>Rating: {review.rating}</p>
              <p>{review.review_text}</p>
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      setEditingReviewId(review.id);
                      setUpdatedReview({
                        rating: review.rating,
                        review_text: review.review_text,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(review.id)}>
                    Delete
                  </button>
                </>
              )}
            </>
          )}
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
