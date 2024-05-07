const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token = req.session.token;
  //   const authHeader = req.headers["authorization"];
  //   const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.redirect("/login");
  }
  jwt.verify(token, "secret", (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
