import axios from "axios";
import React, { useEffect, useState } from "react";
import Checklist from "./CheckList";
import ChecklistItems from "./ChecklistItems";
import Comments from "../Comments";

interface Card {
  id: number;
  name: string;
  description?: string;
}

interface Checklists{
  id: number;
  name: string;
}

interface CardFetchProps {
  listId: string;
}

export const CardFetch: React.FC<CardFetchProps> = ({ listId }) => {
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [checklists, setChecklists] = useState<Checklists[]>([]);
  const [selectedChecklistId, setSelectedChecklistId] = useState<number | null>(null);

  useEffect(() => {
    const handleGettingCardInformation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found.");
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/lists/${listId}/cards`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.cards) {
          setCards(response.data.cards);
        } else {
          setError("No cards found");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred");
      }
    };

    handleGettingCardInformation();
  }, [listId]);

  useEffect(() => {
    const fetchChecklists = async () => {
      if (!selectedCardId) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/cards/${selectedCardId}/checklists`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.checklists) {
          setChecklists(response.data.checklists);
        } else {
          setError("No checklists found for this card.");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred while fetching checklists.");
      }
    };

    fetchChecklists();
  }, [selectedCardId]);

  const handleCardClick = (cardId: number) => {
    setSelectedCardId(cardId);
    setSelectedChecklistId(null);
  };

  const handleChecklistSelect = (checklistId: number) => {
    setSelectedChecklistId(checklistId);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (cards.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card-list">
      {cards.map((card) => (
        <div className="card-item" key={card.id} onClick={() => handleCardClick(card.id)}>
          <h3>{card.name}</h3>
          {card.description && <p>{card.description}</p>}
        </div>
      ))}

      {selectedCardId && (
        <>
          <Checklist cardId={selectedCardId.toString()} />

          <div className="checklist-selector">
            <h4>Select a Checklist:</h4>
            {checklists.map((checklist) => (
              <div 
                key={checklist.id} 
                onClick={() => handleChecklistSelect(checklist.id)}
                className={`checklist-item ${selectedChecklistId === checklist.id ? 'selected' : ''}`}
              >
                {checklist.name}
              </div>
            ))}
          </div>

          {selectedChecklistId && (
            <ChecklistItems checklistId={selectedChecklistId.toString()} />
          )}

          <Comments cardId={selectedCardId.toString()} />
        </>
      )}
    </div>
  );
};
