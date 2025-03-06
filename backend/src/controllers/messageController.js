const asyncHandler = require('express-async-handler');

// Mock data for messages
const mockMessages = [
  {
    id: '1',
    conversationId: '1',
    senderId: '1', // patient
    receiverId: '101', // doctor
    content: 'Hello Dr. Smith, I have been experiencing severe headaches for the past week.',
    timestamp: '2023-06-01T10:30:00Z',
    isRead: true
  },
  {
    id: '2',
    conversationId: '1',
    senderId: '101', // doctor
    receiverId: '1', // patient
    content: 'I\'m sorry to hear that. Can you describe the pain? Is it constant or does it come and go?',
    timestamp: '2023-06-01T10:35:00Z',
    isRead: true
  },
  {
    id: '3',
    conversationId: '1',
    senderId: '1', // patient
    receiverId: '101', // doctor
    content: 'It comes and goes, but it\'s usually worse in the morning. It\'s a throbbing pain on the right side of my head.',
    timestamp: '2023-06-01T10:40:00Z',
    isRead: true
  },
  {
    id: '4',
    conversationId: '1',
    senderId: '101', // doctor
    receiverId: '1', // patient
    content: 'That sounds like it could be a migraine. Have you noticed any triggers like certain foods, stress, or lack of sleep?',
    timestamp: '2023-06-01T10:45:00Z',
    isRead: false
  },
  {
    id: '5',
    conversationId: '2',
    senderId: '2', // patient
    receiverId: '102', // doctor
    content: 'Dr. Johnson, I\'ve been having chest pain when I exercise.',
    timestamp: '2023-06-02T14:20:00Z',
    isRead: true
  },
  {
    id: '6',
    conversationId: '2',
    senderId: '102', // doctor
    receiverId: '2', // patient
    content: 'That\'s concerning. Is the pain sharp or dull? Does it radiate to your arm or jaw?',
    timestamp: '2023-06-02T14:25:00Z',
    isRead: false
  }
];

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
const getAllMessages = asyncHandler(async (req, res) => {
  res.json(mockMessages);
});

// @desc    Get message by ID
// @route   GET /api/messages/:id
// @access  Private
const getMessageById = asyncHandler(async (req, res) => {
  const message = mockMessages.find(m => m.id === req.params.id);
  
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }
  
  res.json(message);
});

// @desc    Get messages for a conversation
// @route   GET /api/messages/conversation/:conversationId
// @access  Private
const getMessagesByConversation = asyncHandler(async (req, res) => {
  const messages = mockMessages.filter(m => m.conversationId === req.params.conversationId);
  
  res.json(messages);
});

// @desc    Get messages for a user
// @route   GET /api/messages/user/:userId
// @access  Private
const getMessagesByUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const messages = mockMessages.filter(m => m.senderId === userId || m.receiverId === userId);
  
  res.json(messages);
});

// @desc    Create a new message
// @route   POST /api/messages
// @access  Private
const createMessage = asyncHandler(async (req, res) => {
  const { conversationId, senderId, receiverId, content } = req.body;
  
  if (!conversationId || !senderId || !receiverId || !content) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }
  
  const newMessage = {
    id: (mockMessages.length + 1).toString(),
    conversationId,
    senderId,
    receiverId,
    content,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  mockMessages.push(newMessage);
  
  res.status(201).json(newMessage);
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
const markMessageAsRead = asyncHandler(async (req, res) => {
  const message = mockMessages.find(m => m.id === req.params.id);
  
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }
  
  message.isRead = true;
  
  res.json(message);
});

module.exports = {
  getAllMessages,
  getMessageById,
  getMessagesByConversation,
  getMessagesByUser,
  createMessage,
  markMessageAsRead
};
