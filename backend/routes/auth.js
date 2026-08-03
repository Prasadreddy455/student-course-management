const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);

// NOTE: To create your first admin account, either:
//  1) Set ALLOW_ADMIN_SIGNUP=true in .env temporarily and sign up with role: "admin", or
//  2) Sign up normally, then update that user's role to "admin" directly in MongoDB.

module.exports = router;
