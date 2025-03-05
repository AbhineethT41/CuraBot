/**
 * Message Model
 * Represents a chat message between users
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

class Message {
  /**
   * Get a message by ID
   * @param {string} id - Message UUID
   * @returns {Promise<Object>} Message object
   */
  static async getById(id) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (id, first_name, last_name, email, role),
        recipient:recipient_id (id, first_name, last_name, email, role)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Get messages for a conversation
   * @param {string} conversationId - Conversation UUID
   * @returns {Promise<Array>} Array of messages
   */
  static async getByConversation(conversationId) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (id, first_name, last_name, email, role)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at');
    
    if (error) throw error;
    return data;
  }

  /**
   * Get conversations for a user
   * @param {string} userId - User UUID
   * @returns {Promise<Array>} Array of conversations
   */
  static async getConversationsForUser(userId) {
    // Get all conversations where the user is a participant
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select(`
        *,
        participants!conversation_participants (
          user_id,
          users:user_id (id, first_name, last_name, email, role)
        )
      `)
      .eq('participants.user_id', userId);
    
    if (conversationsError) throw conversationsError;
    
    // For each conversation, get the latest message
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const { data: lastMessage, error: messageError } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id (id, first_name, last_name, email, role)
          `)
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (messageError) throw messageError;
        
        // Filter out the current user from participants
        const otherParticipants = conversation.participants.filter(
          p => p.user_id !== userId
        );
        
        return {
          ...conversation,
          last_message: lastMessage[0] || null,
          participants: otherParticipants.map(p => p.users)
        };
      })
    );
    
    return conversationsWithLastMessage;
  }

  /**
   * Create a new message
   * @param {Object} messageData - Message data
   * @returns {Promise<Object>} Created message
   */
  static async create(messageData) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        ...messageData,
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    
    // Update the conversation's last_message_at
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', messageData.conversation_id);
    
    return data[0];
  }

  /**
   * Create a new conversation
   * @param {Array} participantIds - Array of user IDs
   * @param {string} title - Optional conversation title
   * @returns {Promise<Object>} Created conversation
   */
  static async createConversation(participantIds, title = null) {
    // Start a transaction
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert([{
        title,
        created_at: new Date().toISOString(),
        last_message_at: new Date().toISOString()
      }])
      .select();
    
    if (conversationError) throw conversationError;
    
    // Add participants
    const participantData = participantIds.map(userId => ({
      conversation_id: conversation[0].id,
      user_id: userId,
      joined_at: new Date().toISOString()
    }));
    
    const { error: participantError } = await supabase
      .from('conversation_participants')
      .insert(participantData);
    
    if (participantError) throw participantError;
    
    return conversation[0];
  }

  /**
   * Get or create a conversation between two users
   * @param {string} user1Id - First user ID
   * @param {string} user2Id - Second user ID
   * @returns {Promise<Object>} Conversation object
   */
  static async getOrCreateConversation(user1Id, user2Id) {
    // Check if a conversation already exists between these users
    const { data: existingConversations, error: queryError } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants (user_id)
      `)
      .eq('participants.user_id', user1Id);
    
    if (queryError) throw queryError;
    
    // Filter conversations to find one with exactly these two participants
    const conversation = existingConversations.find(conv => {
      const participantIds = conv.participants.map(p => p.user_id);
      return participantIds.includes(user2Id) && participantIds.length === 2;
    });
    
    if (conversation) {
      return conversation;
    }
    
    // Create a new conversation if none exists
    return await this.createConversation([user1Id, user2Id]);
  }

  /**
   * Mark messages as read
   * @param {string} conversationId - Conversation UUID
   * @param {string} userId - User ID marking messages as read
   * @returns {Promise<boolean>} Success status
   */
  static async markAsRead(conversationId, userId) {
    const { error } = await supabase
      .from('messages')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('recipient_id', userId)
      .eq('read', false);
    
    if (error) throw error;
    return true;
  }

  /**
   * Get unread message count for a user
   * @param {string} userId - User UUID
   * @returns {Promise<number>} Number of unread messages
   */
  static async getUnreadCount(userId) {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('read', false);
    
    if (error) throw error;
    return count;
  }
}

module.exports = Message;
