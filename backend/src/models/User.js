/**
 * User Model
 * Represents a user in the system (patient or doctor)
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

class User {
  /**
   * Get a user by ID
   * @param {string} id - User UUID
   * @returns {Promise<Object>} User object
   */
  static async getById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Get all users
   * @returns {Promise<Array>} Array of users
   */
  static async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  /**
   * Get a user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object
   */
  static async getByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw error;
    }
    return data || null;
  }

  /**
   * Get a user by Supabase Auth ID
   * @param {string} authId - Supabase Auth ID
   * @returns {Promise<Object>} User object
   */
  static async getByAuthId(authId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw error;
    }
    return data || null;
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  static async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Update a user
   * @param {string} id - User UUID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user
   */
  static async update(id, userData) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Update a user by auth ID
   * @param {string} authId - Supabase Auth ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user
   */
  static async updateByAuthId(authId, userData) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('auth_id', authId)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Create or update a user profile
   * @param {Object} userData - User data with auth_id
   * @returns {Promise<Object>} Created or updated user
   */
  static async createOrUpdate(userData) {
    if (!userData.auth_id) {
      throw new Error('auth_id is required for createOrUpdate');
    }

    const existingUser = await this.getByAuthId(userData.auth_id);
    
    if (existingUser) {
      return await this.updateByAuthId(userData.auth_id, {
        ...userData,
        updated_at: new Date().toISOString()
      });
    } else {
      return await this.create({
        ...userData,
        created_at: new Date().toISOString()
      });
    }
  }

  /**
   * Delete a user
   * @param {string} id - User UUID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  /**
   * Get all users with a specific role
   * @param {string} role - Role ('patient' or 'doctor')
   * @returns {Promise<Array>} Array of users
   */
  static async getByRole(role) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role);
    
    if (error) throw error;
    return data;
  }
}

module.exports = User;
