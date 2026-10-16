const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile
} = require('../controllers/authController');

// Public authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile route
router.get('/profile', getUserProfile);

module.exports = router;
