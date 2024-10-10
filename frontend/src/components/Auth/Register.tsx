import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import google from "../../../public/google.png";
import microsoft from "../../../public/microsoft.png";
import apple from "../../../public/apple.png";
import logo from "../../../public/logo.png";
import iconFirst from "../../../public/trello-left.4f52d13c.svg";
import iconSecond from "../../../public/trello-right.e6e102c7.svg";

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
        { username, email, password }
      );
      navigate("/login");
      console.log("User Registered", response.data);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <>
      <div className="main-container">
        <img src={iconSecond} className="icons-for-signup-in right-icon" alt="" />
        <div className="register-form-container">
          <img src={logo} className="logo-w-out-writing" alt="" />
          <form onSubmit={handleRegister} className="login-form">
            <input
              type="text"
              className="login-input text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              className="login-input text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="login-input password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-button">
              Register
            </button>
          </form>
          <div className="sign-up-with">
            <h4 className="continue-with">Or continue with:</h4>
            <div className="google">
              <img src={google} alt="" className="google-icon" />
              <p>Google</p>
            </div>
            <div className="microsoft">
              <img src={microsoft} alt="" className="ms-icon" />
              <p>Microsoft</p>
            </div>
            <div className="apple">
              <img src={apple} alt="" className="apple-icon" />
              <p>Apple</p>
            </div>
          </div>
          <p className="login-text">
            By signing up, I accept the Terms of Service and acknowledge the Privacy Policy.
          </p>
          <Link  className="link-to-each-page" to="/login">Sign In </Link>
          <div className="error-message">{error && <p className="error-message">{error}</p>}</div>
        </div>
        <img src={iconFirst} className="icons-for-signup-in left-icon" alt="" />
      </div>
    </>
  );
};
