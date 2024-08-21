const jwt = require('jsonwebtoken')
const config = process.env;
const verifyToken = (req, res, next) => {
  const token =
    req.body.x_auth_token || req.query.x_auth_token || req.headers["x_auth_token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.adminn = {
      id: decoded.admin_id,
      email: decoded.email
    }

  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

module.exports = verifyToken;