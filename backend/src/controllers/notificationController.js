const asyncHandler = require('express-async-handler');

// Mock data for notifications
const mockNotifications = [
  {
    id: '1',
    userId: '1',
    type: 'appointment',
    title: 'Appointment Reminder',
    message: 'You have an appointment with Dr. Smith tomorrow at 10:00 AM.',
    relatedId: '101', // appointment ID
    timestamp: '2023-06-01T08:00:00Z',
    isRead: false
  },
  {
    id: '2',
    userId: '1',
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from Dr. Smith.',
    relatedId: '4', // message ID
    timestamp: '2023-06-01T10:45:00Z',
    isRead: false
  },
  {
    id: '3',
    userId: '2',
    type: 'appointment',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Johnson has been confirmed for June 5th at 2:30 PM.',
    relatedId: '102', // appointment ID
    timestamp: '2023-06-02T15:00:00Z',
    isRead: true
  },
  {
    id: '4',
    userId: '2',
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from Dr. Johnson.',
    relatedId: '6', // message ID
    timestamp: '2023-06-02T14:25:00Z',
    isRead: false
  },
  {
    id: '5',
    userId: '1',
    type: 'system',
    title: 'Profile Update',
    message: 'Your profile has been successfully updated.',
    relatedId: null,
    timestamp: '2023-06-03T09:15:00Z',
    isRead: true
  }
];

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private/Admin
const getAllNotifications = asyncHandler(async (req, res) => {
  res.json(mockNotifications);
});

// @desc    Get notification by ID
// @route   GET /api/notifications/:id
// @access  Private
const getNotificationById = asyncHandler(async (req, res) => {
  const notification = mockNotifications.find(n => n.id === req.params.id);
  
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }
  
  res.json(notification);
});

// @desc    Get notifications for a user
// @route   GET /api/notifications/user/:userId
// @access  Private
const getNotificationsByUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const notifications = mockNotifications.filter(n => n.userId === userId);
  
  res.json(notifications);
});

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private
const createNotification = asyncHandler(async (req, res) => {
  const { userId, type, title, message, relatedId } = req.body;
  
  if (!userId || !type || !title || !message) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }
  
  const newNotification = {
    id: (mockNotifications.length + 1).toString(),
    userId,
    type,
    title,
    message,
    relatedId: relatedId || null,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  mockNotifications.push(newNotification);
  
  res.status(201).json(newNotification);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = mockNotifications.find(n => n.id === req.params.id);
  
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }
  
  notification.isRead = true;
  
  res.json(notification);
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const index = mockNotifications.findIndex(n => n.id === req.params.id);
  
  if (index === -1) {
    res.status(404);
    throw new Error('Notification not found');
  }
  
  mockNotifications.splice(index, 1);
  
  res.json({ message: 'Notification removed' });
});

module.exports = {
  getAllNotifications,
  getNotificationById,
  getNotificationsByUser,
  createNotification,
  markNotificationAsRead,
  deleteNotification
};
