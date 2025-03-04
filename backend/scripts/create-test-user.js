/**
 * Script to create a test user in the database
 * 
 * Usage:
 * 1. Make sure you have the SUPABASE_URL and SUPABASE_KEY in your .env file
 * 2. Run: node scripts/create-test-user.js
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const User = require('../src/models/User');

// Get Supabase credentials from environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure SUPABASE_URL and SUPABASE_KEY are in your .env file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Replace with the auth ID from your Supabase user
const AUTH_ID = '96b26a41-cc33-4d3b-99d5-046d5b6476aa'; // Replace with your auth ID

async function createTestUser() {
  try {
    console.log('Fetching user from Supabase Auth...');
    
    // Get user from Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(AUTH_ID);
    
    if (authError) {
      console.error('Error fetching user from Supabase Auth:', authError);
      process.exit(1);
    }
    
    if (!authUser || !authUser.user) {
      console.error('User not found in Supabase Auth');
      process.exit(1);
    }
    
    console.log('User found in Supabase Auth:', authUser.user.email);
    
    // Check if user already exists in database
    const existingUser = await User.getByAuthId(AUTH_ID);
    
    if (existingUser) {
      console.log('User already exists in database:', existingUser);
      
      // Update user if needed
      const updatedUser = await User.update(existingUser.id, {
        first_name: authUser.user.user_metadata?.first_name || '',
        last_name: authUser.user.user_metadata?.last_name || '',
        phone: authUser.user.user_metadata?.phone || '',
        role: authUser.user.user_metadata?.user_type || 'patient',
        last_login: new Date().toISOString()
      });
      
      console.log('User updated in database:', updatedUser);
    } else {
      // Create new user in database
      const newUser = await User.create({
        auth_id: AUTH_ID,
        email: authUser.user.email,
        first_name: authUser.user.user_metadata?.first_name || '',
        last_name: authUser.user.user_metadata?.last_name || '',
        phone: authUser.user.user_metadata?.phone || '',
        role: authUser.user.user_metadata?.user_type || 'patient',
        created_at: new Date().toISOString()
      });
      
      console.log('User created in database:', newUser);
    }
    
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
