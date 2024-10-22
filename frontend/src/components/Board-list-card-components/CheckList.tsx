import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface ChecklistItem {
  id: number;
  description: string;
}

interface Checklist {
  id: number;
  name: string;
  items: ChecklistItem[];
}

const Checklists: React.FC<{ cardId: string }> = ({ cardId }) => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [newChecklistName, setNewChecklistName] = useState<string>("");
  const [newItemDescription, setNewItemDescription] = useState<string>("");

  // Fetch checklists for the card
  useEffect(() => {
    const fetchChecklists = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/cards/${cardId}/checklists`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChecklists(response.data.checklists);
    };
    fetchChecklists();
  }, [cardId]);

  // Add a new checklist
  const addChecklist = async () => {
    if (!newChecklistName.trim()) return;
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/cards/${cardId}/checklists`,
      { name: newChecklistName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setChecklists((prev) => [
      ...prev,
      { id: response.data.checklistId, name: newChecklistName, items: [] },
    ]);
    setNewChecklistName("");
  };

  // Add a new item to a checklist
  const addItem = async (checklistId: number) => {
    if (!newItemDescription.trim()) return;
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/checklists/${checklistId}/items`,
      { description: newItemDescription },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setChecklists((prev) =>
      prev.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: [
                ...checklist.items,
                { id: response.data.itemId, description: newItemDescription },
              ],
            }
          : checklist
      )
    );
    setNewItemDescription("");
  };

  // Handle drag-and-drop for checklists and items
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Reorder items within the same checklist
      const checklistId = Number(source.droppableId);
      const updatedChecklists = checklists.map((checklist) => {
        if (checklist.id === checklistId) {
          const reorderedItems = Array.from(checklist.items);
          const [removed] = reorderedItems.splice(source.index, 1);
          reorderedItems.splice(destination.index, 0, removed);
          return { ...checklist, items: reorderedItems };
        }
        return checklist;
      });
      setChecklists(updatedChecklists);
    } else {
      // Move item between checklists
      const sourceChecklistId = Number(source.droppableId);
      const destinationChecklistId = Number(destination.droppableId);
      const itemToMove = checklists
        .find((checklist) => checklist.id === sourceChecklistId)
        ?.items[source.index];

      if (itemToMove) {
        const updatedChecklists = checklists.map((checklist) => {
          if (checklist.id === sourceChecklistId) {
            const updatedItems = checklist.items.filter(
              (_, index) => index !== source.index
            );
            return { ...checklist, items: updatedItems };
          }
          if (checklist.id === destinationChecklistId) {
            return {
              ...checklist,
              items: [...checklist.items, itemToMove],
            };
          }
          return checklist;
        });
        setChecklists(updatedChecklists);
      }
    }
  };

  return (
    <div className="checklist-container">
      <h2>Checklists</h2>
      <input
        type="text"
        value={newChecklistName}
        onChange={(e) => setNewChecklistName(e.target.value)}
        placeholder="New Checklist"
      />
      <button onClick={addChecklist}>Add Checklist</button>

      <DragDropContext onDragEnd={onDragEnd}>
        {checklists.map((checklist) => (
          <div key={checklist.id} className="checklist-card">
            <h3>{checklist.name}</h3>
            <Droppable droppableId={String(checklist.id)}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {checklist.items.map((item, index) => (
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
            <input
              type="text"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              placeholder="New Item"
              onKeyDown={(e) => {
                if (e.key === "Enter") addItem(checklist.id);
              }}
            />
            <button onClick={() => addItem(checklist.id)}>Add Item</button>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default Checklists;
