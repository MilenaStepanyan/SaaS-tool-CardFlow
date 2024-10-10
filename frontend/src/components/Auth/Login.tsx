import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import iconFirst from "../../../public/trello-left.4f52d13c.svg";
import iconSecond from "../../../public/trello-right.e6e102c7.svg";
import google from "../../../public/google.png";
import microsoft from "../../../public/microsoft.png";
import apple from "../../../public/apple.png";
import logo from "../../../public/logo.png";
import { Header } from "../Header";
import { Link } from "react-router-dom";

export const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/login`,
        { username, password }
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/profile");
      console.log("Logged successfully", response.data);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <>
      <div className="main-container">

        <img
          src={iconSecond}
          className="icons-for-signup-in right-icon"
          alt=""
        />
        <div className="login-form-container">
        <img src={logo} className="logo-w-out-writing" alt="" />
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              className="login-input text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              Login
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
            By signing up, I accept the Atlassian Cloud Terms of Service and
            acknowledge the Privacy Policy.
          </p>
          <p className="login-text">
            One account for Trello, Jira, Confluence and more. This site is
            protected by reCAPTCHA and the Google Privacy Policy and Terms of
            Service apply.
          </p>
          <Link className="link-to-each-page" to="/register">Sign Up</Link>
        </div>
        <img src={iconFirst} className="icons-for-signup-in left-icon" alt="" />
        {error && <p className="error-message">{error}</p>}
      </div>
    </>
  );
};
