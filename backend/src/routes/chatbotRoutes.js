const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Analyze symptoms and recommend specialists
router.post('/analyze', chatbotController.analyzeSymptoms);

// Get follow-up questions for symptoms
router.post('/follow-up', chatbotController.getFollowUpQuestions);

// Get doctor recommendations based on symptoms
router.post('/recommend-doctors', chatbotController.recommendDoctors);

module.exports = router;
