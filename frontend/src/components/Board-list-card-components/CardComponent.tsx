import React, { useState, useEffect } from "react";
import axios from "axios";

interface Card {
  id: number;
  name: string;
  description?: string;
}

interface CardFetchProps {
  listId: string;
}

const CardComponent: React.FC<CardFetchProps> = ({ listId }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [checklist, setChecklist] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [commentList, setCommentList] = useState<string[]>([]);


  const fetchCards = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:4000/api/lists/${listId}/cards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCards(response.data.cards || []);
    } catch (error) {
      console.error("Error fetching cards", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [listId]);

  const handleCardClick = (cardId: number) => {
    setSelectedCardId(selectedCardId === cardId ? null : cardId);
  };

  const addChecklistItem = () => {
    if (checklist) {
      setChecklistItems([...checklistItems, checklist]);
      setChecklist("");
    }
  };

  const addComment = () => {
    if (comments) {
      setCommentList([...commentList, comments]);
      setComments("");
    }
  };

  return (
    <div className="card-list">
      {cards.length > 0 ? (
        cards.map((card) => (
          <div key={card.id} className="card-item" onClick={() => handleCardClick(card.id)}>
            <h3>{card.name}</h3>
            {card.description && <p>{card.description}</p>}

            {selectedCardId === card.id && (
              <div className="card-details">
                <div className="checklist-section">
                  <h4>Checklist</h4>
                  <input
                    type="text"
                    value={checklist}
                    onChange={(e) => setChecklist(e.target.value)}
                    placeholder="Add a checklist item"
                  />
                  <button onClick={addChecklistItem}>Add</button>
                  <ul>
                    {checklistItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="comments-section">
                  <h4>Comments</h4>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add a comment"
                  />
                  <button onClick={addComment}>Add Comment</button>
                  <ul>
                    {commentList.map((comment, index) => (
                      <li key={index}>{comment}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div>No cards available.</div>
      )}
    </div>
  );
};

export default CardComponent;
