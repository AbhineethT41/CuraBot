/**
 * Chatbot Routes
 * Handles routes for chatbot functionality
 */
const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot');
const { authenticate } = require('../middleware/auth');

/**
 * @route POST /api/chatbot/message
 * @desc Process a message from the user
 * @access Public
 */
router.post('/message', chatbotController.processMessage);

/**
 * @route POST /api/chatbot/analyze-symptoms
 * @desc Analyze symptoms and recommend doctors
 * @access Public
 */
router.post('/analyze-symptoms', chatbotController.analyzeSymptoms);

/**
 * @route POST /api/chatbot/doctor-recommendations
 * @desc Get doctor recommendations based on a conversation
 * @access Public
 */
router.post('/doctor-recommendations', chatbotController.getDoctorRecommendations);

module.exports = router;
