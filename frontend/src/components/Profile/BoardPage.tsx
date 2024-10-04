import React, { useEffect, useState } from "react";
import { ProfileHeader } from "./ProfileHeader";
import axios from "axios";
import { useParams } from "react-router-dom";

export const BoardPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { boardId } = useParams<{ boardId: string }>();
  const [title, setTitle] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [board, setBoard] = useState<any>(null);
  useEffect(() => {
    const handleGettingBoardInformation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found.");
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/board/${boardId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.board) {
          setBoard(response.data.board);
        } else {
          setError("Board not found");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred");
      }
    };
    handleGettingBoardInformation();
  }, [boardId]);
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!board) {
    return <div>Loading...</div>;
  }
const handleCreatingList = async()=>{
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/boards/${boardId}/lists`,
          { title },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const listId = response.data.listId;
      } catch (err) {
        console.error("err");
        setError("An unexpected error occurred");
      }
}
  return (
    <>
      <ProfileHeader />
      <div className="after-header">
        <h1>{board.name}</h1>
        <p>{board.description}</p>
      </div>
      <div className="create-list">
        <button onClick={() => setShowDropdown((prev) => !prev)}>Create List</button>
      </div>
      {showDropdown && (
        <div className="dropdown">
          <h3>Create New Board</h3>
          <input
            type="text"
            placeholder="Board Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
         
          <button onClick={handleCreatingList}>Create</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </>
  );
};
