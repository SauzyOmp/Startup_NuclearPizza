import React from 'react';
import './login.css';

export function Login({ onLogin }) {
  return (
    <main className="login-page">
      <h1>Welcome!</h1>
      <h2>Please log in below</h2>
      <div>
        <input type="text" placeholder="Email" />
      </div>
      <div>
        <input type="password" placeholder="Password" />
      </div>
      <div>
        <button className="auth-button" onClick={onLogin}>Sign In</button>
      </div>
      <div>
        <button className="auth-button" onClick={onLogin}>Create Account</button>
      </div>
    </main>
  );
}
