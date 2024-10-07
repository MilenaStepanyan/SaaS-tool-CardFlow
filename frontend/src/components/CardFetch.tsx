import axios from "axios";
import React, { useEffect, useState } from "react";

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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (cards.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card-list">
      {cards.map((card) => (
        <div className="card-item" key={card.id}>
          <h3>{card.name}</h3>
          {card.description && <p>{card.description}</p>}
        </div>
      ))}
    </div>
  );
};
