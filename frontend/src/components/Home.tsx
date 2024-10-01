import React from "react";
import logo from "../../public/logo.png";
import form from "../../public/trello.webp";
const Home: React.FC = () => {
  return (
    <>
      <div className="main">
        <header>
          <div className="header">
            <img className="logo" src={logo} alt="" />
            <a href="#" className="button type--B">
              <div className="button__line"></div>
              <div className="button__line"></div>
              <span className="button__text">LogIn / SignUp</span>
              <div className="button__drow1"></div>
              <div className="button__drow2"></div>
            </a>
          </div>
        </header>
        <div className="login-invitation">
          <div className="sign-up-trap">
            <h1>
              Organize,Collaborate,
              <br />
              Succeed with
              <br />
              <span>CardFlow</span>{" "}
            </h1>
            <p>Organize it all together,do not fall for trap</p>
          </div>
          <div className="design">
            <img src={form} className="card-schema" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
