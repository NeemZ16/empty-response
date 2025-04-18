import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PhaserHome from './pages/PhaserHome';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/style.css'; //phaser style css


function App() {
  const [username, setUsername] = useState('');

  //on startup, check if user is logged in
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const res = await fetch('http://localhost:8000/me', {
          method: 'GET',
          credentials: 'include'
        });
        if (!res.ok) throw new Error(`Status ${res.status}`); //throw error if not response not ok

        const data = await res.json(); //parses the response body as JSON
      
        setUsername(data.username); //if username is empty, user is not logged in

      } catch (err) {
        console.warn('Could not fetch current user:', err);
      }
    };
  

    loadCurrentUser();

  }, []);

  return (
    <Router>
      <Routes>

        <Route path="/" element={<PhaserHome username={username} setUsername={setUsername} />} />

        <Route path="/login" element={<Login setUsername={setUsername} />} />

        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
  );
}

export default App;