import axios from "axios";
import React, { useEffect, useState } from "react";

interface List {
  id: number;
  name: string;
  cards?: any[];
}

interface ListFetchProps {
  boardId: string; 
}

export const ListFetch: React.FC<ListFetchProps> = ({ boardId }) => {
  const [error, setError] = useState<string | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleGettingListInformation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found.");
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/boards/${boardId}/lists`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.data.lists) {
          setLists(response.data.lists);
        } else {
          setError("No lists found");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred");
      }
    };

    handleGettingListInformation();
  }, [boardId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (lists.length === 0) {
    return <div>Loading...</div>;
  }

  const handleCreatingCard = async (listId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/lists/${listId}/cards`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const newCard = response.data.card; 
      setLists((prevLists) => {
        return prevLists.map((list) => {
          if (list.id === listId) {
            return {
              ...list,
              cards: [...(list.cards || []), newCard], 
            };
          }
          return list;
        });
      });

      setTitle("");
      setDescription("");
      setShowDropdown(false);
    } catch (err) {
      console.error("Error creating card:", err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div>
      {lists.map((list) => (
        <div key={list.id}>
          <h1>{list.name}</h1>
          <div>
            <button onClick={() => setShowDropdown((prev) => !prev)}>
              Create Card
            </button>
            {showDropdown && (
              <div className="dropdown">
                <h3>Create New Card</h3>
                <input
                  type="text"
                  placeholder="Card Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Card Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={() => handleCreatingCard(list.id)}>Create</button>
                {error && <p className="error">{error}</p>}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
