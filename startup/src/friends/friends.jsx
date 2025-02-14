import React from 'react';
import './friends.css'

export function Friends() {
  return (
    <main>
    <h1>Friends List</h1>
      <div>
        <ol>
          <li>ShadowNuke99</li>
          <li>AtomicTaco77</li>
          <li>FalloutFries420</li>
        </ol>          
      </div>
       <div>
          <label for="username">Friend Code:</label> 
          <input type="text" id="username" name="username" placeholder="xxx-xxx-xxx"></input>
          <button id="myButton" onclick="changeButtonText()">Click to add friend with their code</button>
        </div>
  </main>
  );
}