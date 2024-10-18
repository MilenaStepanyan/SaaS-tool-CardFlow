import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { CardFetch } from "./CardFetch";
import { faListOl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BoardPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [lists, setLists] = useState<any[]>([]);
  const [boards, setBoards] = useState<any[]>([]);
  const [listTitle, setListTitle] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [showAllBoards, setShowAllBoards] = useState<boolean>(false);
  const [showListModal, setShowListModal] = useState<boolean>(false); 

  const fetchUsername = () => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  };

  const fetchLists = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:4000/api/boards/${boardId}/lists`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLists(response.data.lists || []);
    } catch (error) {
      setErrorMessage("Failed to fetch lists. Please try again later.");
    }
  };

  const createList = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:4000/api/boards/${boardId}/lists`,
        { title: listTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setListTitle("");
      setSuccessMessage("List created successfully!");
      fetchLists();
      setShowListModal(false);
    } catch (error) {
      setErrorMessage("Failed to create list. Please try again.");
    }
  };

  useEffect(() => {
    fetchBoards();
    fetchUsername();
    if (boardId) {
      fetchLists();
    }
  }, [boardId]);

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
      setErrorMessage("Failed to fetch boards. Please try again later.");
    }
  };

  const displayedBoards = showAllBoards ? boards : boards.slice(0, 10);

  return (
    <>
      <div className="main-lists">
        <div className="left-bar">
          <div className="profile-picture-list">
            {username && (
              <div className="profile-details-list">
                <div className="avatar">{username.charAt(0).toUpperCase()}</div>
                <h2>{username}</h2>
              </div>
            )}
          </div>
          <div className="options">
            <div className="boards-option">
              <FontAwesomeIcon icon={faListOl} />
              <Link className="to-boards" to={"/profile"}>
                Boards
              </Link>
            </div>
            <div className="boards-listed">
              <p>Your Boards</p>
              <ul>
                {displayedBoards.map((board) => (
                  <li className="boards-li" key={board.id}>
                    <Link className="to-boards" to={`/board/${board.id}`}>
                      {board.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {boards.length > 10 && (
                <button
                  className="view-more-button"
                  onClick={() => setShowAllBoards(!showAllBoards)}
                >
                  {showAllBoards ? "Show Less" : "View More"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="container-list">
          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <h2 className="lists-header">Lists</h2>
          <ul className="lists-container">
            {lists.length > 0 ? (
              lists.map((list) => (
                <li key={list.id} className="list-item">
                  <h1>{list.name}</h1>
                  <CardFetch listId={list.id} />
                </li>
              ))
            ) : (
              <li className="no-lists">No lists available.</li>
            )}

            <li
              className="dotted-create-list"
              onClick={() => setShowListModal(true)}
            >
              <span className="icon">+</span>
            </li>
          </ul>
        </div>
      </div>


      {showListModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New List</h3>
            <input
              type="text"
              placeholder="List Title"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              className="input-field"
            />
            <div className="bttns">
              <button onClick={createList} className="create-list-btn">
                Create
              </button>
              <button
                onClick={() => setShowListModal(false)}
                className="close-modal-btn"
              >
                Close
              </button>
            </div>

            {errorMessage && <p className="error">{errorMessage}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default BoardPage;
