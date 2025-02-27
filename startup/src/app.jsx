import React, { useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { Login } from './login/login';
import { Pizza } from './pizza/pizza';
import { Friends } from './friends/friends';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
      <BrowserRouter>
        <div className="app-container">
          <header>
            <h1>☢️NuclearPizza🍕</h1>
            <nav>
              <ul>
                <li><NavLink className='nav-link' to='/pizza'>Pizza</NavLink></li>
                <li><NavLink className='nav-link' to='/friends'>Friends</NavLink></li>
              </ul>
            </nav>
            {isAuthenticated && (
              <button className="sign-out" onClick={() => setIsAuthenticated(false)}>Sign Out</button>
            )}
          </header>
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
              {isAuthenticated ? (
                <>
                  <Route path="/pizza" element={<Pizza />} />
                  <Route path="/friends" element={<Friends />} />
                  <Route path="*" element={<NotFound />} />
                </>
              ) : (
                <Route path="*" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
              )}
            </Routes>
          </main>
          <footer>
            <p>Brandon Monson</p>
            <a href="https://github.com/SauzyOmp/Startup_NuclearPizza" className="github-btn">GitHub</a>
          </footer>
        </div>
      </BrowserRouter>
    );
}

function LoginPage({ setIsAuthenticated }) {
    const navigate = useNavigate();
    
    const handleLogin = () => {
        setIsAuthenticated(true);
        navigate('/pizza');
    };
    
    return <Login onLogin={handleLogin} />;
}

function NotFound() {
    return <main className="not-found">404: Page Not Found</main>;
}