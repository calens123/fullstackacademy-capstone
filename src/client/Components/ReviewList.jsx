import React, { useState } from "react";
import CommentList from "./CommentList";

const ReviewList = ({
  reviews,
  setReviews,
  itemId,
  isAuthenticated,
  currentUserId,
}) => {
  const [commentsVisibility, setCommentsVisibility] = useState({});
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState("");

  // Show/Hide Comments
  const toggleComments = (reviewId) => {
    setCommentsVisibility((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // Delete a review
  const handleDeleteReview = async (reviewId, itemId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(`/api/items/${itemId}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        if (response.status === 204) {
          // 204 No Content => nothing to parse
          setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        } else {
          // If your server returns a 200/201 with JSON
          await response.json();
          setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        }
      } else {
        console.error("Error deleting review:", await response.text());
      }
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  // Edit a review
  const handleEditReview = async (reviewId) => {
    if (!editReviewText || !editReviewRating) return;

    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(`/api/items/${itemId}/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: editReviewRating,
          review_text: editReviewText,
        }),
      });

      if (response.ok) {
        const updatedReview = await response.json();
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? updatedReview : r))
        );
        setEditReviewId(null);
        setEditReviewText("");
        setEditReviewRating("");
      } else {
        console.error("Error editing review:", await response.text());
      }
    } catch (err) {
      console.error("Error editing review:", err);
    }
  };

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="p-4 border rounded-md shadow-md bg-gray-800 text-white"
        >
          <p className="text-lg font-semibold">Rating: {review.rating}</p>
          <p className="text-gray-300">{review.review_text}</p>
          <p className="text-sm text-gray-500">User ID: {review.user_id}</p>

          {/* Only show edit/delete if user is the author */}
          {isAuthenticated && review.user_id === currentUserId && (
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => {
                  setEditReviewId(review.id);
                  setEditReviewText(review.review_text);
                  setEditReviewRating(review.rating);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteReview(review.id, itemId)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          )}

          {/* Edit Review Form */}
          {editReviewId === review.id && (
            <div className="mt-2 p-2 border-t border-gray-600">
              <input
                type="number"
                value={editReviewRating}
                onChange={(e) => setEditReviewRating(e.target.value)}
                min="1"
                max="5"
                className="w-full p-2 border rounded-md bg-gray-700 text-white"
              />
              <textarea
                value={editReviewText}
                onChange={(e) => setEditReviewText(e.target.value)}
                className="w-full p-2 border rounded-md bg-gray-700 text-white mt-2"
              />
              <button
                onClick={() => handleEditReview(review.id)}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition mt-2"
              >
                Save Changes
              </button>
            </div>
          )}

          {/* Show/Hide Comments Button */}
          <button
            onClick={() => toggleComments(review.id)}
            className="text-blue-400 hover:text-blue-300 transition mt-2"
          >
            {commentsVisibility[review.id] ? "Hide Comments" : "Show Comments"}
          </button>

          {/* Comments */}
          {commentsVisibility[review.id] && (
            <CommentList
              reviewId={review.id}
              itemId={itemId}
              isAuthenticated={isAuthenticated}
              currentUserId={currentUserId}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default ReviewList;
