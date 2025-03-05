/**
 * Auth Controller
 * Handles authentication-related routes and logic
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role = 'patient' } = req.body;
    
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: 'Email, password, first name, and last name are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          role
        }
      }
    });
    
    if (authError) {
      console.error('Auth error:', authError);
      return res.status(400).json({ error: authError.message });
    }
    
    // Create user in our database
    const userData = {
      auth_id: authData.user.id,
      email,
      first_name,
      last_name,
      role,
      created_at: new Date().toISOString()
    };
    
    const user = await User.create(userData);
    
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
};

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError) {
      console.error('Auth error:', authError);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Get user from our database
    const user = await User.getByAuthId(authData.user.id);
    
    if (!user) {
      // Create user if they don't exist in our database yet
      const userData = {
        auth_id: authData.user.id,
        email,
        first_name: authData.user.user_metadata.first_name || '',
        last_name: authData.user.user_metadata.last_name || '',
        role: authData.user.user_metadata.role || 'patient',
        created_at: new Date().toISOString()
      };
      
      const newUser = await User.create(userData);
      
      return res.status(200).json({
        message: 'Login successful',
        token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        user: {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          role: newUser.role
        }
      });
    }
    
    // Check if user is a doctor
    let doctorData = null;
    if (user.role === 'doctor') {
      doctorData = await Doctor.getByUserId(user.id);
    }
    
    return res.status(200).json({
      message: 'Login successful',
      token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        ...(doctorData && { doctor: doctorData })
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
};

/**
 * Logout user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Failed to logout' });
  }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCurrentUser = async (req, res) => {
  try {
    // User is attached to request by auth middleware
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Check if user is a doctor
    let doctorData = null;
    if (user.role === 'doctor') {
      doctorData = await Doctor.getByUserId(user.id);
    }
    
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        address: user.address,
        role: user.role,
        ...(doctorData && { doctor: doctorData })
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ error: 'Failed to get current user' });
  }
};

/**
 * Create or update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;
    
    // Update user in our database
    const updatedUser = await User.update(userId, {
      ...profileData,
      updated_at: new Date().toISOString()
    });
    
    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Create/update profile error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

/**
 * Create doctor profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const doctorData = req.body;
    
    if (!doctorData.specialty_id) {
      return res.status(400).json({ error: 'Specialty ID is required' });
    }
    
    // Update user role to doctor
    await User.update(userId, {
      role: 'doctor',
      updated_at: new Date().toISOString()
    });
    
    // Check if doctor profile already exists
    const existingDoctor = await Doctor.getByUserId(userId);
    
    let doctor;
    if (existingDoctor) {
      // Update existing doctor profile
      doctor = await Doctor.update(existingDoctor.id, {
        ...doctorData,
        updated_at: new Date().toISOString()
      });
    } else {
      // Create new doctor profile
      doctor = await Doctor.create({
        user_id: userId,
        ...doctorData,
        created_at: new Date().toISOString()
      });
    }
    
    return res.status(200).json({
      message: 'Doctor profile created/updated successfully',
      doctor
    });
  } catch (error) {
    console.error('Create doctor profile error:', error);
    return res.status(500).json({ error: 'Failed to create/update doctor profile' });
  }
};

/**
 * Refresh JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });
    
    if (error) {
      console.error('Refresh token error:', error);
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
    
    return res.status(200).json({
      token: data.session.access_token,
      refresh_token: data.session.refresh_token
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ error: 'Failed to refresh token' });
  }
};
