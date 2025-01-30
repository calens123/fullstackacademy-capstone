import React, { useState, useEffect } from "react";

const Dashboard = ({ userId, isAuthenticated }) => {
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  // State for editing reviews
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState("");

  // State for editing comments
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      try {
        // Fetch user reviews
        const reviewsResponse = await fetch(
          `/api/users/${userId}/reviews?sort=${sortOrder}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);

        // Fetch user comments
        const commentsResponse = await fetch(
          `/api/users/${userId}/comments?sort=${sortOrder}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, [userId, sortOrder]);

  // Handle Deleting a Review
  const handleDeleteReview = async (reviewId, itemId) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(`/api/items/${itemId}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setReviews(reviews.filter((review) => review.id !== reviewId));
      } else {
        console.error("Failed to delete review.");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  // Handle Deleting a Comment
  const handleDeleteComment = async (commentId, reviewId, itemId) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `/api/items/${itemId}/reviews/${reviewId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else {
        console.error("Failed to delete comment.");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // Handle Editing a Review
  const handleEditReview = async (reviewId, itemId) => {
    const token = sessionStorage.getItem("token");
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

      if (response.ok) {
        const updatedReview = await response.json();
        setReviews(reviews.map((r) => (r.id === reviewId ? updatedReview : r)));
        setEditReviewId(null);
        setEditReviewText("");
        setEditReviewRating("");
      } else {
        console.error("Failed to edit review.");
      }
    } catch (err) {
      console.error("Error editing review:", err);
    }
  };

  // Handle Editing a Comment
  const handleEditComment = async (commentId, reviewId, itemId) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `/api/items/${itemId}/reviews/${reviewId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment_text: editCommentText }),
        }
      );

      if (response.ok) {
        const updatedComment = await response.json();
        setComments(
          comments.map((c) => (c.id === commentId ? updatedComment : c))
        );
        setEditCommentId(null);
        setEditCommentText("");
      } else {
        console.error("Failed to edit comment.");
      }
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-accent mb-4">My Dashboard</h1>

      {/* Sorting Controls */}
      <label className="block mb-4">
        Sort by:
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="ml-2 p-2 border rounded-md bg-gray-700 text-white"
        >
          <option value="desc">Newest to Oldest</option>
          <option value="asc">Oldest to Newest</option>
        </select>
      </label>

      {/* Reviews Section */}
      <h2 className="text-2xl font-bold text-blue-400 mt-6">My Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="bg-gray-800 p-4 rounded-md">
              <h3 className="text-lg font-semibold">{review.item_name}</h3>
              <p>Rating: {review.rating}</p>
              <p>{review.review_text}</p>

              {/* Edit Review */}
              {editReviewId === review.id ? (
                <div className="mt-2">
                  <input
                    type="number"
                    value={editReviewRating}
                    onChange={(e) => setEditReviewRating(e.target.value)}
                    className="p-2 border rounded-md bg-gray-700 text-white"
                  />
                  <textarea
                    value={editReviewText}
                    onChange={(e) => setEditReviewText(e.target.value)}
                    className="p-2 border rounded-md w-full bg-gray-700 text-white"
                  />
                  <button
                    onClick={() => handleEditReview(review.id, review.item_id)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={() => setEditReviewId(review.id)}>
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteReview(review.id, review.item_id)
                    }
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Comments Section */}
      <h2 className="text-2xl font-bold text-blue-400 mt-6">My Comments</h2>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-gray-800 p-4 rounded-md">
              <h3 className="text-lg font-semibold">{comment.item_name}</h3>
              <p>Comment: {comment.comment_text}</p>

              {editCommentId === comment.id ? (
                <div className="mt-2">
                  <textarea
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    className="p-2 border rounded-md w-full bg-gray-700 text-white"
                  />
                  <button
                    onClick={() =>
                      handleEditComment(
                        comment.id,
                        comment.review_id,
                        comment.item_id
                      )
                    }
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={() => setEditCommentId(comment.id)}>
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteComment(
                        comment.id,
                        comment.review_id,
                        comment.item_id
                      )
                    }
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
