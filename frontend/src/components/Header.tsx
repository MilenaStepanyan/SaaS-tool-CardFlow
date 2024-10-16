import React from "react";
import logo from "../../public/logo.png";
import { Link } from "react-router-dom";
export const Header: React.FC = () => {
  return (
    <header>
      <div className="header">
        <img className="logo" src={logo} alt="" />
        <a href="#" className="button type--B">
          <div className="button__line"></div>
          <div className="button__line"></div>
          <span className="button__text">
            {" "}
            <Link className="road-to-login-page" to="/login">
              LogIn / SignUp
            </Link>
          </span>
          <div className="button__drow1"></div>
          <div className="button__drow2"></div>
        </a>
      </div>
    </header>
  );
};
