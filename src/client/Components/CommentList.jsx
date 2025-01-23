import React, { useState } from "react";

const CommentList = ({ reviewId, comments, setComments, itemId }) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to submit a comment.");
      return;
    }

    try {
      const response = await fetch(
        `/api/items/${itemId}/reviews/${reviewId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment_text: newComment }),
        }
      );

      if (!response.ok) {
        console.error("Error adding comment:", await response.json());
        return;
      }

      const createdComment = await response.json();
      setComments((prev) => ({
        ...prev,
        [reviewId]: [...(prev[reviewId] || []), createdComment],
      }));
      setNewComment(""); // Clear the input field after successful submission
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div>
      <h4>Comments</h4>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.comment_text}</li>
        ))}
      </ul>
      <form onSubmit={handleAddComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CommentList;
