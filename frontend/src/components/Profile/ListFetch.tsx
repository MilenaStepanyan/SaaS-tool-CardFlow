import axios from "axios";
import React, { useEffect, useState } from "react";

interface List {
  id: number;
  name: string;
}
interface ListFetchProps {
    boardId: string; 
  }
export const ListFetch:React.FC<ListFetchProps>  = ({boardId}) => {
  const [error, setError] = useState<string | null>(null);
  const [lists, setLists] = useState<List[]>([]);

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
        console.log(response.data);
        
        if (response.data.lists) {
          setLists(response.data.lists);
        } else {
          setError("List not found");
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

  if (!lists) {
    return <div>Loading...</div>;
  }
  return (
    <div>
    {lists.map((list) => (
      <div key={list.id}>
        <h1>{list.name}</h1>
      </div>
    ))}
  </div>
  );
};
