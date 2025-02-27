import React from 'react';
import './login.css';

export function Login() {
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
        <input type="submit" value="Sign In" />
      </div>
      <div>
        <input type="submit" value="Create Account" />
      </div>
    </main>
  );
}
