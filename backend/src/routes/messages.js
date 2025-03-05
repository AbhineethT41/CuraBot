/**
 * Message Routes
 * Handles routes for message-related operations
 */
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const messageController = require('../controllers/message');

/**
 * @route GET /api/messages/conversations
 * @desc Get conversations for the authenticated user
 * @access Private
 */
router.get('/conversations', authenticate, messageController.getConversations);

/**
 * @route GET /api/messages/conversations/:conversationId
 * @desc Get messages for a conversation
 * @access Private
 */
router.get('/conversations/:conversationId', authenticate, messageController.getMessages);

/**
 * @route POST /api/messages
 * @desc Send a message
 * @access Private
 */
router.post('/', authenticate, messageController.sendMessage);

/**
 * @route POST /api/messages/conversations
 * @desc Create a new conversation
 * @access Private
 */
router.post('/conversations', authenticate, messageController.createConversation);

/**
 * @route PUT /api/messages/conversations/:conversationId/read
 * @desc Mark messages as read
 * @access Private
 */
router.put('/conversations/:conversationId/read', authenticate, messageController.markAsRead);

/**
 * @route GET /api/messages/unread
 * @desc Get unread message count
 * @access Private
 */
router.get('/unread', authenticate, messageController.getUnreadCount);

module.exports = router;
