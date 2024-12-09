// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <h1>VirtBank</h1>
      <p>
        <Link to="/login" className="button">Login</Link>
        <Link to="/signup" className="button">Sign Up</Link>
      </p>
    </div>
  );
}

export default Home;
