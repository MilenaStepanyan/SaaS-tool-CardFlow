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
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/");
      console.log("Logged successfully", response.data);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    }
  };
  return (
    <>
      <h1>wassup</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </>
  );
};
