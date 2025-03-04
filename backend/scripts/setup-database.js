/**
 * Script to set up the database tables in Supabase
 * 
 * Usage:
 * 1. Make sure you have the SUPABASE_URL and SUPABASE_KEY in your .env file
 * 2. Run: node scripts/setup-database.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure SUPABASE_URL and SUPABASE_KEY are in your .env file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up database tables...');
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'create-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('Error executing SQL:', error);
      process.exit(1);
    }
    
    console.log('Database tables created successfully!');
    
    // Verify users table exists
    const { data, error: tableError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.error('Error verifying users table:', tableError);
    } else {
      console.log('Users table verified successfully.');
    }
    
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
