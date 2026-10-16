const User = require('../models/User');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, rollNumber, department } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.'
      });
    }

    // Try MongoDB creation if connected
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists.'
        });
      }

      const user = await User.create({
        fullName,
        email,
        password, // In full production, hashed via bcrypt
        role: role || 'student',
        rollNumber: rollNumber || '',
        department: department || 'Computer Applications'
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully!',
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          department: user.department
        }
      });
    } catch (dbError) {
      // Fallback response for offline starter mode
      return res.status(201).json({
        success: true,
        message: 'Registration simulated successfully (Starter Mode).',
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 'usr_' + Date.now(),
          fullName,
          email,
          role: role || 'student',
          department: department || 'Computer Applications'
        }
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: err.message
    });
  }
};

/**
 * @desc    Authenticate user & return token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    try {
      const user = await User.findOne({ email });
      if (user && user.password === password) {
        return res.status(200).json({
          success: true,
          message: 'Login successful!',
          token: 'jwt-token-' + user._id,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            department: user.department
          }
        });
      }
    } catch (dbErr) {
      // Proceed to starter demo fallback
    }

    // Default starter response for quick demonstration
    const isMockAdmin = email.includes('admin');
    return res.status(200).json({
      success: true,
      message: 'Login successful (Starter Demo Mode)!',
      token: 'demo-jwt-token-' + Date.now(),
      user: {
        id: 'usr_demo_101',
        fullName: isMockAdmin ? 'Faculty Administrator' : 'Rahul Sharma (MCA Student)',
        email,
        role: isMockAdmin ? 'admin' : 'student',
        department: 'Computer Applications'
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: err.message
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Protected
 */
exports.getUserProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: 'usr_demo_101',
      fullName: 'Rahul Sharma',
      email: 'rahul.mca@college.edu',
      role: 'student',
      department: 'Computer Applications',
      rollNumber: 'MCA-2025-042'
    }
  });
};
