import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import Boards from "./components/Board-list-card-components/Board";
import { ProfileHeader } from "./components/Profile/ProfileHeader";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/board/:boardId" element={<Boards />} />
        <Route path="/profile" element={<ProfileHeader />} />
      </Routes>
    </Router>
  );
};

export default App;
