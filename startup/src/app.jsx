import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Map } from './map/map';
import { Friends } from './friends/friends';


export default function App() {
    return (
      <BrowserRouter>
            <div>
                <header>
                <h1>☢️NuclearPizza🍕</h1>
                <nav>
                    <ul>
                        <li><NavLink className='nav-link' to='friends'>Friends</NavLink></li>
                        <li><NavLink className='nav-link' to='map'>Map</NavLink></li>
                    </ul>
                </nav>
                </header>
        
                <main>App components go here</main>
        
                    <footer>
                    <p>Brandon Monson</p>
                    <a href="https://github.com/SauzyOmp/Startup_NuclearPizza" class="github-btn">GitHub</a>
                </footer>
            </div>
        </BrowserRouter>
    );
}