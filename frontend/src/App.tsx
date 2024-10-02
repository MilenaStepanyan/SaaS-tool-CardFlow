import React from "react";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import { Login } from "./components/Login";
const App: React.FC = () => {
  // useEffect(() => {
  //   const fetchStatus = async () => {
  //     try {
  //       const response = await fetch(API_URL);
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const data = await response.json();
  //       setStatus(data.message);
  //     } catch (error) {
  //       console.error('Error fetching status:', error);
  //       setStatus('Error fetching status');
  //     }
  //   };

  //   fetchStatus();
  // }, []);

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </Router>
  );
};

export default App;

