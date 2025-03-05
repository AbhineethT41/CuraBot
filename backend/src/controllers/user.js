/**
 * User Controller
 * Handles user-related routes and logic
 */
const User = require('../models/User');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

/**
 * Get all users (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    return res.status(500).json({ error: 'Failed to get users' });
  }
};

/**
 * Get a user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Check if the requesting user has permission (admin or the user themselves)
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ error: 'Not authorized to access this user profile' });
    }
    
    const user = await User.getById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return res.status(500).json({ error: 'Failed to get user' });
  }
};

/**
 * Update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Check if the requesting user has permission (admin or the user themselves)
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ error: 'Not authorized to update this user profile' });
    }
    
    // Don't allow role change unless admin
    if (userData.role && req.user.role !== 'admin') {
      delete userData.role;
    }
    
    const updatedUser = await User.update(id, {
      ...userData,
      updated_at: new Date().toISOString()
    });
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
};

/**
 * Delete a user (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const user = await User.getById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Delete user from Supabase Auth if we have their auth_id
    if (user.auth_id) {
      const { error: authError } = await supabase.auth.admin.deleteUser(user.auth_id);
      
      if (authError) {
        console.error('Error deleting user from auth:', authError);
        // Continue anyway to delete from our database
      }
    }
    
    // Delete user from our database
    await User.delete(id);
    
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};

/**
 * Get users by role (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    if (!role || !['admin', 'doctor', 'patient'].includes(role)) {
      return res.status(400).json({ error: 'Valid role is required (admin, doctor, patient)' });
    }
    
    const users = await User.getByRole(role);
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users by role:', error);
    return res.status(500).json({ error: 'Failed to get users by role' });
  }
};
