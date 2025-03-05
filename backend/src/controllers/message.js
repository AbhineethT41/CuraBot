/**
 * Message Controller
 * Handles message-related routes and logic
 */
const Message = require('../models/Message');
const User = require('../models/User');
const notificationService = require('../services/notificationService');

/**
 * Get conversations for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const conversations = await Message.getConversationsForUser(userId);
    
    return res.status(200).json(conversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    return res.status(500).json({ error: 'Failed to get conversations' });
  }
};

/**
 * Get messages for a conversation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }
    
    // Mark messages as read
    await Message.markAsRead(conversationId, userId);
    
    // Get messages
    const messages = await Message.getByConversation(conversationId);
    
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    return res.status(500).json({ error: 'Failed to get messages' });
  }
};

/**
 * Send a message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, recipientId, content } = req.body;
    const senderId = req.user.id;
    
    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }
    
    let targetConversationId = conversationId;
    
    // If no conversation ID but recipient ID is provided, get or create conversation
    if (!targetConversationId && recipientId) {
      const conversation = await Message.getOrCreateConversation(senderId, recipientId);
      targetConversationId = conversation.id;
    }
    
    if (!targetConversationId) {
      return res.status(400).json({ error: 'Either conversation ID or recipient ID is required' });
    }
    
    // Create the message
    const message = await Message.create({
      conversation_id: targetConversationId,
      sender_id: senderId,
      recipient_id: recipientId,
      content,
      read: false
    });
    
    // Send notification to recipient
    if (recipientId) {
      await notificationService.sendMessageNotification(
        senderId,
        recipientId,
        content,
        targetConversationId
      );
    }
    
    return res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};

/**
 * Create a new conversation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createConversation = async (req, res) => {
  try {
    const { participantIds, title } = req.body;
    const userId = req.user.id;
    
    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return res.status(400).json({ error: 'Valid participant IDs array is required' });
    }
    
    // Ensure the current user is included in participants
    if (!participantIds.includes(userId)) {
      participantIds.push(userId);
    }
    
    // Create the conversation
    const conversation = await Message.createConversation(participantIds, title);
    
    return res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return res.status(500).json({ error: 'Failed to create conversation' });
  }
};

/**
 * Mark messages as read
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }
    
    await Message.markAsRead(conversationId, userId);
    
    return res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};

/**
 * Get unread message count
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await Message.getUnreadCount(userId);
    
    return res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    return res.status(500).json({ error: 'Failed to get unread count' });
  }
};
