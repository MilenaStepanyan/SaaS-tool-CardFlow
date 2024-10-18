import axios from "axios";
import React, { useEffect, useState } from "react";

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
        { id: response.data.commentId, content},
      ]);
      setContent("");
    } catch (err) {
      setError("An error occurred while adding a comment.");
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Comments</h2>
      {comments.map((comment) => (
        <div key={comment.id}>
       {comment.content}
        </div>
      ))}
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Comment content"
      />
      <button onClick={addComment}>Add Comment</button>
    </div>
  );
};

export default Comments;
