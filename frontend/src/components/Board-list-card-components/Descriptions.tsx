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
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDescriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/cards/${cardId}/descriptions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);

        setDescriptions(response.data.descriptions);
      } catch (err) {
        console.error("Error fetching descriptions:", err);
        setError("An error occurred while fetching description.");
      }
    };
    fetchDescriptions();
  }, [cardId]);

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

      const newDescription = {
        id: response.data.descriptionId,
        description: content,
      };

      setDescriptions((prev) => [...prev, newDescription]);
      setContent("");
    } catch (err) {
      console.error("Error adding description:", err);
      setError("An error occurred while adding a description.");
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Descriptions</h2>
      {descriptions.map((description) => (
        <div key={description.id}>{description.description}</div>
      ))}
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Description content"
      />
      <button onClick={addDescription}>Add Description</button>
    </div>
  );
};

export default Descriptions;
