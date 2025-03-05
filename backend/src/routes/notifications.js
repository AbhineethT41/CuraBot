/**
 * Notification Routes
 * Handles routes for notification-related operations
 */
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const notificationController = require('../controllers/notification');

/**
 * @route GET /api/notifications
 * @desc Get notifications for the authenticated user
 * @access Private
 */
router.get('/', authenticate, notificationController.getUserNotifications);

/**
 * @route PUT /api/notifications/:id/read
 * @desc Mark a notification as read
 * @access Private
 */
router.put('/:id/read', authenticate, notificationController.markAsRead);

/**
 * @route PUT /api/notifications/read-all
 * @desc Mark all notifications for the authenticated user as read
 * @access Private
 */
router.put('/read-all', authenticate, notificationController.markAllAsRead);

/**
 * @route DELETE /api/notifications/:id
 * @desc Delete a notification
 * @access Private
 */
router.delete('/:id', authenticate, notificationController.deleteNotification);

module.exports = router;
