/**
 * Webhook Routes
 * Handles webhook events from Supabase and other services
 */
const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook');

/**
 * @route POST /api/webhooks/auth
 * @desc Handle Supabase Auth webhook events
 * @access Public
 */
router.post('/auth', webhookController.handleSupabaseAuthEvent);

module.exports = router;
