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
}

module.exports = Appointment;
