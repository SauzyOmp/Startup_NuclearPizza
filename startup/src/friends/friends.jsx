import React from 'react';
import './friends.css';

export function Friends() {
  return (
    <main className="friends-page">
      <h1>Friends List</h1>
      <div>
        <ol>
          <li>ShadowNuke99</li>
          <li>AtomicTaco77</li>
          <li>FalloutFries420</li>
        </ol>
      </div>
      <div>
        <label htmlFor="friendCode">Friend Code:</label>
        <input
          type="text"
          id="friendCode"
          name="friendCode"
          placeholder="xxx-xxx-xxx"
        />
        <button id="addFriendButton">
          Click to add friend with their code
        </button>
      </div>
    </main>
  );
}