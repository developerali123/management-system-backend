const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../tokenBlacklist');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ status: 'error', msg: 'No token provided' });
  }

  if (isTokenBlacklisted(token)) {
    return res.status(403).json({ status: 'error', msg: 'Token is blacklisted' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ status: 'error', msg: 'Invalid token' });
    }
    req.user = user; // Attach user info to the request object
    next();
  });
};

module.exports = authenticateToken;
