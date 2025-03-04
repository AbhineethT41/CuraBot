/**
 * ChatMessage Model
 * Represents a message in a chat conversation
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

class ChatMessage {
  /**
   * Get a chat message by ID
   * @param {string} id - Message UUID
   * @returns {Promise<Object>} Message object
   */
  static async getById(id) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Get chat messages for a user
   * @param {string} userId - User UUID
   * @returns {Promise<Array>} Array of messages
   */
  static async getByUser(userId) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  /**
   * Get chat messages for a specific session
   * @param {string} sessionId - Session UUID
   * @returns {Promise<Array>} Array of messages
   */
  static async getBySession(sessionId) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  /**
   * Create a new chat message
   * @param {Object} messageData - Message data
   * @returns {Promise<Object>} Created message
   */
  static async create(messageData) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([messageData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Create multiple chat messages
   * @param {Array} messagesData - Array of message data objects
   * @returns {Promise<Array>} Created messages
   */
  static async createBatch(messagesData) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(messagesData)
      .select();
    
    if (error) throw error;
    return data;
  }

  /**
   * Delete a chat message
   * @param {string} id - Message UUID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  /**
   * Delete all messages in a session
   * @param {string} sessionId - Session UUID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteSession(sessionId) {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('session_id', sessionId);
    
    if (error) throw error;
    return true;
  }

  /**
   * Get recent chat sessions for a user
   * @param {string} userId - User UUID
   * @param {number} limit - Maximum number of sessions to return
   * @returns {Promise<Array>} Array of session IDs with their latest message
   */
  static async getRecentSessions(userId, limit = 10) {
    // This is a more complex query that requires a stored procedure in Supabase
    // For now, we'll use a simplified version that gets the latest message from each session
    const { data, error } = await supabase
      .rpc('get_recent_chat_sessions', {
        user_id_param: userId,
        limit_param: limit
      });
    
    if (error) throw error;
    return data;
  }
}

module.exports = ChatMessage;
