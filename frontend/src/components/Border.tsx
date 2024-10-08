import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CardComponent from "./CardComponent";


const BoardPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [lists, setLists] = useState<any[]>([]);
  const [listTitle, setListTitle] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchLists = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:4000/api/boards/${boardId}/lists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.lists) {
        setLists(response.data.lists);
      } else {
        console.warn("Lists not found in response:", response.data);
        setLists([]);
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
      setErrorMessage("Failed to fetch lists. Please try again later.");
    }
  };

  const createList = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
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
    } catch (error) {
      console.error("Error creating list:", error);
      setErrorMessage("Failed to create list. Please try again.");
    }
  };

  useEffect(() => {
    fetchLists();
  }, [boardId]);

  return (
    <div className="container-list">
      <h1 className="board-title">Board {boardId}</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form className="list-form" onSubmit={createList}>
        <input
          type="text"
          className="list-input"
          placeholder="List Title"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          required
        />
        <button type="submit" className="add-list-button">Add List</button>
      </form>
      <h2 className="lists-header">Lists</h2>
      <ul className="lists-container">
        {lists.length > 0 ? (
          lists.map((list) => (
            <li key={list.id} className="list-item">{list.name}
             <CardComponent listId={list.id} /></li>
            
          ))
        ) : (
          <li className="no-lists">No lists available.</li>
        )}
      </ul>
    </div>
  );
};

export default BoardPage;
