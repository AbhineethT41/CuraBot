/**
 * Webhook Routes
 * Routes for handling Supabase webhooks
 */
const express = require('express');
const webhookController = require('../controllers/webhookController');

const router = express.Router();

// Process Supabase webhook events
router.post('/supabase', webhookController.processWebhook);

module.exports = router;
