import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import officeWorker from "../../../public/arabic-letters-resources.webp";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
export const ProfileHeader: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [boards, setBoards] = useState<any[]>([]);
  const [username, setUsername] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAllBoards, setShowAllBoards] = useState(false);
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
            <button onClick={fetchBoards} className="search-btn">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
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

          <img className="hello-icon" src={officeWorker} alt="" />
        </div>
      </div>
      <div className="whole-boards">
        <h2 className="lists-header">Your Boards</h2>
        <ul className="board-list">
          {boards.length > 0 ? (
            <>
              {boards
                .slice(0, showAllBoards ? boards.length : 5)
                .map((board) => (
                  <li key={board.id} className="board-item">
                    <div className="board-icon">
                      <FontAwesomeIcon icon={faClipboard} />{" "}

                    </div>
                    <h3>{board.name}</h3>
                    <p>{board.description}</p>
                    <button onClick={() => navigate(`/board/${board.id}`)}>
                      View Board
                    </button>
                  </li>
                ))}

              {boards.length > 5 && (
                <button
                  onClick={() => setShowAllBoards((prev) => !prev)}
                  className="view-all-btn"
                >
                  {showAllBoards ? "Show Less" : "View All"}
                </button>
              )}
            </>
          ) : (
            <li className="no-boards">No Boards available.</li>
          )}
        </ul>
      </div>
    </>
  );
};

/* <header className="profileHeader">
        <div className="profile-picture">
          {username && (
            <div className="avatar">{username.charAt(0).toUpperCase()}</div>
          )}
        </div>
        <h1 className="profile-title">{username}'s Profile</h1>
        <div className="create-search">
          <input
            type="text"
            placeholder="Search Boards"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
          <button onClick={fetchBoards} className="search-board-btn">
            Search
          </button>
          <div className="input-container">
            <button
              className="create-button"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <span className="icon">+</span>
              <span className="label">Create Board</span>
            </button>
          </div>
        </div>
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

          <button onClick={handleCreatingBoard} className="create-board-btn">
            Create
          </button>
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
                <button onClick={() => navigate(`/board/${board.id}`)}>
                  View Board
                </button>
              </li>
            ))
          ) : (
            <li className="no-boards">No Boards available.</li>
          )}
        </ul>
      </div> */
