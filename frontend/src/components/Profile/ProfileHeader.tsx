import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faListCheck,
  faMagnifyingGlass,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import officeWorker from "../../../public/arabic-letters-resources.webp";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";

export const ProfileHeader: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [boards, setBoards] = useState<any[]>([]);
  const [username, setUsername] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAllBoards, setShowAllBoards] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
        setTitle("");
        setDescription("");
        setError(null);
        fetchBoards();
        setShowModal(false);
        navigate(`/board/${response.data.boardId}`);
      } else {
        setError("Failed to create board. No board ID returned.");
      }
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
          params: {
            search: searchTerm,
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
      <header className="pre-header">
        <div className="profile-picture">
          {username && (
            <div className="profile-details">
              <div className="avatar">{username.charAt(0).toUpperCase()}</div>
              <h2>{username}'s profile</h2>
            </div>
          )}
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Boards"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-search"
          />
          <button onClick={fetchBoards} className="search-btn">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </header>
      <div className="main-welcome">
        <div className="welcome-container">
          <div className="hello-text">
            <h1>
              Hello, <span className="username-span">{username}!</span>
            </h1>
            <h4>Let’s tackle today’s goals on CardFlow!</h4>
          </div>
          <img className="hello-icon" src={officeWorker} alt="Office Worker" />
        </div>
      </div>
      <div className="whole-boards">
        <h2 className="lists-header">Your Boards</h2>
        <ul className="board-list">
          {boards.length > 0 ? (
            <>
              {boards
                .slice(0, showAllBoards ? boards.length : 4)
                .map((board) => (
                  <li key={board.id} className="board-item">
                    <div className="card-icon">
                      <FontAwesomeIcon icon={faListCheck} />
                    </div>
                    <h3>{board.name}</h3>
                    <p>{board.description}</p>
                    <div className="buttons-for-ved">
                      <button onClick={() => navigate(`/board/${board.id}`)}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button onClick={() => navigate(`/board/${board.id}`)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                      <button onClick={() => navigate(`/board/${board.id}`)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </div>
                  </li>
                ))}
            </>
          ) : (
            <li className="no-boards">No Boards available.</li>
          )}
          <li
            className="dotted-create-board"
            onClick={() => setShowModal(true)}
          >
            <span className="icon">+</span>
          </li>
        </ul>

        {boards.length > 4 && (
          <button
            onClick={() => setShowAllBoards((prev) => !prev)}
            className="view-all-btn"
          >
            {showAllBoards ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
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
            <div className="bttns">
              <button
                onClick={handleCreatingBoard}
                className="create-board-btn"
              >
                Create
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="close-modal-btn"
              >
                Close
              </button>
            </div>

            {error && <p className="error">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
};
