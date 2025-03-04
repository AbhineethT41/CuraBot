/**
 * Auth Routes
 * Routes for authentication and user management
 */
const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken, hasRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Get current user profile (requires authentication)
router.get('/me', verifyToken, authController.getCurrentUser);

// Create or update user profile (requires authentication)
router.post('/profile', verifyToken, authController.createUserProfile);

// Create doctor profile (requires authentication)
router.post('/doctor-profile', verifyToken, authController.createDoctorProfile);

module.exports = router;
