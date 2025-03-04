/**
 * Auth Middleware
 * Verifies Supabase JWT tokens and attaches user to request
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

/**
 * Verify JWT token from Supabase
 */
exports.verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Check if user has a specific role
 */
exports.hasRole = (role) => {
  return async (req, res, next) => {
    try {
      // Verify token first
      await exports.verifyToken(req, res, async () => {
        const { user } = req;
        
        // Check user role
        if (user.user_metadata?.user_type !== role) {
          return res.status(403).json({ message: `Access denied. Requires ${role} role.` });
        }
        
        next();
      });
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
};
