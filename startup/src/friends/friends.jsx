import React, { useState, useEffect } from 'react';
import './friends.css';

export function Friends() {
  const [friendsVisible, setFriendsVisible] = useState(false);
  const [friendCode, setFriendCode] = useState('');
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState('');
  const [nuclearFact, setNuclearFact] = useState('');

  // Fetch friends list on component mount
  useEffect(() => {
    fetchFriends();
    fetchNuclearFact();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await fetch('/api/friends');
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
        if (data.length > 0) {
          setFriendsVisible(true);
        }
      } else if (response.status !== 401) {
        // 401 is expected if not logged in yet
        setMessage('Failed to fetch friends list');
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchNuclearFact = async () => {
    try {
      const response = await fetch('/api/nuclearFact');
      if (response.ok) {
        const data = await response.json();
        setNuclearFact(data.fact);
      }
    } catch (error) {
      console.error('Error fetching nuclear fact:', error);
    }
  };

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
        setMessage('Friend code validated!');
        setFriendsVisible(true);
        // Refresh friends list
        fetchFriends();
      } else {
        const data = await response.json();
        setMessage(data.msg || 'Failed to add friend');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      setMessage('Error connecting to server');
    }
  };

  return (
    <main className="friends-page">
      <h1>Friends List</h1>
      
      {friendsVisible ? (
        <div className="friends-list">
          <ol>
            {friends.map((friend, index) => (
              <li key={index}>
                {friend.username} - Score: {friend.score}
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="friends-hidden">
          <p>Enter your friend code to view your friends list</p>
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
          Validate Friend Code
        </button>
        
        {message && <p className="message">{message}</p>}
      </div>

      {nuclearFact && (
        <div className="nuclear-fact" style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#222', 
          borderRadius: '8px' 
        }}>
          <h3>Nuclear Fact:</h3>
          <p>{nuclearFact}</p>
        </div>
      )}
    </main>
  );
}