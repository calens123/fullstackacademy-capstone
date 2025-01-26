import React, { useState, useEffect } from "react";

const Dashboard = ({ userId, isAuthenticated }) => {
  const [reviews, setReviews] = useState([]); // Initialize as array
  const [comments, setComments] = useState([]); // Initialize as array
  const [sortOrder, setSortOrder] = useState("desc"); // Default to newest first

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      try {
        // Fetch user reviews
        const reviewsResponse = await fetch(
          `/api/users/${userId}/reviews?sort=${sortOrder}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);

        // Fetch user comments
        const commentsResponse = await fetch(
          `/api/users/${userId}/comments?sort=${sortOrder}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, [userId, sortOrder]);

  const handleDeleteReview = async (reviewId) => {
    const token = sessionStorage.getItem("token");
    try {
      await fetch(`/api/items/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = sessionStorage.getItem("token");
    try {
      await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div>
      <h1>My Dashboard</h1>

      {/* Sorting Controls */}
      <label>
        Sort by:
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Newest to Oldest</option>
          <option value="asc">Oldest to Newest</option>
        </select>
      </label>

      <h2>My Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <h3>{review.item_name}</h3>{" "}
              {/* Assuming 'item_name' is included in the API response */}
              <p>Rating: {review.rating}</p>
              <p>{review.review_text}</p>
              <button onClick={() => handleDeleteReview(review.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>My Comments</h2>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <h3>{comment.item_name}</h3>{" "}
              {/* Assuming 'item_name' is included in the API response */}
              <p>Comment: {comment.comment_text}</p>
              <button onClick={() => handleDeleteComment(comment.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
