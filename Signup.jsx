// src/components/Signup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../api/auth';
import "./Signup.css";
function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signupUser({ email, password });
      navigate('/login');
    } catch (err) {
      console.error(err.response); // Log the error for debugging
      setError(err.response?.data?.message || 'Error during signup');
    }
  };
  
  return (
    <div className="signup-container">
      <h1 className="header">VirtBank</h1>
      <form onSubmit={handleSignup}>
        <h2>Signup</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Signup;
