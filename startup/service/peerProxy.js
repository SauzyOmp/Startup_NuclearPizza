const { WebSocketServer } = require('ws');

function peerProxy(httpServer) {
  // Create a websocket server
  const socketServer = new WebSocketServer({ server: httpServer });
  
  // Track username to socket mapping
  const userConnections = new Map();

  socketServer.on('connection', (socket) => {
    socket.isAlive = true;
    let username = null;

    // Handle messages from clients
    socket.on('message', function message(data) {
      try {
        const message = JSON.parse(data);
        
        // If this is a registration message, store the username-socket mapping
        if (message.type === 'register' && message.username) {
          username = message.username;
          userConnections.set(username, socket);
          console.log(`User registered: ${username}`);
          return;
        }
        
        // Handle score updates
        if (message.type === 'scoreUpdate') {
          const { username, score } = message;
          console.log(`Score update from ${username}: ${score}`);
        }

        // Broadcast message to all clients except sender
        socketServer.clients.forEach((client) => {
          if (client !== socket && client.readyState === WebSocketServer.OPEN) {
            client.send(data);
          }
        });
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    // Handle pings to keep connection alive
    socket.on('pong', () => {
      socket.isAlive = true;
    });
    
    // Handle disconnections
    socket.on('close', () => {
      if (username) {
        userConnections.delete(username);
        console.log(`User disconnected: ${username}`);
      }
    });
  });

  // Ping clients periodically to check if they're still connected
  const interval = setInterval(() => {
    socketServer.clients.forEach((socket) => {
      if (socket.isAlive === false) {
        return socket.terminate();
      }
      
      socket.isAlive = false;
      socket.ping();
    });
  }, 10000);
  
  // Clean up interval on server close
  socketServer.on('close', () => {
    clearInterval(interval);
  });

  return socketServer;
}

module.exports = { peerProxy };