import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
    return (
    <div>
        <header>
          <h1>☢️NuclearPizza🍕</h1>
          <nav>
              <ul>
                  <li><a href="map.html">Map</a></li>
                  <li><a href="friends.html">Friends</a></li>
              </ul>
          </nav>
        </header>
  
        <main>App components go here</main>
  
            <footer>
            <p>Brandon Monson</p>
            <a href="https://github.com/SauzyOmp/Startup_NuclearPizza" class="github-btn">GitHub</a>
        </footer>
      </div>
    );
  }