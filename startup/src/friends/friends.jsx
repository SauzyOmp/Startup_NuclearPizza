import React, { useState } from 'react';
import './friends.css';

export function Friends() {
  const [friendsVisible, setFriendsVisible] = useState(false);
  const [friendCode, setFriendCode] = useState('');
  const [friends] = useState([
    "ShadowNuke99",
    "AtomicTaco77",
    "FalloutFries420"
  ]);
  const [message, setMessage] = useState('');

  const handleCodeChange = (e) => {
    setFriendCode(e.target.value);
  };

  const handleAddFriend = () => {
    const codePattern = /^\d{4}$/;
    
    if (codePattern.test(friendCode)) {
      setFriendsVisible(true);
      setMessage('Friend code validated!');
    } else if (friendCode === '') {
      setMessage('Please enter a friend code.');
    } else {
      setMessage('Invalid code format. Please use xxxx format (e.g. 1234)');
    }
  };

  return (
    <main className="friends-page">
      <h1>Friends List</h1>
      
      {friendsVisible ? (
        <div className="friends-list">
          <ol>
            {friends.map((friend, index) => (
              <li key={index}>{friend}</li>
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
    </main>
  );
}