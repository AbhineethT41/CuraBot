/**
 * Specialty Model
 * Represents a medical specialty
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

class Specialty {
  /**
   * Get a specialty by ID
   * @param {string} id - Specialty UUID
   * @returns {Promise<Object>} Specialty object
   */
  static async getById(id) {
    const { data, error } = await supabase
      .from('specialties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Get all specialties
   * @returns {Promise<Array>} Array of specialties
   */
  static async getAll() {
    const { data, error } = await supabase
      .from('specialties')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  /**
   * Create a new specialty
   * @param {Object} specialtyData - Specialty data
   * @returns {Promise<Object>} Created specialty
   */
  static async create(specialtyData) {
    const { data, error } = await supabase
      .from('specialties')
      .insert([specialtyData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Update a specialty
   * @param {string} id - Specialty UUID
   * @param {Object} specialtyData - Specialty data to update
   * @returns {Promise<Object>} Updated specialty
   */
  static async update(id, specialtyData) {
    const { data, error } = await supabase
      .from('specialties')
      .update(specialtyData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Delete a specialty
   * @param {string} id - Specialty UUID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const { error } = await supabase
      .from('specialties')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  /**
   * Get specialties related to a symptom
   * @param {string} symptomId - Symptom UUID
   * @returns {Promise<Array>} Array of specialties
   */
  static async getBySymptom(symptomId) {
    const { data, error } = await supabase
      .from('symptom_specialty_mapping')
      .select(`
        weight,
        specialties:specialty_id (*)
      `)
      .eq('symptom_id', symptomId)
      .order('weight', { ascending: false });
    
    if (error) throw error;
    
    // Extract the specialty objects and add weight
    return data.map(item => ({
      ...item.specialties,
      weight: item.weight
    }));
  }
}

module.exports = Specialty;
