import React, { useState, useEffect } from 'react';
import './friends.css';

export function Friends({ username }) {
  const [friendCode, setFriendCode] = useState('');
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  // Initialize WebSocket and fetch friends on component mount
  useEffect(() => {
    // Create WebSocket connection
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle score updates
        if (data.type === 'scoreUpdate') {
          // Update the friend's score in our local state if it's our friend
          const isFriend = friends.some(friend => friend.username === data.username);
          
          if (isFriend) {
            // Update the friends list with the new score
            setFriends(currentFriends => 
              currentFriends.map(friend => 
                friend.username === data.username 
                  ? { ...friend, score: data.score } 
                  : friend
              )
            );
            
            // Add notification
            const newNotification = {
              id: Date.now(),
              username: data.username,
              score: data.score,
              timestamp: new Date().toISOString()
            };
            
            setNotifications(prev => [newNotification, ...prev].slice(0, 5));
            
            // Auto-dismiss notification after 5 seconds
            setTimeout(() => {
              setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
            }, 5000);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
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

  const handleCodeChange = (e) => {
    setFriendCode(e.target.value);
  };

  const handleAddFriend = async () => {
    const codePattern = /^\d{4}$/;
    
    if (!codePattern.test(friendCode)) {
      if (friendCode === '') {
        setMessage('Please enter a friend code.');
      } else {
        setMessage('Invalid code format. Please use xxxx format (e.g. 1234)');
      }
      return;
    }

    try {
      const response = await fetch('/api/friends/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendCode }),
      });

      if (response.ok) {
        const newFriend = await response.json();
        
        // Fetch updated friends list with scores
        const scoresResponse = await fetch('/api/friends/scores');
        if (scoresResponse.ok) {
          const friendScores = await scoresResponse.json();
          
          // Combine friend info with their latest scores
          const updatedFriends = friendScores.map(score => ({
            username: score.username,
            score: score.score
          }));
          
          setFriends(updatedFriends);
          setMessage('Friend added successfully!');
          setFriendCode('');
        } else {
          setMessage('Friend added, but could not retrieve scores');
        }
      } else {
        const data = await response.json();
        setMessage(data.msg || 'Failed to add friend');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      setMessage('Error connecting to server');
    }
  };

  // Format time for notifications
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Close a notification
  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <main className="friends-page">
      <h1>Friends List</h1>
      
      {/* Notification area */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div key={notification.id} className="notification">
            <span className="close-btn" onClick={() => dismissNotification(notification.id)}>&times;</span>
            <p>
              <strong>{notification.username}</strong> just got a new score: {notification.score}!
              <span className="notification-time">{formatTime(notification.timestamp)}</span>
            </p>
          </div>
        ))}
      </div>
      
      {friends.length > 0 ? (
        <div className="friends-list">
          <ol>
            {friends.map((friend, index) => (
              <li key={index}>
                {friend.username} - Best Score: {friend.score}
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="friends-hidden">
          <p>Enter a friend code to add friends</p>
        </div>
      )}
      
      <div className="friend-code-input">
        <label htmlFor="friendCode">Friend Code:</label>
        <input
          type="text"
          id="friendCode"
          name="friendCode"
          value={friendCode}
          onChange={handleCodeChange}
          placeholder="xxxx"
        />
        <button id="addFriendButton" onClick={handleAddFriend}>
          Add Friend
        </button>
        
        {message && <p className="message">{message}</p>}
      </div>
      
      {/* Notification CSS (kept from previous version) */}
      <style jsx>{`
        .notifications-container {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 300px;
          z-index: 1000;
        }
        
        .notification {
          background-color: #333;
          border-left: 4px solid #007bff;
          color: white;
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          position: relative;
          animation: slideIn 0.3s ease;
        }
        
        .close-btn {
          position: absolute;
          top: 8px;
          right: 10px;
          cursor: pointer;
          color: #aaa;
        }
        
        .close-btn:hover {
          color: white;
        }
        
        .notification-time {
          display: block;
          font-size: 0.8em;
          color: #aaa;
          margin-top: 5px;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}