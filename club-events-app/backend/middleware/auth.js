const jwt = require('jsonwebtoken');
const Club = require('../models/Club');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const club = await Club.findById(decoded.clubId).select('-password');
    
    if (!club) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.club = club;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
