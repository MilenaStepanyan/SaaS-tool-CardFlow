import axios from "axios";
import React, { useEffect, useState } from "react";

interface Checklist {
  id: number;
  name: string;
}

interface ChecklistProps {
  cardId: string;
}

const Checklist: React.FC<ChecklistProps> = ({ cardId }) => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/cards/${cardId}/checklists`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setChecklists(response.data.checklists);
      } catch (err) {
        setError("An error occurred while fetching checklists.");
      }
    };
    fetchChecklists();
  }, [cardId]);

  const createChecklist = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cards/${cardId}/checklists`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChecklists((prev) => [...prev, { id: response.data.checklistId, name }]);
      setName("");
    } catch (err) {
      setError("An error occurred while creating a checklist.");
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Checklists</h2>
      {checklists.map((checklist) => (
        <div key={checklist.id}>{checklist.name}</div>
      ))}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Checklist name"
      />
      <button onClick={createChecklist}>Create Checklist</button>
    </div>
  );
};

export default Checklist;
