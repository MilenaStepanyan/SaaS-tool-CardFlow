import axios from "axios";
import React, { useEffect, useState } from "react";
import Checklists from "./CheckList";
import Comments from "./Comments";
import Descriptions from "./Descriptions";

interface Card {
  id: number;
  title: string;
  description?: string;
  created_at: number;
}

interface CardFetchProps {
  listId: string;
}

export const CardFetch: React.FC<CardFetchProps> = ({ listId }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [cardTitle, setCardTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

  const fetchUsername = () => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  };

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
      console.error(err);
      setError((err as any).message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const createCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized: No token found.");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/lists/${listId}/cards`,
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
      console.error(error);
      setError("Failed to create card. Please try again.");
    }
  };

  const handleCardClick = (cardId: number) => {
    setSelectedCardId(cardId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCardId(null);
  };

  useEffect(() => {
    fetchCards();
    fetchUsername();
  }, [listId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <ul className="card-list">
        {cards.map((card) => (
          <li
            key={card.id}
            className="card-item"
            onClick={() => handleCardClick(card.id)}
          >
            {card.title}
          </li>
        ))}
      </ul>
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
      {isModalOpen && selectedCardId && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="profile-picture-list">
              {username && (
                <div className="profile-details-list">
                  <div className="avatar">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <h2>{username} added this card</h2>
                  <p className="date">
                    {new Date(
                      cards.find((card) => card.id === selectedCardId)
                        ?.created_at || 0
                    ).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <Descriptions cardId={selectedCardId.toString()} />
            <Checklists cardId={selectedCardId.toString()} /> 
            <Comments cardId={selectedCardId.toString()} />
          </div>
        </div>
      )}
    </>
  );
};
