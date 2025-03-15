const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

// The users and friend data are saved in memory and disappear whenever the service is restarted.
// In a real application, you would want to persist them in a database
let users = [];
let friends = {};

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('username', req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.username, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ username: user.username });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('username', req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ username: user.username });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Get user information
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

// Friends endpoints
apiRouter.get('/friends', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }
  
  // If user has no friends list yet, create a default one
  if (!friends[user.username]) {
    friends[user.username] = [
      { username: "ShadowNuke99", score: 95 },
      { username: "AtomicTaco77", score: 85 },
      { username: "FalloutFries420", score: 90 }
    ];
  }
  
  res.send(friends[user.username]);
});

apiRouter.post('/friends/add', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }
  
  const { friendCode } = req.body;
  if (!/^\d{4}$/.test(friendCode)) {
    res.status(400).send({ msg: 'Invalid friend code' });
    return;
  }
  
  // Create a random friend
  const names = ["NuclearChef", "RadioactiveGamer", "IsotopeMaster", "PlutoniumPal", "UraniumUser"];
  const randomName = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
  const randomScore = Math.floor(Math.random() * 100);
  
  if (!friends[user.username]) {
    friends[user.username] = [];
  }
  
  friends[user.username].push({ username: randomName, score: randomScore });
  res.send({ success: true });
});

// Get a random nuclear fact (simulated third-party API)
apiRouter.get('/nuclearFact', (_req, res) => {
  const facts = [
    "Nuclear energy provides about 10% of the world's electricity.",
    "The first nuclear power plant began operating in the 1950s.",
    "Nuclear power plants produce no greenhouse gas emissions during operation.",
    "Marie Curie discovered the radioactive elements polonium and radium.",
    "The sun is powered by nuclear fusion.",
    "The world's first nuclear-powered submarine was the USS Nautilus, launched in 1954."
  ];
  
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  res.send({ fact: randomFact });
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
  users.push(user);
  return user;
}

async function findUser(key, value) {
  const user = users.find((user) => user[key] === value);
  return user;
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});