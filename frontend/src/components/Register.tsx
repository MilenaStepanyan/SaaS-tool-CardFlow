import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  return <div>Register</div>;
};
