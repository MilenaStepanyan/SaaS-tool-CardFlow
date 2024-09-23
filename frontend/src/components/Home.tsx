import React from "react";
import logo from "../../public/logo.png";
const Home: React.FC = () => {
  return (
    <>
      <div className="main">
        <header>
          <div className="header">
            <img  className="logo" src={logo} alt="" />
            <a href="#" className="button type--B">
              <div className="button__line"></div>
              <div className="button__line"></div>
              <span className="button__text">LogIn / SignUp</span>
              <div className="button__drow1"></div>
              <div className="button__drow2"></div>
            </a>
          </div>
        </header>
      </div>
    </>
  );
};

export default Home;
