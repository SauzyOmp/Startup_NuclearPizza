import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Pizza } from './pizza/pizza';
import { Friends } from './friends/friends';


export default function App() {
    return (
      <div className="app-container">
          <BrowserRouter>
                <div>
                    <header>
                    <h1>☢️NuclearPizza🍕</h1>
                    <nav>
                        <ul>
                            <li><NavLink className='nav-link' to='friends'>Friends</NavLink></li>
                            <li><NavLink className='nav-link' to='pizza'>Pizza</NavLink></li>
                        </ul>
                    </nav>
                    </header>

                        <main className="main-content">
                            <Routes>
                            <Route path='/friends' element={<Friends />} />
                            <Route path='/pizza' element={<Pizza />} />
                            <Route path='*' element={<Login />} />
                            </Routes>
                        </main>

                        <footer>
                        <p>Brandon Monson</p>
                        <a href="https://github.com/SauzyOmp/Startup_NuclearPizza" className="github-btn">GitHub</a>
                    </footer>
                </div>
            </BrowserRouter>
      </div>
    );
}
function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
  }