const { WebSocketServer } = require('ws');

function peerProxy(httpServer) {
  // Create a websocket object
  const socketServer = new WebSocketServer({ server: httpServer });
  
  // Store active connections by username
  const connections = new Map();

  socketServer.on('connection', (socket) => {
    socket.isAlive = true;
    console.log('WebSocket connection established');

    // Handle messages from clients
    socket.on('message', function message(data) {
      try {
        const parsedData = JSON.parse(data);
        
        // If it's a registration message, store the username-socket association
        if (parsedData.type === 'register' && parsedData.username) {
          connections.set(parsedData.username, socket);
          console.log(`User ${parsedData.username} registered for WebSocket updates`);
          
          // Send confirmation back to the client
          socket.send(JSON.stringify({ 
            type: 'registration', 
            success: true 
          }));
          return;
        }
        
        // For score updates, only send to relevant friends
        if (parsedData.type === 'scoreUpdate') {
          const { username, score, friends } = parsedData;
          
          if (friends && Array.isArray(friends)) {
            // Create notification message
            const notification = JSON.stringify({
              type: 'friendScoreUpdate',
              username: username,
              score: score,
              timestamp: new Date().toISOString()
            });
            
            // Send to each friend that is connected
            friends.forEach(friendName => {
              const friendSocket = connections.get(friendName);
              if (friendSocket && friendSocket.readyState === WebSocketServer.OPEN) {
                friendSocket.send(notification);
              }
            });
          }
          return;
        }
        
        // For any other message types, broadcast to all (like the original example)
        socketServer.clients.forEach((client) => {
          if (client !== socket && client.readyState === WebSocketServer.OPEN) {
            client.send(data);
          }
        });
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    // Respond to pong messages by marking the connection alive
    socket.on('pong', () => {
      socket.isAlive = true;
    });
    
    // Handle disconnection
    socket.on('close', () => {
      // Remove this connection from our map
      for (const [username, conn] of connections.entries()) {
        if (conn === socket) {
          connections.delete(username);
          console.log(`User ${username} disconnected`);
          break;
        }
      }
    });
  });

  // Periodically send out a ping message to make sure clients are alive
  setInterval(() => {
    socketServer.clients.forEach(function each(client) {
      if (client.isAlive === false) return client.terminate();

      client.isAlive = false;
      client.ping();
    });
  }, 10000);
  
  // Provide methods for other parts of the application to use
  function broadcastScoreUpdate(username, score, friendsList) {
    if (!friendsList || !Array.isArray(friendsList)) return;
    
    const notification = JSON.stringify({
      type: 'friendScoreUpdate',
      username: username,
      score: score,
      timestamp: new Date().toISOString()
    });
    
    friendsList.forEach(friendName => {
      const friendSocket = connections.get(friendName);
      if (friendSocket && friendSocket.readyState === WebSocketServer.OPEN) {
        friendSocket.send(notification);
      }
    });
  }
  
  return {
    broadcastScoreUpdate
  };
}

module.exports = { peerProxy };