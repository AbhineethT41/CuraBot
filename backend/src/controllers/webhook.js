/**
 * Webhook Controller
 * Handles webhook events from Supabase and other services
 */
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const config = require('../config');
const crypto = require('crypto');

/**
 * Handle Supabase Auth webhook events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.handleSupabaseAuthEvent = async (req, res) => {
  try {
    // Verify webhook signature if a secret is set
    if (config.WEBHOOK_SECRET) {
      const signature = req.headers['x-supabase-signature'];
      if (!signature) {
        return res.status(401).json({ error: 'Missing signature' });
      }
      
      const hmac = crypto.createHmac('sha256', config.WEBHOOK_SECRET);
      hmac.update(JSON.stringify(req.body));
      const computedSignature = hmac.digest('hex');
      
      if (signature !== computedSignature) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const { type, record } = req.body;
    
    if (!type || !record) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }
    
    // Handle different event types
    switch (type) {
      case 'INSERT': 
        // New user created
        await handleUserCreated(record);
        break;
      case 'UPDATE':
        // User updated
        await handleUserUpdated(record);
        break;
      case 'DELETE':
        // User deleted
        await handleUserDeleted(record);
        break;
      default:
        console.log(`Unhandled webhook event type: ${type}`);
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({ error: 'Failed to process webhook' });
  }
};

/**
 * Handle user created event
 * @param {Object} user - User record from Supabase Auth
 */
async function handleUserCreated(user) {
  try {
    // Check if user already exists in our database
    const existingUser = await User.getByAuthId(user.id);
    
    if (!existingUser) {
      // Create new user record in our database
      const userData = {
        auth_id: user.id,
        email: user.email,
        role: user.user_metadata?.user_type || 'patient', // Default to patient
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        created_at: new Date().toISOString()
      };
      
      await User.create(userData);
      
      // If user is a doctor, create doctor profile
      if (userData.role === 'doctor') {
        await Doctor.create({
          user_id: userData.id,
          specialties: user.user_metadata?.specialties || [],
          education: user.user_metadata?.education || [],
          experience: user.user_metadata?.experience || [],
          created_at: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.error('Error handling user created webhook:', error);
  }
}

/**
 * Handle user updated event
 * @param {Object} user - User record from Supabase Auth
 */
async function handleUserUpdated(user) {
  try {
    // Update user in our database
    const existingUser = await User.getByAuthId(user.id);
    
    if (existingUser) {
      const userData = {
        email: user.email,
        role: user.user_metadata?.user_type || existingUser.role,
        first_name: user.user_metadata?.first_name || existingUser.first_name,
        last_name: user.user_metadata?.last_name || existingUser.last_name,
        updated_at: new Date().toISOString()
      };
      
      await User.updateByAuthId(user.id, userData);
      
      // Handle role changes (e.g., patient to doctor)
      if (userData.role === 'doctor' && existingUser.role !== 'doctor') {
        // Check if doctor profile exists
        const doctorProfile = await Doctor.getByUserId(existingUser.id);
        
        if (!doctorProfile) {
          // Create doctor profile
          await Doctor.create({
            user_id: existingUser.id,
            specialties: user.user_metadata?.specialties || [],
            education: user.user_metadata?.education || [],
            experience: user.user_metadata?.experience || [],
            created_at: new Date().toISOString()
          });
        }
      }
    }
  } catch (error) {
    console.error('Error handling user updated webhook:', error);
  }
}

/**
 * Handle user deleted event
 * @param {Object} user - User record from Supabase Auth
 */
async function handleUserDeleted(user) {
  try {
    // Delete user from our database
    const existingUser = await User.getByAuthId(user.id);
    
    if (existingUser) {
      // If user is a doctor, delete doctor profile
      if (existingUser.role === 'doctor') {
        await Doctor.deleteByUserId(existingUser.id);
      }
      
      // Delete user
      await User.delete(existingUser.id);
    }
  } catch (error) {
    console.error('Error handling user deleted webhook:', error);
  }
}
