/**
 * Webhook Controller
 * Handles Supabase webhook events
 */
const User = require('../models/User');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

/**
 * Process Supabase webhook events
 */
exports.processWebhook = async (req, res) => {
  try {
    // Verify webhook signature if needed
    // const signature = req.headers['x-supabase-signature'];
    
    const event = req.body;
    console.log('Received webhook event:', event.type);
    
    // Handle different event types
    switch (event.type) {
      case 'auth.signup':
        await handleUserSignup(event.data);
        break;
      
      case 'auth.login':
        await handleUserLogin(event.data);
        break;
        
      default:
        console.log('Unhandled webhook event type:', event.type);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: 'Webhook processing error', error: error.message });
  }
};

/**
 * Handle user signup event
 */
async function handleUserSignup(userData) {
  try {
    // Check if user already exists in our database
    const existingUser = await User.getByAuthId(userData.id);
    
    if (existingUser) {
      console.log(`User ${userData.id} already exists in database`);
      return;
    }
    
    // Create new user in our database
    const newUser = await User.create({
      auth_id: userData.id,
      email: userData.email,
      first_name: userData.user_metadata?.first_name || '',
      last_name: userData.user_metadata?.last_name || '',
      phone: userData.user_metadata?.phone || '',
      role: userData.user_metadata?.user_type || 'patient',
      created_at: new Date().toISOString()
    });
    
    console.log(`Created new user in database for ${userData.id}`);
    return newUser;
  } catch (error) {
    console.error('Error handling user signup:', error);
    throw error;
  }
}

/**
 * Handle user login event
 */
async function handleUserLogin(userData) {
  try {
    // Check if user exists in our database
    const existingUser = await User.getByAuthId(userData.id);
    
    if (!existingUser) {
      // Create user if they don't exist (might happen if webhook wasn't triggered on signup)
      return await handleUserSignup(userData);
    }
    
    // Update last login time
    await User.update(existingUser.id, {
      last_login: new Date().toISOString()
    });
    
    console.log(`Updated last login for user ${userData.id}`);
  } catch (error) {
    console.error('Error handling user login:', error);
    throw error;
  }
}
