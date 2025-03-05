/**
 * Appointment Model
 * Represents an appointment between a patient and a doctor
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

class Appointment {
  /**
   * Get an appointment by ID
   * @param {string} id - Appointment UUID
   * @returns {Promise<Object>} Appointment object with patient and doctor details
   */
  static async getById(id) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients:patient_id (id, first_name, last_name, email, phone),
        doctors:doctor_id (
          id, 
          image, 
          location,
          users:user_id (id, first_name, last_name, email, phone),
          specialties:specialty_id (id, name)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Get all appointments (admin only)
   * @returns {Promise<Array>} Array of all appointments
   */
  static async getAll() {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients:patient_id (id, first_name, last_name, email, phone),
        doctors:doctor_id (
          id, 
          image, 
          location,
          users:user_id (id, first_name, last_name, email, phone),
          specialties:specialty_id (id, name)
        )
      `)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  /**
   * Get appointments for a patient
   * @param {string} patientId - Patient UUID
   * @returns {Promise<Array>} Array of appointments
   */
  static async getByPatient(patientId) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctors:doctor_id (
          id, 
          image, 
          location,
          users:user_id (id, first_name, last_name, email, phone),
          specialties:specialty_id (id, name)
        )
      `)
      .eq('patient_id', patientId)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  /**
   * Get appointments for a doctor
   * @param {string} doctorId - Doctor UUID
   * @returns {Promise<Array>} Array of appointments
   */
  static async getByDoctor(doctorId) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients:patient_id (id, first_name, last_name, email, phone)
      `)
      .eq('doctor_id', doctorId)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  /**
   * Create a new appointment
   * @param {Object} appointmentData - Appointment data
   * @returns {Promise<Object>} Created appointment
   */
  static async create(appointmentData) {
    // Start a transaction
    const { data, error } = await supabase.rpc('create_appointment', {
      appointment_data: appointmentData
    });
    
    if (error) throw error;
    return data;
  }

  /**
   * Update an appointment
   * @param {string} id - Appointment UUID
   * @param {Object} appointmentData - Appointment data to update
   * @returns {Promise<Object>} Updated appointment
   */
  static async update(id, appointmentData) {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointmentData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Delete an appointment
   * @param {string} id - Appointment UUID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    // Get the appointment first to get doctor_id, date, and time
    const { data: appointment, error: getError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (getError) throw getError;
    
    // Delete the appointment
    const { error: deleteError } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (deleteError) throw deleteError;
    
    // If the appointment was confirmed, make the slot available again
    if (appointment.status === 'confirmed') {
      const { error: slotError } = await supabase
        .from('available_slots')
        .update({ is_available: true })
        .eq('doctor_id', appointment.doctor_id)
        .eq('date', appointment.date)
        .eq('start_time', appointment.time);
      
      if (slotError) throw slotError;
    }
    
    return true;
  }

  /**
   * Cancel an appointment
   * @param {string} id - Appointment UUID
   * @returns {Promise<Object>} Cancelled appointment
   */
  static async cancel(id) {
    // Update appointment status to cancelled
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();
    
    if (appointmentError) throw appointmentError;
    
    // Get the corresponding slot and make it available again
    const { error: slotError } = await supabase
      .from('available_slots')
      .update({ is_available: true })
      .eq('doctor_id', appointment.doctor_id)
      .eq('date', appointment.date)
      .eq('start_time', appointment.time);
    
    if (slotError) throw slotError;
    
    return appointment;
  }

  /**
   * Get appointments by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Array>} Array of appointments
   */
  static async getByDateRange(startDate, endDate) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients:patient_id (id, first_name, last_name, email, phone),
        doctors:doctor_id (
          id, 
          image, 
          location,
          users:user_id (id, first_name, last_name, email, phone),
          specialties:specialty_id (id, name)
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  /**
   * Check if a slot is available for a doctor
   * @param {string} doctorId - Doctor UUID
   * @param {string} date - Date (YYYY-MM-DD)
   * @param {string} time - Time (HH:MM)
   * @param {string} excludeAppointmentId - Optional appointment ID to exclude from check
   * @returns {Promise<boolean>} Whether the slot is available
   */
  static async isSlotAvailable(doctorId, date, time, excludeAppointmentId = null) {
    // Check if there's already an appointment at this time
    let query = supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctorId)
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled');
    
    // Exclude the current appointment if updating
    if (excludeAppointmentId) {
      query = query.neq('id', excludeAppointmentId);
    }
    
    const { data: existingAppointments, error: appointmentError } = await query;
    
    if (appointmentError) throw appointmentError;
    
    // If there's already an appointment, the slot is not available
    if (existingAppointments.length > 0) {
      return false;
    }
    
    // Check if the doctor has this slot available
    const { data: availableSlots, error: slotError } = await supabase
      .from('available_slots')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('date', date)
      .eq('start_time', time)
      .eq('is_available', true);
    
    if (slotError) throw slotError;
    
    // If there's an available slot, return true
    return availableSlots.length > 0;
  }

  /**
   * Get available slots for a doctor on a specific date
   * @param {string} doctorId - Doctor UUID
   * @param {string} date - Date (YYYY-MM-DD)
   * @returns {Promise<Array>} Array of available time slots
   */
  static async getAvailableSlots(doctorId, date) {
    // Get all slots for the doctor on this date
    const { data: allSlots, error: slotError } = await supabase
      .from('available_slots')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('date', date)
      .eq('is_available', true)
      .order('start_time');
    
    if (slotError) throw slotError;
    
    // Get existing appointments for this doctor on this date
    const { data: existingAppointments, error: appointmentError } = await supabase
      .from('appointments')
      .select('time')
      .eq('doctor_id', doctorId)
      .eq('date', date)
      .neq('status', 'cancelled');
    
    if (appointmentError) throw appointmentError;
    
    // Convert existing appointments to a set of times
    const bookedTimes = new Set(existingAppointments.map(a => a.time));
    
    // Filter out slots that already have appointments
    const availableSlots = allSlots.filter(slot => !bookedTimes.has(slot.start_time));
    
    return availableSlots.map(slot => ({
      time: slot.start_time,
      end_time: slot.end_time,
      duration: slot.duration
    }));
  }
}

module.exports = Appointment;
