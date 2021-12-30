// Used to check whether the user has permission to access the routes

// Takes Accesstoken from the authorization header and verifies it using the jwt.verify function
// access token has the embedded username which stores in user object after verifying the token

// If the token is valid, it will return the user object
// If the token is invalid, it will return an error
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  //  Bearer Token
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (accessToken == null) return res.sendStatus(401);

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
