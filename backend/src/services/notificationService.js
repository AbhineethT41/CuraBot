/**
 * Notification Service
 * Handles sending notifications to users via email, SMS, or in-app
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

class NotificationService {
  /**
   * Create a new notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} Created notification
   */
  async createNotification(notificationData) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...notificationData,
          created_at: new Date().toISOString(),
          read: false
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Get notifications for a user
   * @param {string} userId - User UUID
   * @param {boolean} unreadOnly - Whether to get only unread notifications
   * @returns {Promise<Array>} Array of notifications
   */
  async getUserNotifications(userId, unreadOnly = false) {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (unreadOnly) {
        query = query.eq('read', false);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   * @param {string} notificationId - Notification UUID
   * @returns {Promise<Object>} Updated notification
   */
  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications for a user as read
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} Success status
   */
  async markAllAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('read', false);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   * @param {string} notificationId - Notification UUID
   * @returns {Promise<boolean>} Success status
   */
  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Send an appointment reminder notification
   * @param {Object} appointment - Appointment object
   * @returns {Promise<Object>} Created notification
   */
  async sendAppointmentReminder(appointment) {
    try {
      const { patient_id, doctor_id, date, time, id: appointment_id } = appointment;
      
      // Create notification for patient
      const patientNotification = await this.createNotification({
        user_id: patient_id,
        type: 'appointment_reminder',
        title: 'Upcoming Appointment Reminder',
        message: `You have an appointment scheduled on ${date} at ${time}`,
        data: { appointment_id },
        priority: 'high'
      });
      
      return patientNotification;
    } catch (error) {
      console.error('Error sending appointment reminder:', error);
      throw error;
    }
  }

  /**
   * Send a new appointment notification to a doctor
   * @param {Object} appointment - Appointment object
   * @returns {Promise<Object>} Created notification
   */
  async sendNewAppointmentNotification(appointment) {
    try {
      const { patient_id, doctor_id, date, time, id: appointment_id } = appointment;
      
      // Create notification for doctor
      const doctorNotification = await this.createNotification({
        user_id: doctor_id,
        type: 'new_appointment',
        title: 'New Appointment Scheduled',
        message: `A new appointment has been scheduled on ${date} at ${time}`,
        data: { appointment_id },
        priority: 'medium'
      });
      
      return doctorNotification;
    } catch (error) {
      console.error('Error sending new appointment notification:', error);
      throw error;
    }
  }

  /**
   * Send an appointment cancellation notification
   * @param {Object} appointment - Appointment object
   * @param {string} cancelledBy - User ID of who cancelled the appointment
   * @returns {Promise<Object>} Created notification
   */
  async sendCancellationNotification(appointment, cancelledBy) {
    try {
      const { patient_id, doctor_id, date, time, id: appointment_id } = appointment;
      
      // Determine who to notify (the other party)
      const recipientId = cancelledBy === patient_id ? doctor_id : patient_id;
      const canceller = cancelledBy === patient_id ? 'patient' : 'doctor';
      
      // Create notification
      const notification = await this.createNotification({
        user_id: recipientId,
        type: 'appointment_cancelled',
        title: 'Appointment Cancelled',
        message: `The appointment scheduled on ${date} at ${time} has been cancelled by the ${canceller}`,
        data: { appointment_id },
        priority: 'high'
      });
      
      return notification;
    } catch (error) {
      console.error('Error sending cancellation notification:', error);
      throw error;
    }
  }

  /**
   * Send a message notification
   * @param {string} senderId - User ID of sender
   * @param {string} recipientId - User ID of recipient
   * @param {string} messageContent - Message content
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Created notification
   */
  async sendMessageNotification(senderId, recipientId, messageContent, conversationId) {
    try {
      // Create notification
      const notification = await this.createNotification({
        user_id: recipientId,
        type: 'new_message',
        title: 'New Message',
        message: messageContent.length > 50 ? `${messageContent.substring(0, 50)}...` : messageContent,
        data: { conversation_id: conversationId, sender_id: senderId },
        priority: 'medium'
      });
      
      return notification;
    } catch (error) {
      console.error('Error sending message notification:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();
