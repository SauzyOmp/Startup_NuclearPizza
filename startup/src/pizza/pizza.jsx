import React, { useState } from 'react';
import './pizza.css';

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

import {
  APIProvider,
  Map as GoogleMap,
} from '@vis.gl/react-google-maps';

const bombData = [
  { name: "Little Boy", image: "little-boy.jpg", description: "A uranium-based bomb dropped on Hiroshima in 1945." },
  { name: "Fat Man", image: "fat-man.jpg", description: "A plutonium-based bomb dropped on Nagasaki in 1945." },
  { name: "Tsar Bomba", image: "tsar-bomba.jpg", description: "The largest nuclear bomb ever detonated, tested by the Soviet Union in 1961." },
  { name: "Castle Bravo", image: "castle-bravo.png", description: "A powerful hydrogen bomb test by the U.S. in 1954, causing unexpected fallout." },
  { name: "Ivy Mike", image: "ivy-mike.jpg", description: "The first full-scale hydrogen bomb test by the U.S. in 1952." }
];

export function Pizza() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="pizza-page">
      <aside className="bomb-buttons">
        {bombData.map((bomb, index) => (
          <div key={bomb.name} className="bomb-item">
            <button className="bomb-button" onClick={() => toggleDropdown(index)}>
              {bomb.name} <span className="info-icon">ℹ️</span>
            </button>
            {openDropdown === index && (
              <div className="bomb-info">
                <img src={bomb.image} alt={bomb.name} className="bomb-image" />
                <p>{bomb.description}</p>
              </div>
            )}
          </div>
        ))}
      </aside>
      <div className="map-container">
        <APIProvider apiKey={googleMapsApiKey}>
          <GoogleMap
            defaultCenter={{lat: 22.54992, lng: 0}}
            defaultZoom={3}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          />
        </APIProvider>
      </div>
    </div>
  );
}
