import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import "./Login.css"

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      
      // Store token
      localStorage.setItem('token', response.data.token);
      
      // Store user role
      localStorage.setItem('userRole', response.data.role); // Assuming backend sends role
      
      // Navigate to appropriate page based on role
      if (response.data.role === 'admin') {
        navigate('/loans'); // Direct to loans for admin
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
  <h1 className="header">VirtBank</h1>
  <form onSubmit={handleLogin}>
    <h2>Login</h2>
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
    <button type="submit">Login</button>
    {error && <p className="error">{error}</p>}
  </form>
</div>

  );
}

export default Login;