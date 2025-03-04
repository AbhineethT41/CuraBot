/**
 * Doctor Model
 * Represents a doctor in the system
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

class Doctor {
  /**
   * Get a doctor by ID
   * @param {string} id - Doctor UUID
   * @returns {Promise<Object>} Doctor object with user and specialty details
   */
  static async getById(id) {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        users:user_id (*),
        specialties:specialty_id (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Get a doctor by user ID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Doctor object
   */
  static async getByUserId(userId) {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        users:user_id (*),
        specialties:specialty_id (*)
      `)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Get all doctors
   * @returns {Promise<Array>} Array of doctors
   */
  static async getAll() {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        users:user_id (id, first_name, last_name, email, phone),
        specialties:specialty_id (id, name)
      `);
    
    if (error) throw error;
    return data;
  }

  /**
   * Get doctors by specialty
   * @param {string} specialtyId - Specialty UUID
   * @returns {Promise<Array>} Array of doctors
   */
  static async getBySpecialty(specialtyId) {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        users:user_id (id, first_name, last_name, email, phone),
        specialties:specialty_id (id, name)
      `)
      .eq('specialty_id', specialtyId);
    
    if (error) throw error;
    return data;
  }

  /**
   * Create a new doctor
   * @param {Object} doctorData - Doctor data
   * @returns {Promise<Object>} Created doctor
   */
  static async create(doctorData) {
    const { data, error } = await supabase
      .from('doctors')
      .insert([doctorData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Update a doctor
   * @param {string} id - Doctor UUID
   * @param {Object} doctorData - Doctor data to update
   * @returns {Promise<Object>} Updated doctor
   */
  static async update(id, doctorData) {
    const { data, error } = await supabase
      .from('doctors')
      .update(doctorData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Delete a doctor
   * @param {string} id - Doctor UUID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  /**
   * Search doctors by name or specialty
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching doctors
   */
  static async search(query) {
    // Get doctors whose name matches the query
    const { data: doctorsByName, error: nameError } = await supabase
      .from('doctors')
      .select(`
        *,
        users:user_id (id, first_name, last_name, email, phone),
        specialties:specialty_id (id, name)
      `)
      .or(`users.first_name.ilike.%${query}%,users.last_name.ilike.%${query}%`);
    
    if (nameError) throw nameError;
    
    // Get doctors whose specialty matches the query
    const { data: doctorsBySpecialty, error: specialtyError } = await supabase
      .from('doctors')
      .select(`
        *,
        users:user_id (id, first_name, last_name, email, phone),
        specialties:specialty_id (id, name)
      `)
      .ilike('specialties.name', `%${query}%`);
    
    if (specialtyError) throw specialtyError;
    
    // Combine results and remove duplicates
    const allDoctors = [...doctorsByName, ...doctorsBySpecialty];
    const uniqueDoctors = Array.from(new Map(allDoctors.map(doctor => [doctor.id, doctor])).values());
    
    return uniqueDoctors;
  }
}

module.exports = Doctor;
