/**
 * Application Configuration
 * Loads environment variables and provides configuration values
 */
require('dotenv').config();

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Supabase configuration
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Groq AI configuration (if using)
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  
  // Webhook configuration
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
};
