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
    radii: [50000, 80000, 120000],
    baseScore: 30 // Base score for this bomb
  },
  { 
    name: "Fat Man", 
    image: "fat-man.jpg", 
    description: "A plutonium-based bomb dropped on Nagasaki in 1945.",
    radii: [60000, 100000, 150000],
    baseScore: 45 // Base score for this bomb
  },
  { 
    name: "Tsar Bomba", 
    image: "tsar-bomba.jpg", 
    description: "The largest nuclear bomb ever detonated, tested by the Soviet Union in 1961.",
    radii: [250000, 500000, 800000],
    baseScore: 95 // Base score for this bomb
  },
  { 
    name: "Castle Bravo", 
    image: "castle-bravo.png", 
    description: "A powerful hydrogen bomb test by the U.S. in 1954, causing unexpected fallout.",
    radii: [150000, 300000, 450000],
    baseScore: 75 // Base score for this bomb
  },
  { 
    name: "Ivy Mike", 
    image: "ivy-mike.jpg", 
    description: "The first full-scale hydrogen bomb test by the U.S. in 1952.",
    radii: [100000, 200000, 300000],
    baseScore: 60 // Base score for this bomb
  }
];

// This component handles the circles drawing and score generation
function CircleDrawer({ selectedBomb, onScoreGenerated }) {
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
      
      // Get the selected bomb data, or use a default if none selected
      const bombIndex = selectedBomb !== null ? selectedBomb : 0;
      const bomb = bombData[bombIndex];
      const radii = bomb.radii;
      
      const newCircles = radii.map(radius => ({
        center: clickedLocation,
        radius,
      }));
      
      setCircles(newCircles);
      
      // Generate a score based on the bomb and add some randomness
      generateAndSubmitScore(bomb);
    });

    return () => {
      if (clickListenerRef.current) {
        window.google.maps.event.removeListener(clickListenerRef.current);
      }
    };
  }, [map, mapsLibrary, selectedBomb, onScoreGenerated]);

  // Function to generate a score based on the bomb
  const generateAndSubmitScore = (bomb) => {
    // Base score is determined by the bomb type
    const baseScore = bomb.baseScore;
    
    // Add randomness: +/- 20% of the base score
    const randomFactor = 0.8 + (Math.random() * 0.4); // Between 0.8 and 1.2
    
    // Calculate final score (between 1-100)
    let finalScore = Math.round(baseScore * randomFactor);
    finalScore = Math.min(100, Math.max(1, finalScore)); // Ensure it's between 1-100
    
    // Pass the score up to the parent component
    onScoreGenerated(finalScore);
  };

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

// Score display and submission component
function ScoreDisplay({ score, username, onReset }) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  
  // Initialize WebSocket
  useEffect(() => {
    // Create WebSocket connection
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      setSocket(ws);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    // Clean up on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Submit score
  const handleSubmit = async () => {
    if (score === null) return;
    
    setSubmitting(true);
    setMessage('');

    try {
      // Submit score to the server
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score }),
      });

      if (response.ok) {
        // Also send via WebSocket if connected
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'scoreUpdate',
            username,
            score
          }));
        }

        setMessage('Your pizza score has been submitted!');
        
        // Reset after 3 seconds
        setTimeout(() => {
          setMessage('');
          onReset();
        }, 3000);
      } else {
        setMessage('Failed to submit score. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  // If no score, don't render anything
  if (score === null) {
    return null;
  }

  return (
    <div className="score-display">
      <h3>Your Nuclear Pizza Score</h3>
      <div className="score-value">{score}</div>
      <p className="score-explanation">
        This score reflects the quality of the pizza prepared in the blast zone!
      </p>
      <button 
        onClick={handleSubmit}
        disabled={submitting}
        className="score-submit-btn"
      >
        {submitting ? 'Submitting...' : 'Submit Score'}
      </button>
      
      {message && <p className="score-message">{message}</p>}
    </div>
  );
}

export function Pizza({ username }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedBomb, setSelectedBomb] = useState(null);
  const [currentScore, setCurrentScore] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const selectBomb = (index) => {
    setSelectedBomb(index);
    console.log(`Selected bomb: ${bombData[index].name}`);
  };
  
  const handleScoreGenerated = (score) => {
    setCurrentScore(score);
  };
  
  const resetScore = () => {
    setCurrentScore(null);
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
        
        {/* Score Display */}
        <ScoreDisplay 
          score={currentScore} 
          username={username}
          onReset={resetScore}
        />
      </aside>
      <div className="map-container">
        <APIProvider apiKey={googleMapsApiKey}>
          <GoogleMap
            defaultCenter={{ lat: 22.54992, lng: 0 }}
            defaultZoom={3}
            gestureHandling="greedy"
            disableDefaultUI={true}
          >
            <CircleDrawer 
              selectedBomb={selectedBomb} 
              onScoreGenerated={handleScoreGenerated}
            />
          </GoogleMap>
        </APIProvider>
      </div>
      
      {/* Add CSS for score display */}
      <style jsx>{`
        .score-display {
          margin-top: 30px;
          background-color: #333;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        
        .score-display h3 {
          margin-top: 0;
          font-size: 18px;
          color: #fff;
        }
        
        .score-value {
          font-size: 48px;
          font-weight: bold;
          color: #ff7700;
          margin: 15px 0;
          text-shadow: 0 0 10px rgba(255, 119, 0, 0.5);
        }
        
        .score-explanation {
          font-size: 14px;
          color: #ccc;
          margin-bottom: 15px;
        }
        
        .score-submit-btn {
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 15px;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.3s;
        }
        
        .score-submit-btn:hover {
          background-color: #0056b3;
        }
        
        .score-submit-btn:disabled {
          background-color: #666;
          cursor: not-allowed;
        }
        
        .score-message {
          margin-top: 10px;
          text-align: center;
          color: #4caf50;
        }
        
        /* Make selected bomb button more prominent */
        .bomb-button.selected {
          background-color: #0056b3;
          border: 1px solid #007bff;
          box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
        }
      `}</style>
    </div>
  );
}