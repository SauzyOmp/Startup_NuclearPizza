const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

// Updated connection string with required parameters
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}/?retryWrites=true&w=majority`;
const client = new MongoClient(url);
const db = client.db('NuclearPizza');
const userCollection = db.collection('user');
const scoreCollection = db.collection('score');
const friendCollection = db.collection('friend');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    // Explicitly connect to the MongoDB client
    await client.connect();
    await db.command({ ping: 1 });
    console.log(`Connected to database at ${config.hostname}`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    console.error('Full error details:', ex);
    process.exit(1);
  }
})();

// Add a graceful shutdown handler
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

function getUser(username) {
  return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ username: user.username }, { $set: user });
}

async function addScore(score) {
  return scoreCollection.insertOne(score);
}

function getHighScores() {
  const query = { score: { $gt: 0, $lt: 900 } };
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

// Functions for friends functionality
async function getFriends(username) {
  const cursor = friendCollection.find({ owner: username });
  return cursor.toArray();
}

async function addFriend(username, friend) {
  const friendDoc = {
    owner: username,
    username: friend.username,
    score: friend.score
  };
  return friendCollection.insertOne(friendDoc);
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addScore,
  getHighScores,
  getFriends,
  addFriend
};