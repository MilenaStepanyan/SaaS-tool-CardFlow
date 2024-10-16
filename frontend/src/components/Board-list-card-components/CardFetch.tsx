import axios from "axios";
import React, { useEffect, useState } from "react";
import Checklist from "./CheckList";
import Comments from "./Comments";

interface Card {
  id: number;
  title: string;
  description?: string;
}

interface CardFetchProps {
  listId: string;
}

export const CardFetch: React.FC<CardFetchProps> = ({ listId }) => {
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [cardTitle, setCardTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);


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

    const createCard = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
          await axios.post(
            `http://localhost:4000/api/lists/${listId}/cards`,
            { title: cardTitle },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCardTitle("");
          fetchCards();
        } catch (error) {
          setError("Failed to create list. Please try again.");
        }
      };

      useEffect(() => {
        fetchCards();
      }, [listId]);
    
  const handleCardClick = (cardId: number) => {
    setSelectedCardId(cardId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
    <form className="list-form" onSubmit={createCard}>
       <input
          type="text"
          className="list-input"
          placeholder="List Title"
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
          required
        />
        <button type="submit" className="add-list-button">
          Add Card
        </button>
      </form>
      <h2 className="lists-header">Lists</h2>
      <ul className="lists-container">
        {cards.length > 0 ? (
          cards.map((card) => (
            <li key={card.id} className="list-item"  onClick={() => handleCardClick(card.id)}>
              {card.title}
            </li>
          ))
        ) : (
          <li className="no-lists">No Cards available.</li>
        )}
      </ul>
     {/* <div className="card-list">
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
*/}
      {selectedCardId && (
        <>
          <Checklist cardId={selectedCardId.toString()} />
          <Comments cardId={selectedCardId.toString()} />
        </>
      )}
   
    </>
   
  );
};
