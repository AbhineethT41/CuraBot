/**
 * Configuration
 * Loads environment variables and exports configuration
 */
require('dotenv').config();

const config = {
  // Supabase configuration
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  
  // Server configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Groq AI configuration for chatbot
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

module.exports = config;
