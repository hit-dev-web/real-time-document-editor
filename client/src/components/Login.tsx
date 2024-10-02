// src/components/Login.tsx

import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = 'http://localhost:3001/api/auth/login';
const Login: React.FC = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Make API call to authenticate user
      const response = await axios.post(API_URL, { email, password });
      const data = await response.data
      if (data) {
        // Save JWT token or session info
        localStorage.setItem('token', data.token);
        navigate('/'); // Redirect to document edit page after successful login
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
