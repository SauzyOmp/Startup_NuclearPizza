import React, { useState, useEffect, useRef } from 'react';
import './pizza.css';

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

import {
  APIProvider,
  Map as GoogleMap,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';

const bombData = [
  { 
    name: "Little Boy", 
    image: "little-boy.jpg", 
    description: "A uranium-based bomb dropped on Hiroshima in 1945.",
    radii: [50000, 80000, 120000] 
  },
  { 
    name: "Fat Man", 
    image: "fat-man.jpg", 
    description: "A plutonium-based bomb dropped on Nagasaki in 1945.",
    radii: [60000, 100000, 150000]
  },
  { 
    name: "Tsar Bomba", 
    image: "tsar-bomba.jpg", 
    description: "The largest nuclear bomb ever detonated, tested by the Soviet Union in 1961.",
    radii: [250000, 500000, 800000] 
  },
  { 
    name: "Castle Bravo", 
    image: "castle-bravo.png", 
    description: "A powerful hydrogen bomb test by the U.S. in 1954, causing unexpected fallout.",
    radii: [150000, 300000, 450000] 
  },
  { 
    name: "Ivy Mike", 
    image: "ivy-mike.jpg", 
    description: "The first full-scale hydrogen bomb test by the U.S. in 1952.",
    radii: [100000, 200000, 300000] 
  }
];

// This component handles the circles drawing
function CircleDrawer({ selectedBomb }) {
  const map = useMap();
  const [circles, setCircles] = useState([]);
  const circlesRef = useRef([]);
  const clickListenerRef = useRef(null);
  const mapsLibrary = useMapsLibrary('maps');

  useEffect(() => {
    if (!map || !mapsLibrary) return;

    if (clickListenerRef.current) {
      window.google.maps.event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
    }


    clickListenerRef.current = window.google.maps.event.addListener(map, 'click', (event) => {
      const clickedLocation = { 
        lat: event.latLng.lat(), 
        lng: event.latLng.lng() 
      };
      
      console.log("Clicked location:", clickedLocation);
      
      const radii = selectedBomb !== null 
        ? bombData[selectedBomb].radii 
        : [100000, 200000, 300000]; 
      
      const newCircles = radii.map(radius => ({
        center: clickedLocation,
        radius,
      }));
      
      setCircles(newCircles);
    });

    return () => {
      if (clickListenerRef.current) {
        window.google.maps.event.removeListener(clickListenerRef.current);
      }
    };
  }, [map, mapsLibrary, selectedBomb]);

  useEffect(() => {
    if (!map || !mapsLibrary || circles.length === 0) return;

    circlesRef.current.forEach(circle => circle.setMap(null));
    circlesRef.current = [];

    circles.forEach(circleData => {
      const circle = new window.google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: map,
        center: circleData.center,
        radius: circleData.radius,
      });
      
      circlesRef.current.push(circle);
    });
  }, [circles, map, mapsLibrary]);

  return null;
}

export function Pizza() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedBomb, setSelectedBomb] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const selectBomb = (index) => {
    setSelectedBomb(index);
    console.log(`Selected bomb: ${bombData[index].name}`);
  };

  return (
    <div className="pizza-page">
      <aside className="bomb-buttons">
        {bombData.map((bomb, index) => (
          <div key={bomb.name} className="bomb-item">
            <button 
              className={`bomb-button ${selectedBomb === index ? 'selected' : ''}`} 
              onClick={() => selectBomb(index)}
            >
              {bomb.name} <span className="info-icon" onClick={(e) => {e.stopPropagation(); toggleDropdown(index);}}>ℹ️</span>
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
            defaultCenter={{ lat: 22.54992, lng: 0 }}
            defaultZoom={3}
            gestureHandling="greedy"
            disableDefaultUI={true}
          >
            <CircleDrawer selectedBomb={selectedBomb} />
          </GoogleMap>
        </APIProvider>
      </div>
    </div>
  );
}