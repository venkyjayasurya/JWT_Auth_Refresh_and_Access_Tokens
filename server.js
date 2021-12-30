require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const authenticateToken = require("./middleware/AuthenticateToken");

app.use(express.json());

let refreshToken = [];

const posts = [
  {
    username: "Venky",
    title: "Post 1",
  },
  {
    username: "Arun",
    title: "Post 2",
  },
];

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
}
function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

// takes username as body
// generates access token and refresh token
app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({ accessToken, refreshToken });
});

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

// Takes refreshtoken as input and generates new access token
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
//   if (refreshToken.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json(accessToken);
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
