/**
 * Auth Controller
 * Handles authentication-related operations
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const User = require('../models/User');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

/**
 * Get current user profile
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const { user } = req;
    
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Get user profile from database
    const userData = await User.getByAuthId(user.id);
    
    if (!userData) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Create or update user profile after registration
 */
exports.createUserProfile = async (req, res) => {
  try {
    const { user } = req;
    const userData = req.body;
    
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Create or update user profile
    const result = await User.createOrUpdate({
      ...userData,
      auth_id: user.id,
      email: user.email,
      last_login: new Date().toISOString()
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Create doctor profile for a user
 */
exports.createDoctorProfile = async (req, res) => {
  try {
    const { user } = req;
    const doctorData = req.body;
    
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Get user from database
    const userData = await User.getByAuthId(user.id);
    
    if (!userData) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    // Update user role
    await User.updateByAuthId(user.id, {
      role: 'doctor',
      updated_at: new Date().toISOString()
    });
    
    // Create doctor profile
    const Doctor = require('../models/Doctor');
    const result = await Doctor.create({
      ...doctorData,
      user_id: userData.id
    });
    
    // Update user type in auth metadata
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { user_type: 'doctor' }
    });
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating doctor profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
