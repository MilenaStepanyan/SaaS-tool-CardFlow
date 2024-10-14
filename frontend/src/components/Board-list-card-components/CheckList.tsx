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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
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
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.checklists) {
          setChecklists(response.data.checklists);
        } else {
          setError("No checklists found.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "An error occurred while fetching checklists.");
      } finally {
        setLoading(false);
      }
    };

    fetchChecklists();
  }, [cardId]);

  const createChecklist = async () => {
    if (!name.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cards/${cardId}/checklists`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.checklist) {
        setChecklists((prev) => [...prev, response.data.checklist]);
        setName("");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while creating a checklist.");
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
        <p>No checklists available</p>
      )}
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
