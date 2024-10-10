import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ProfileHeader: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [boards, setBoards] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/board/getBoard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBoards(response.data); // Assuming response.data is the array of boards
    } catch (error) {
      console.error("Error fetching boards:", error);
      setError("Failed to fetch boards. Please try again later.");
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
      <h2>Boards</h2>
      <ul>
        {boards.length > 0 ? (
          boards.map((board) => (
            <li key={board.id} className="list-item">
              <h3>{board.name}</h3>
              <p>{board.description}</p>
            </li>
          ))
        ) : (
          <li className="no-lists">No Boards available.</li>
        )}
      </ul>
    </>
  );
};
