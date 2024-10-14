import axios from "axios";
import React, { useEffect, useState } from "react";
import Checklist from "./CheckList";
import Comments from "../Comments";

interface Card {
  id: number;
  name: string;
  description?: string;
}

interface CardFetchProps {
  listId: string;
}

export const CardFetch: React.FC<CardFetchProps> = ({ listId }) => {
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found.");
          setLoading(false);
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
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [listId]);

  const handleCardClick = (cardId: number) => {
    setSelectedCardId(cardId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="card-list">
      {cards.map((card) => (
        <div
          className="card-item"
          key={card.id}
          onClick={() => handleCardClick(card.id)}
        >
          <h3>{card.name}</h3>
          {card.description && <p>{card.description}</p>}
        </div>
      ))}

      {selectedCardId && (
        <>
          <Checklist cardId={selectedCardId.toString()} />
          <Comments cardId={selectedCardId.toString()} />
        </>
      )}
    </div>
  );
};
