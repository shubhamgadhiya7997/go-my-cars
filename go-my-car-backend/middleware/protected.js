const jwt = require('jsonwebtoken');
const { Unauthorized, Forbidden, BadRequest } = require('../Response/response');
const user = require('../model/user');

const protected = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return Forbidden(res, 'No token provided.');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return Forbidden(res, 'Invalid token.');
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.secretKey);
  } catch (err) {
    console.error('JWT verification error:', err);
    return Unauthorized(res, 'Unauthorized');
  } 
  console.log("decoded", decoded)
  // console.log("decoded", decoded.payload)
  if (decoded.payload && decoded.payload.userType == "user") {
    const userdata = await user.findOne({ _id: decoded.payload._id })
    if(!userdata){
      return NotFound(res, "User not found")
    }
     if (userdata.isActive === false) {
      return BadRequest(res, 'User is not activate. Please contact admin.');
    }
     if (userdata.isDeleted === true) {
      return BadRequest(res, 'User not found.');
    }
  }
  req.user = decoded.payload;
  next();

};

module.exports = protected;
