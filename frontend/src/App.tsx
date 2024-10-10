import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import Boards from "./components/Board-list-card-components/Board";
import { ProfileHeader } from "./components/Profile/ProfileHeader";
// import ProfilePage from "./components/Profile/ProfilePage";

// import CreateBoard from "./components/Profile/CreateBoard";

const App: React.FC = () => {
  //const [boards, setBoards] = useState<any[]>([]); // Adjust the type as needed

  // const fetchBoards = async () => {
  //   try {
  //     const response = await fetch("/api/boards"); // Adjust the API endpoint as needed
  //     if (response.ok) {
  //       const data = await response.json();
  //       setBoards(data.boards);
  //     } else {
  //       console.error("Failed to fetch boards");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching boards:", error);
  //   }
  // };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/board/:boardId" element={<Boards />} />
       <Route path="/profile" element={<ProfileHeader />}/>
      </Routes>
    </Router>
  );
};

export default App;
