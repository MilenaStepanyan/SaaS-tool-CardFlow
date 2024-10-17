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

export const CardCreation: React.FC<CardFetchProps> = ({ listId }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [cardTitle, setCardTitle] = useState<string>("");
  const [cardDescription, setCardDescription] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


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
    } catch (error) {
      setError("Failed to create card. Please try again.");
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <form className="card-form" onSubmit={createCard}>
        <input
          type="text"
          className="card-input"
          placeholder="Card Title"
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
          required
        />
        <button type="submit" className="add-card-button">
          Add Card
        </button>
      </form>

    </>
  );
};
