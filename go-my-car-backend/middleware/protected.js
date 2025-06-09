const jwt = require('jsonwebtoken');
const { Unauthorized, Forbidden } = require('../Response/response');

const protected = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return Forbidden(res, 'No token provided.');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return Forbidden(res, 'Invalid token.');
  }

  jwt.verify(token, process.env.secretKey, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      return Unauthorized(res, 'Unauthorized');
    }

    req.user = decoded.userDetails;
    next();
  });
};

module.exports = protected;
