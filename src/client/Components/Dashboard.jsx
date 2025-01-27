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
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-primary text-4xl font-bold mb-6">My Dashboard</h1>

      {/* Sorting Controls */}
      <div className="mb-6">
        <label className="block text-gray-700 text-lg mb-2">Sort by:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="desc">Newest to Oldest</option>
          <option value="asc">Oldest to Newest</option>
        </select>
      </div>

      {/* Reviews Section */}
      <h2 className="text-2xl font-semibold text-primary mb-4">My Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-lg font-semibold">{review.item_name}</h3>
              <p className="text-gray-700">Rating: {review.rating}</p>
              <p className="text-gray-600">{review.review_text}</p>
              <button
                onClick={() => handleDeleteReview(review.id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Comments Section */}
      <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">
        My Comments
      </h2>
      {comments.length === 0 ? (
        <p className="text-gray-600">No comments yet.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-lg font-semibold">{comment.item_name}</h3>
              <p className="text-gray-600">{comment.comment_text}</p>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
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
