/**
 * Authentication Middleware
 * Validates JWT tokens and attaches user data to request
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

/**
 * Middleware to verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware to check if user has specific role
 * @param {string} role - Required role (e.g., 'doctor', 'patient')
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userRole = req.user.user_metadata?.user_type || req.user.user_metadata?.role;
    
    if (userRole !== role) {
      return res.status(403).json({ error: `Access denied. Requires ${role} role.` });
    }
    
    next();
  };
};

/**
 * Optional authentication middleware - doesn't require authentication
 * but attaches user to request if token is valid
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token, but that's ok - just continue
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (!error && user) {
      // Attach user to request
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Just continue without authentication
    next();
  }
};

module.exports = {
  authenticate,
  requireRole,
  optionalAuthenticate,
  supabase
};
