import React, { useState, useEffect } from "react";

const CommentList = ({ reviewId, itemId, isAuthenticated, currentUserId }) => {
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

  const handleDeleteComment = async (commentId, reviewId, itemId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `/api/items/${itemId}/reviews/${reviewId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        if (response.status === 204) {
          // No content to parse, so just update local state
          setComments((prev) => prev.filter((c) => c.id !== commentId));
        } else {
          // If your backend sends JSON on success, parse it here:
          const data = await response.json();
          // Possibly do something with data
          setComments((prev) => prev.filter((c) => c.id !== commentId));
        }
      } else {
        console.error("Error deleting comment:", await response.text());
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="mt-4">
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="p-3 border rounded-md bg-gray-800 text-white shadow-md"
          >
            <p className="text-sm text-gray-400">User ID: {comment.user_id}</p>

            {editCommentId === comment.id ? (
              <div className="mt-2">
                <textarea
                  value={editCommentText}
                  onChange={(e) => setEditCommentText(e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-700 text-white"
                />
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEditComment(comment.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditCommentId(null)}
                    className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-300">{comment.comment_text}</p>

                {/* Only show edit/delete buttons if the logged-in user is the author */}
                {isAuthenticated && comment.user_id === currentUserId && (
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => {
                        setEditCommentId(comment.id);
                        setEditCommentText(comment.comment_text);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {isAuthenticated && (
        <form onSubmit={handleAddComment} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
            className="w-full p-2 border rounded-md bg-gray-700 text-white"
          />
          <button
            type="submit"
            className="mt-2 bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark transition"
          >
            Submit Comment
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentList;
