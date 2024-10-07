import React, { useEffect, useState } from "react";
import { ProfileHeader } from "./ProfileHeader";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ListFetch } from "./ListFetch";

export const BoardPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { boardId } = useParams<{ boardId: string | undefined }>();
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

  const handleCreatingList = async () => {
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

      const newList = response.data.list;
      setBoard((prevBoard: any) => ({
        ...prevBoard,
        lists: Array.isArray(prevBoard.lists) ? [...prevBoard.lists, newList] : [newList],
      }));

      setTitle("");
      setShowDropdown(false);
    } catch (err) {
      console.error("Error creating list:", err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <>
      <ProfileHeader />
      <div className="after-header">
        <h1>{board.name}</h1>
        <p>{board.description}</p>
      </div>
      <div className="create-list">
        <button onClick={() => setShowDropdown((prev) => !prev)}>
          Create List
        </button>
      </div>
      {showDropdown && (
        <div className="dropdown">
          <h3>Create New List</h3>
          <input
            type="text"
            placeholder="List Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={handleCreatingList}>Create</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
      {boardId && <ListFetch boardId={boardId} />}
    </>
  );
};
