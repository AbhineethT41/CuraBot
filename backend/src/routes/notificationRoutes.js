const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get all notifications
router.get('/', notificationController.getAllNotifications);

// Get notification by ID
router.get('/:id', notificationController.getNotificationById);

// Get notifications for a user
router.get('/user/:userId', notificationController.getNotificationsByUser);

// Create a new notification
router.post('/', notificationController.createNotification);

// Mark notification as read
router.put('/:id/read', notificationController.markNotificationAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
