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
        setError("An error occurred while fetching items.");
      }
    };
    fetchItems();
  }, [checklistId]);

  const addItem = async () => {
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
      setError("An error occurred while adding an item.");
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Checklist Items</h3>
      {items.map((item) => (
        <div key={item.id}>{item.description}</div>
      ))}
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Item description"
      />
      <button onClick={addItem}>Add Item</button>
    </div>
  );
};

export default ChecklistItems;
