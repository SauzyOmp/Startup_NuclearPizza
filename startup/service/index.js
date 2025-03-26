const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

// The service port may be set on the command line
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the applications static content
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('username', req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.username, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ username: user.username });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('username', req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUser(user);
      setAuthCookie(res, user.token);
      res.send({ username: user.username });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
    await DB.updateUser(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Get user by username
apiRouter.get('/user/:username', async (req, res) => {
  const user = await findUser('username', req.params.username);
  if (user) {
    const token = req?.cookies.token;
    res.send({ username: user.username, authenticated: token === user.token });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// GetFriends
apiRouter.get('/friends', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const friends = await DB.getFriends(user.username);
  
  if (!friends || friends.length === 0) {
    // Initialize with default friends if none exist
    const defaultFriends = [
      { username: "ShadowNuke99", score: 95 },
      { username: "AtomicTaco77", score: 85 },
      { username: "FalloutFries420", score: 90 }
    ];
    
    for (const friend of defaultFriends) {
      await DB.addFriend(user.username, friend);
    }
    
    res.send(defaultFriends);
  } else {
    res.send(friends);
  }
});

// AddFriend
apiRouter.post('/friends/add', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  
  const { friendCode } = req.body;
  if (!/^\d{4}$/.test(friendCode)) {
    res.status(400).send({ msg: 'Invalid friend code' });
    return;
  }
  
  const names = ["NuclearChef", "RadioactiveGamer", "IsotopeMaster", "PlutoniumPal", "UraniumUser"];
  const randomName = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
  const randomScore = Math.floor(Math.random() * 100);
  
  const newFriend = { username: randomName, score: randomScore };
  await DB.addFriend(user.username, newFriend);
  
  res.send({ success: true });
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
  };
  await DB.addUser(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return DB.getUserByToken(value);
  } else if (field === 'username') {
    return DB.getUser(value);
  }
  return null;
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});