import React, { useEffect, useState } from 'react';
import Home from "./components/Home"
const API_URL = 'http://localhost:4000/api/status';
import "./App.css"
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

     <Home/>

  );
};

export default App;
