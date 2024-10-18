import axios from "axios";
import React, { useEffect, useState } from "react";

interface Checklist {
  id: number;
  name: string;
}

interface ChecklistProps {
  cardId: string;
}

const Checklists: React.FC<ChecklistProps> = ({ cardId }) => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

        if (response.data && response.data.checklists) {
          setChecklists(response.data.checklists);
        } else {
          setChecklists([]);
        }
      } catch (err) {
        console.error("Error fetching checklists:", err);
        setError("An error occurred while fetching checklists.");
      } finally {
        setLoading(false);
      }
    };
    fetchChecklists();
  }, [cardId]);

  const addChecklist = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cards/${cardId}/checklists`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newChecklist = {
        id: response.data.checklistId,
        name:name
      };

      setChecklists((prev) => [...prev, newChecklist]);
      setName("");
    } catch (err) {
      console.error("Error adding checklist:", err);
      setError("An error occurred while adding a checklist.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Checklists</h2>
      {checklists.length > 0 ? (
        checklists.map((checklist) => (
          <div key={checklist.id}>{checklist.name}</div>
        ))
      ) : (
        <p>No checklists available for this card.</p>
      )}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Checklist item"
      />
      <button onClick={addChecklist}>Add Checklist</button>
    </div>
  );
};

export default Checklists;
