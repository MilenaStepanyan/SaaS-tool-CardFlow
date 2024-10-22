import React, { useEffect, useState } from "react";
import axios from "axios";
import { Draggable, Droppable, DragDropContext } from "react-beautiful-dnd";

interface ChecklistItem {
  id: number;
  description: string;
}

interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

const ChecklistItems: React.FC<{ checklistId: string }> = ({ checklistId }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState<string>("");

  // Fetch items for the checklist
  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/checklists/${checklistId}/items`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(response.data.items);
    };
    fetchItems();
  }, [checklistId]);

  // Add a new item to the checklist
  const addItem = async () => {
    if (!newItem.trim()) return;
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/checklists/${checklistId}/items`,
      { description: newItem },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setItems((prev) => [
      ...prev,
      { id: response.data.itemId, description: newItem },
    ]);
    setNewItem("");
  };

  // Handle drag-and-drop
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    setItems(reorderedItems);
  };

  return (
    <div className="checklist">
      <h3>Checklist Items</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={checklistId}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="checklist-item"
                    >
                      {item.description}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="New Item"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addItem();
          }
        }}
      />
      <button onClick={addItem}>Add Item</button>
    </div>
  );
};

export default ChecklistItems;
