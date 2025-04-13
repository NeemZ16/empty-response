import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PhaserHome from './pages/PhaserHome';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/style.css'; //phaser style css


function App() {
  const [username, setUsername] = useState('');

  return (
    <Router>
      <Routes>

        <Route path="/" element={<PhaserHome username={username} />} />

        <Route path="/login" element={<Login setUsername={setUsername} />} />

      </Routes>
    </Router>
  );
}

export default App;