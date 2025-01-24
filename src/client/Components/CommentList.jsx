import React, { useState, useEffect } from "react";

const CommentList = ({ reviewId, itemId, isAuthenticated }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `/api/items/${itemId}/reviews/${reviewId}/comments`
        );
        const commentsData = await response.json();
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [reviewId, itemId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
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
        alert("Failed to add comment");
        return;
      }

      const createdComment = await response.json();
      setComments((prev) => [...prev, createdComment]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleEditComment = async (commentId) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to edit a comment.");
      return;
    }

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

      if (!response.ok) {
        alert("Failed to edit comment");
        return;
      }

      const updatedComment = await response.json();
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? updatedComment : comment
        )
      );
      setEditCommentId(null);
      setEditCommentText("");
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  return (
    <div>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {editCommentId === comment.id ? (
              <div>
                <textarea
                  value={editCommentText}
                  onChange={(e) => setEditCommentText(e.target.value)}
                />
                <button onClick={() => handleEditComment(comment.id)}>
                  Save
                </button>
                <button onClick={() => setEditCommentId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <p>{comment.comment_text}</p>
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      setEditCommentId(comment.id);
                      setEditCommentText(comment.comment_text);
                    }}
                  >
                    Edit
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
      {isAuthenticated && (
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default CommentList;
