import React, { useState, useEffect } from "react";
import axios from "axios";
import ChecklistItemsComponent from "./ChecklistItems";
interface Checklist {
  id: number;
  name: string;
  card_id: number;
  created_at: string;
}

interface ChecklistComponentProps {
  cardId: string;
}

const ChecklistComponent: React.FC<ChecklistComponentProps> = ({ cardId }) => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [newChecklistName, setNewChecklistName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchChecklists = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/cards/${cardId}/checklists`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChecklists(response.data.checklists || []);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch checklists.");
    } finally {
      setLoading(false);
    }
  };

  const createChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized: No token found.");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/cards/${cardId}/checklists`,
        { name: newChecklistName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewChecklistName("");
      fetchChecklists();
    } catch (error) {
      console.error(error);
      setError("Failed to create checklist.");
    }
  };

  const deleteChecklist = async (checklistId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized: No token found.");
      return;
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/checklists/${checklistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchChecklists();
    } catch (error) {
      console.error(error);
      setError("Failed to delete checklist.");
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, [cardId]);

  if (loading) return <div>Loading checklists...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="checklist-component">
      <h3>Checklists</h3>
      <ul className="checklist-list">
  {checklists.map((checklist) => (
    <li key={checklist.id} className="checklist-item">
      {checklist.name}
      <button
        onClick={() => deleteChecklist(checklist.id)}
        className="delete-checklist-button"
      >
        &times;
      </button>
      <ChecklistItemsComponent checklistId={checklist.id} />
    </li>
  ))}
</ul>
      <form onSubmit={createChecklist} className="checklist-form">
        <input
          type="text"
          placeholder="New checklist name"
          value={newChecklistName}
          onChange={(e) => setNewChecklistName(e.target.value)}
          required
        />
        <button type="submit">Add Checklist</button>
      </form>
    </div>
  );
};

export default ChecklistComponent;
