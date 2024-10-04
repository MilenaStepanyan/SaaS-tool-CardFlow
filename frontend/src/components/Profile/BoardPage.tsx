import React, { useEffect, useState } from "react";
import { ProfileHeader } from "./ProfileHeader";
import axios from "axios";
import { useParams } from "react-router-dom";
interface Board {
  name: string;
  description: string;
}
export const BoardPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { boardId } = useParams<{ boardId: string }>();
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

  return (
    <>
      <ProfileHeader />
      <div className="after-header">
        <h1>{board.name}</h1>
        <p>{board.description}</p>
      </div>
    </>
  );
};
