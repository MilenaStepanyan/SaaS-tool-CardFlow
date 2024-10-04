import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
export const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/register`,
        {
          username,
          email,
          password,
        }
      );
      navigate("/login");
      console.log("User Registerred", response.data);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    }
  };
  return (
    <div className="register-container">
    <div className="main">
    {error && <p style={{ color: "red" }}>{error}</p>}
    <form onSubmit={handleRegister}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="btn">
        <button type="submit">Register</button>
        <Link className="signin" to={"/login"}><p>Sign in</p></Link>
      </div>
       
    </form>
    </div>
    
  </div>
  );
};
