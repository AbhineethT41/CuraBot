/**
 * AvailableSlot Model
 * Represents an available time slot for a doctor
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

class AvailableSlot {
  /**
   * Get an available slot by ID
   * @param {string} id - Slot UUID
   * @returns {Promise<Object>} Slot object
   */
  static async getById(id) {
    const { data, error } = await supabase
      .from('available_slots')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Get available slots for a doctor
   * @param {string} doctorId - Doctor UUID
   * @param {boolean} availableOnly - If true, only return available slots
   * @returns {Promise<Array>} Array of slots
   */
  static async getByDoctor(doctorId, availableOnly = true) {
    let query = supabase
      .from('available_slots')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });
    
    if (availableOnly) {
      query = query.eq('is_available', true);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  /**
   * Get available slots for a doctor on a specific date
   * @param {string} doctorId - Doctor UUID
   * @param {string} date - Date (YYYY-MM-DD)
   * @param {boolean} availableOnly - If true, only return available slots
   * @returns {Promise<Array>} Array of slots
   */
  static async getByDoctorAndDate(doctorId, date, availableOnly = true) {
    let query = supabase
      .from('available_slots')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('date', date)
      .order('start_time', { ascending: true });
    
    if (availableOnly) {
      query = query.eq('is_available', true);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  /**
   * Create a new available slot
   * @param {Object} slotData - Slot data
   * @returns {Promise<Object>} Created slot
   */
  static async create(slotData) {
    const { data, error } = await supabase
      .from('available_slots')
      .insert([slotData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Create multiple available slots
   * @param {Array} slotsData - Array of slot data objects
   * @returns {Promise<Array>} Created slots
   */
  static async createBatch(slotsData) {
    const { data, error } = await supabase
      .from('available_slots')
      .insert(slotsData)
      .select();
    
    if (error) throw error;
    return data;
  }

  /**
   * Update an available slot
   * @param {string} id - Slot UUID
   * @param {Object} slotData - Slot data to update
   * @returns {Promise<Object>} Updated slot
   */
  static async update(id, slotData) {
    const { data, error } = await supabase
      .from('available_slots')
      .update(slotData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Delete an available slot
   * @param {string} id - Slot UUID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const { error } = await supabase
      .from('available_slots')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  /**
   * Get available slots for a date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @param {boolean} availableOnly - If true, only return available slots
   * @returns {Promise<Array>} Array of slots
   */
  static async getByDateRange(startDate, endDate, availableOnly = true) {
    let query = supabase
      .from('available_slots')
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
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });
    
    if (availableOnly) {
      query = query.eq('is_available', true);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
}

module.exports = AvailableSlot;
