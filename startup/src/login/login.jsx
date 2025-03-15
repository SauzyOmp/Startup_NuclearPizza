import React, { useState } from 'react';
import './login.css';

export function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('username', data.username);
        onLogin();
      } else {
        const data = await response.json();
        setMessage(data.msg || 'Login failed');
      }
    } catch (error) {
      setMessage('Error connecting to server');
      console.error('Login error:', error);
    }
  };

  const handleCreateAccount = async () => {
    if (!username || !password) {
      setMessage('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('/api/auth/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('username', data.username);
        onLogin();
      } else {
        const data = await response.json();
        setMessage(data.msg || 'Failed to create account');
      }
    } catch (error) {
      setMessage('Error connecting to server');
      console.error('Create account error:', error);
    }
  };

  return (
    <main className="login-page">
      <h1>Welcome!</h1>
      <h2>Please log in below</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <div>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button className="auth-button" onClick={handleLogin}>Sign In</button>
      </div>
      <div>
        <button className="auth-button" onClick={handleCreateAccount}>Create Account</button>
      </div>
    </main>
  );
}