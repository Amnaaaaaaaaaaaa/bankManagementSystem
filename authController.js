const bcrypt = require('bcrypt'); // or bcryptjs
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// Signup logic
exports.signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid user data' });
  }

  res.status(201).json({
    message: 'User created successfully',
    userId: user._id,
  });
});

// Login logic
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
    },
  });
});
