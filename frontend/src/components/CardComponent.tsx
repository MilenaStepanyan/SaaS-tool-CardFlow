import React, { useEffect, useState } from "react";
import axios from "axios";

interface CardProps {
  listId: string;
}

const CardComponent: React.FC<CardProps> = ({ listId }) => {
  const [cards, setCards] = useState<any[]>([]);
  const [cardTitle, setCardTitle] = useState<string>("");
  const [cardDescription, setCardDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchCards = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:4000/api/lists/${listId}/cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.cards) {
        setCards(response.data.cards);
      } else {
        console.warn("Cards not found in response:", response.data);
        setCards([]);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      setErrorMessage("Failed to fetch cards. Please try again later.");
    }
  };

  const createCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:4000/api/lists/${listId}/cards`,
        { title: cardTitle, description: cardDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCardTitle("");
      setCardDescription("");
      setSuccessMessage("Card created successfully!");
      fetchCards();
    } catch (error) {
      console.error("Error creating card:", error);
      setErrorMessage("Failed to create card. Please try again.");
    }
  };

  useEffect(() => {
    fetchCards();
  }, [listId]);

  return (
    <div className="card-container">
      <form className="card-form" onSubmit={createCard}>
        <input
          type="text"
          className="card-input"
          placeholder="Card Title"
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
          required
        />
        <textarea
          className="card-description"
          placeholder="Description (optional)"
          value={cardDescription}
          onChange={(e) => setCardDescription(e.target.value)}
        />
        <button type="submit" className="add-card-button">Add Card</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <h3>Cards</h3>
      <ul className="cards-list">
        {cards.length > 0 ? (
          cards.map((card) => (
            <li key={card.id} className="card-item">{card.title}</li>
          ))
        ) : (
          <li>No cards available.</li>
        )}
      </ul>
    </div>
  );
};

export default CardComponent;
