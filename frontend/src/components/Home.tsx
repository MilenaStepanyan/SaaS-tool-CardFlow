import React from "react";
import form from "../../public/trello.webp";
import joiners from "../../public/logos-horizonal.svg";
import {Header} from "./Header"
const Home: React.FC = () => {
  return (
    <>
      <div className="main">
        <Header />
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
        <div className="our-joiners">
          <p>
            Join over 2,000,000 teams worldwide that are using Trello to get
            more done.
          </p>
          <img src={joiners} alt="" />
        </div>
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section about">
              <h2>About CardFlow</h2>
              <p>
                CardFlow is your go-to tool for project management, helping you
                collaborate and organize efficiently.
              </p>
            </div>
            <div className="footer-section links">
              <h2>Quick Links</h2>
              <ul>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Features</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
            <div className="footer-section social">
              <h2>Follow Us</h2>
              <div className="social-icons">
                <a href="#">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 CardFlow. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
