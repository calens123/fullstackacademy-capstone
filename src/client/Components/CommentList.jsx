import React, { useState } from "react";

const CommentList = ({ reviewId, comments, setComments, itemId }) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/items/${itemId}/reviews/${reviewId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: 1, // Replace this with the logged-in user's ID when authentication is implemented
            comment_text: newComment,
          }),
        }
      );
      const createdComment = await response.json();
      setComments((prev) => ({
        ...prev,
        [reviewId]: [...comments, createdComment],
      }));
      setNewComment(""); // Clear the input field
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
