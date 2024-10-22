import React, { useEffect, useState } from "react";
import axios from "axios";

interface ChecklistItem {
  id: number;
  description: string;
  is_completed: boolean;
  checklist_id: number;
}

interface ChecklistItemsComponentProps {
  checklistId: number; 
}

const ChecklistItemsComponent: React.FC<ChecklistItemsComponentProps> = ({ checklistId }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemDescription, setNewItemDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/checklists/${checklistId}/items`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems(response.data.items || []);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch items.");
    } finally {
      setLoading(false);
    }
  };


  const createItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized: No token found.");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/checklists/${checklistId}/items`,
        { description: newItemDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewItemDescription("");
      fetchItems(); 
    } catch (error) {
      console.error(error);
      setError("Failed to create item.");
    }
  };


  const toggleItemCompletion = async (itemId: number, currentStatus: boolean) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized: No token found.");
      return;
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/checklist-items/${itemId}`,
        { is_completed: !currentStatus }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchItems();
    } catch (error) {
      console.error(error);
      setError("Failed to update item.");
    }
  };


  const deleteItem = async (itemId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized: No token found.");
      return;
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/checklist-items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchItems(); 
    } catch (error) {
      console.error(error);
      setError("Failed to delete item.");
    }
  };

  useEffect(() => {
    fetchItems(); 
  }, [checklistId]);

  if (loading) return <div>Loading items...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="checklist-items-component">
      <h4>Checklist Items</h4>
      <ul className="checklist-items-list">
        {items.map((item) => (
          <li key={item.id} className="checklist-item">
            <input
              type="checkbox"
              checked={item.is_completed}
              onChange={() => toggleItemCompletion(item.id, item.is_completed)}
            />
            <span style={{ textDecoration: item.is_completed ? "line-through" : "none" }}>
              {item.description}
            </span>
            <button
              onClick={() => deleteItem(item.id)}
              className="delete-item-button"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={createItem} className="checklist-item-form">
        <input
          type="text"
          placeholder="New item description"
          value={newItemDescription}
          onChange={(e) => setNewItemDescription(e.target.value)}
          required
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default ChecklistItemsComponent;
