/**
 * Auth Routes
 * Handles authentication-related operations
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticate, requireRole } = require('../middleware/auth');

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Public
 */
router.post('/logout', authController.logout);

/**
 * @route POST /api/auth/profile
 * @desc Create or update user profile
 * @access Private
 */
router.post('/profile', authenticate, authController.createUserProfile);

/**
 * @route POST /api/auth/doctor-profile
 * @desc Create doctor profile
 * @access Private
 */
router.post('/doctor-profile', authenticate, authController.createDoctorProfile);

/**
 * @route POST /api/auth/refresh-token
 * @desc Refresh JWT token
 * @access Public
 */
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
