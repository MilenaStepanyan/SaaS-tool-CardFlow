import React from "react";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { ProfilePage } from "./components/Profile/ProfilePage";
import { BoardPage } from "./components/Profile/BoardPage";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/board/:boardId" element={<BoardPage />} />
      </Routes>
    </Router>
  );
};

export default App;
