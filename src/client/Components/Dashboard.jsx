import React, { useState, useEffect } from "react";

const Dashboard = ({ userId, isAuthenticated }) => {
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        return;
      }

      setLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const [reviewsResponse, commentsResponse] = await Promise.all([
          fetch(`/api/users/${userId}/reviews`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`/api/users/${userId}/comments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!reviewsResponse.ok || !commentsResponse.ok) {
          throw new Error("Failed to fetch data.");
        }

        const reviewsData = await reviewsResponse.json();
        const commentsData = await commentsResponse.json();
        setReviews(reviewsData);
        setComments(commentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, isAuthenticated]);

  if (loading) {
    return <p>Loading your dashboard...</p>;
  }

  if (error) {
    return <p>Error loading dashboard: {error}</p>;
  }

  return (
    <div>
      <h1>Your Dashboard</h1>

      <section>
        <h2>Your Reviews</h2>
        {reviews.length ? (
          <ul>
            {reviews.map((review) => (
              <li key={review.id}>
                <p>Item: {review.item_name}</p>
                <p>Review: {review.review_text}</p>
                <p>Rating: {review.rating}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't left any reviews yet.</p>
        )}
      </section>

      <section>
        <h2>Your Comments</h2>
        {comments.length ? (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <p>Item: {comment.item_name}</p>
                <p>Review: {comment.review_text}</p>
                <p>Comment: {comment.comment_text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't left any comments yet.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
