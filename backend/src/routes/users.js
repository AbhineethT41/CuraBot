/**
 * User Routes
 * Handles routes for user-related operations
 */
const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const userController = require('../controllers/user');

/**
 * @route GET /api/users
 * @desc Get all users (admin only)
 * @access Private/Admin
 */
router.get('/', authenticate, requireRole('admin'), userController.getAllUsers);

/**
 * @route GET /api/users/:id
 * @desc Get a user by ID
 * @access Private
 */
router.get('/:id', authenticate, userController.getUserById);

/**
 * @route PUT /api/users/:id
 * @desc Update a user
 * @access Private
 */
router.put('/:id', authenticate, userController.updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Delete a user (admin only)
 * @access Private/Admin
 */
router.delete('/:id', authenticate, requireRole('admin'), userController.deleteUser);

/**
 * @route GET /api/users/role/:role
 * @desc Get users by role (admin only)
 * @access Private/Admin
 */
router.get('/role/:role', authenticate, requireRole('admin'), userController.getUsersByRole);

module.exports = router;
