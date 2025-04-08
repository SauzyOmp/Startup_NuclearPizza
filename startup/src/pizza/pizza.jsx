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
  // ... your existing bomb data
];

// Score submission component with direct WebSocket usage
function ScoreSubmission({ username }) {
  const [score, setScore] = useState(75);
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

  // Submit pizza score
  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <div className="score-submission-container">
      <h3>Rate Your Nuclear Pizza Experience</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="score-slider">
          <label>Your Score: {score}</label>
          <input
            type="range"
            min="1"
            max="100"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value, 10))}
          />
          <div className="score-labels">
            <span>Meltdown</span>
            <span>Radioactive</span>
            <span>Nuclear!</span>
          </div>
        </div>
        
        <button 
          type="submit"
          disabled={submitting}
          className="score-submit-btn"
        >
          {submitting ? 'Submitting...' : 'Submit Score'}
        </button>
        
        {message && <p className="score-message">{message}</p>}
      </form>
    </div>
  );
}

// Your existing CircleDrawer component
function CircleDrawer({ selectedBomb }) {
  // ... existing code
}

export function Pizza({ username }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedBomb, setSelectedBomb] = useState(null);

  // ... existing functions

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
        
        {/* Add ScoreSubmission component */}
        <ScoreSubmission username={username} />
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
      
      {/* Add CSS for score submission */}
      <style jsx>{`
        .score-submission-container {
          margin-top: 30px;
          background-color: #333;
          padding: 15px;
          border-radius: 8px;
        }
        
        .score-submission-container h3 {
          margin-top: 0;
          font-size: 18px;
          color: #fff;
          text-align: center;
        }
        
        .score-slider {
          margin: 15px 0;
        }
        
        .score-slider label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
        }
        
        input[type="range"] {
          width: 100%;
          margin-bottom: 8px;
        }
        
        .score-labels {
          display: flex;
          justify-content: space-between;
          color: #ccc;
          font-size: 12px;
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
      `}</style>
    </div>
  );
}