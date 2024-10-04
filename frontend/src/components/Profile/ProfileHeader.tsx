import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const ProfileHeader: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const handleCreatingBoard = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/board/create`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const boardId = response.data.boardId;
      navigate(`/board/${boardId}`);
    } catch (err) {
      console.error("err");
      setError("An unexpected error occurred");
    }
  };
  return (
    <>
      <header className="profileHeader">
        <h1>CardFlow</h1>
        <button
          className="create-button"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <span className="icon">+</span>
          <span className="label">Create</span>
        </button>
      </header>

      {showDropdown && (
        <div className="dropdown">
          <h3>Create New Board</h3>
          <input
            type="text"
            placeholder="Board Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleCreatingBoard}>Create</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </>
  );
};
