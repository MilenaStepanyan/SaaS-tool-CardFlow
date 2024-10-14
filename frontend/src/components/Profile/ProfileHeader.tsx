import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export const ProfileHeader: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [boards, setBoards] = useState<any[]>([]);
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsername();
    fetchBoards();
  }, []);

  const fetchUsername = () => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  };

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

      if (response.data.boardId) {
        navigate(`/board/${response.data.boardId}`);
      } else {
        setError("Failed to create board. No board ID returned.");
      }
      fetchBoards();
    } catch (err) {
      console.error("Error creating board", err);
      setError("An unexpected error occurred");
    }
  };

  const fetchBoards = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/board/getBoard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBoards(response.data);
    } catch (error) {
      console.error("Error fetching boards:", error);
      setError("Failed to fetch boards. Please try again later.");
    }
  };

  return (
    <>
      <header className="profileHeader">
        <div className="profile-picture">
          {username && (
            <div className="avatar">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h1 className="profile-title">{username}'s Profile</h1>
        <button
          className="create-button"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <span className="icon">+</span>
          <span className="label">Create Board</span>
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
            className="input-field"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
          <button onClick={handleCreatingBoard} className="create-board-btn">Create</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
<div className="whole-boards">
   <h2 className="lists-header">Your Boards</h2>
      <ul className="board-list">
        {boards.length > 0 ? (
          boards.map((board) => (
            <li key={board.id} className="board-item">
              <h3>{board.name}</h3>
              <p>{board.description}</p>
              <button onClick={() => navigate(`/board/${board.id}`)}>View Board</button>
            </li>
          ))
        ) : (
          <li className="no-boards">No Boards available.</li>
        )}
      </ul>
</div>
     
    </>
  );
};
