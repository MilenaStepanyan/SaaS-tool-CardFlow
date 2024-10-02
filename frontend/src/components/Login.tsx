import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `
            ${import.meta.env.VITE_API_URL}/user/login`,
        { username, password }
      );
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    }
  };
  return (
    <>
     </>
  );
};
