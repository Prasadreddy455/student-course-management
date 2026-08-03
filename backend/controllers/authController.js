const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// @desc  Register new user
// @route POST /api/auth/signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // Only allow 'admin' role via signup if explicitly enabled — default everyone to student
    const safeRole = role === 'admin' && process.env.ALLOW_ADMIN_SIGNUP === 'true' ? 'admin' : 'student';

    const user = await User.create({ name, email, password, role: safeRole });
    const token = generateToken(user._id);

    res.status(201).json({ user: user.toSafeObject(), token });
  } catch (err) {
    next(err);
  }
};

// @desc  Login user
// @route POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({ user: user.toSafeObject(), token });
  } catch (err) {
    next(err);
  }
};

// @desc  Get current logged-in user
// @route GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user.toSafeObject ? req.user.toSafeObject() : req.user });
  } catch (err) {
    next(err);
  }
};
