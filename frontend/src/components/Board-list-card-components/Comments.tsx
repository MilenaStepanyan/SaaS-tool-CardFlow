import axios from "axios";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

interface Comment {
  id: number;
  content: string;
}

interface CommentsProps {
  cardId: string;
}

const Comments: React.FC<CommentsProps> = ({ cardId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState<string>("");
  const [editMode, setEditMode] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/cards/${cardId}/comments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setComments(response.data.comments);
      } catch (err) {
        setError("An error occurred while fetching comments.");
      }
    };
    fetchComments();
  }, [cardId]);

  const addComment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cards/${cardId}/comments`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) => [
        ...prev,
        { id: response.data.commentId, content },
      ]);
      setContent("");
    } catch (err) {
      setError("An error occurred while adding a comment.");
    }
  };

  const editComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, content } : comment
        )
      );
      setContent("");
      setEditMode(null);
    } catch (err) {
      setError("An error occurred while editing the comment.");
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err) {
      setError("An error occurred while deleting the comment.");
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Comments</h2>
      {comments.map((comment) => (
        <div key={comment.id} className="comment-card">
          {editMode === comment.id ? (
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Edit comment"
            />
          ) : (
            <span>{comment.content}</span>
          )}
          <div>
            <FontAwesomeIcon
              icon={faEdit}
              onClick={() => {
                setEditMode(comment.id);
                setContent(comment.content);
              }}
              style={{ cursor: "pointer", marginRight: "8px" }}
            />
            <FontAwesomeIcon
              icon={faTrash}
              onClick={() => deleteComment(comment.id)}
              style={{ cursor: "pointer" }}
            />
          </div>
          {editMode === comment.id && (
            <button onClick={() => editComment(comment.id)}>Save</button>
          )}
        </div>
      ))}
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment"
      />
      <button onClick={addComment}>Add Comment</button>
    </div>
  );
};

export default Comments;
