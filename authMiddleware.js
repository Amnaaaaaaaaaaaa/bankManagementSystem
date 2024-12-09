const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) return res.status(404).json({ message: 'User not found' });
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

exports.adminOnly = (req, res, next) => {
  console.log('User in adminOnly middleware:', req.user);
  console.log('User role:', req.user?.role);
  
  if (req.user ) {//&& req.user.role === 'admin'
    next();
  } else {
    console.log('Admin access denied');
    res.status(403).json({ 
      message: 'Access denied, admin only',
      userRole: req.user?.role 
    });
  }
};