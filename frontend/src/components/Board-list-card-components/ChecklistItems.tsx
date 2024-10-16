import axios from "axios";
import React, { useEffect, useState } from "react";

interface ChecklistItem {
  id: number;
  description: string;
}

interface ChecklistItemsProps {
  checklistId: string;
}

const ChecklistItems: React.FC<ChecklistItemsProps> = ({ checklistId }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/checklists/${checklistId}/items`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setItems(response.data.items);
      } catch (err) {
        setError("An error occurred while fetching checklist items.");
      }
    };

    fetchItems();
  }, [checklistId]);

  const createItem = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/checklists/${checklistId}/items`,
        { description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setItems((prev) => [...prev, { id: response.data.itemId, description }]);
      setDescription(""); 
    } catch (err) {
      setError("An error occurred while creating a checklist item.");
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Checklist Items</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.description}</li>
        ))}
      </ul>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Item description"
      />
      <button onClick={createItem}>Add Item</button>
    </div>
  );
};

export default ChecklistItems;
