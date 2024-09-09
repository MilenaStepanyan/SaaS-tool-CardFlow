import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000/api/status';

const App: React.FC = () => {
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStatus(data.message);
      } catch (error) {
        console.error('Error fetching status:', error);
        setStatus('Error fetching status');
      }
    };

    fetchStatus();
  }, []);

  return (
    <div className="App">
      <h1>{status}</h1>
    </div>
  );
};

export default App;
