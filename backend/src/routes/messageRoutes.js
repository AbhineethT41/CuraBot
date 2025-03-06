const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Get all messages
router.get('/', messageController.getAllMessages);

// Get message by ID
router.get('/:id', messageController.getMessageById);

// Get messages for a conversation
router.get('/conversation/:conversationId', messageController.getMessagesByConversation);

// Get messages for a user
router.get('/user/:userId', messageController.getMessagesByUser);

// Create a new message
router.post('/', messageController.createMessage);

// Mark message as read
router.put('/:id/read', messageController.markMessageAsRead);

module.exports = router;
