import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Description {
  id: number;
  description: string;
}

interface DescriptionProps {
  cardId: string;
}

const Descriptions: React.FC<DescriptionProps> = ({ cardId }) => {
  const [description, setDescription] = useState<Description | null>(null);
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    fetchDescriptions();
  }, [cardId]);

  const fetchDescriptions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/cards/${cardId}/descriptions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.descriptions && response.data.descriptions.length > 0) {
        setDescription(response.data.descriptions[0]);
        setContent(response.data.descriptions[0].description);
      } else {
        setDescription(null);
        setContent("");
      }
    } catch (err) {
      console.error("Error fetching descriptions:", err);
      setError("An error occurred while fetching descriptions.");
    }
  };

  const addDescription = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cards/${cardId}/descriptions`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newDescription: Description = {
        id: response.data.descriptionId,
        description: content,
      };

      setDescription(newDescription);
      setContent("");
      setIsEditing(false);
    } catch (err) {
      console.error("Error adding description:", err);
      setError("An error occurred while adding a description.");
    }
  };

  const editDescription = async () => {
    if (!description) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/descriptions/${description.id}`,
        { description: content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDescription({ ...description, description: content });
      setContent("");
      setIsEditing(false);
    } catch (err) {
      console.error("Error editing description:", err);
      setError("An error occurred while editing the description.");
    }
  };

  const handleSubmit = () => {
    if (isEditing) {
      editDescription();
    } else {
      addDescription();
    }
  };

  const handleEditClick = () => {
    if (description) {
      setIsEditing(!isEditing);
      setContent(description.description);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="desc-form">
      <h2>Descriptions</h2>
      <div className="decription-area">
        {description ? (
          <div key={description.id}>
            {isEditing ? (
              <div className="area">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <button onClick={handleSubmit}>Save Changes</button>
              </div>
            ) : (
              <span>{description.description}</span>
            )}
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="icon"
              onClick={handleEditClick}
            />
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Description content"
            />
            <button onClick={handleSubmit}>Add Description</button>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Descriptions;
