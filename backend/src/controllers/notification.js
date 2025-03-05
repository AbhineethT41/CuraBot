/**
 * Notification Controller
 * Handles notification-related routes and logic
 */
const notificationService = require('../services/notificationService');

/**
 * Get notifications for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { unread } = req.query;
    
    const notifications = await notificationService.getUserNotifications(
      userId, 
      unread === 'true'
    );
    
    return res.status(200).json(notifications);
  } catch (error) {
    console.error('Error getting user notifications:', error);
    return res.status(500).json({ error: 'Failed to get notifications' });
  }
};

/**
 * Mark a notification as read
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Notification ID is required' });
    }
    
    const updatedNotification = await notificationService.markAsRead(id);
    
    return res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

/**
 * Mark all notifications for the authenticated user as read
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await notificationService.markAllAsRead(userId);
    
    return res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

/**
 * Delete a notification
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Notification ID is required' });
    }
    
    await notificationService.deleteNotification(id);
    
    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ error: 'Failed to delete notification' });
  }
};
