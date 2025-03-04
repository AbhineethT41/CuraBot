/**
 * Symptom Model
 * Represents a medical symptom
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

class Symptom {
  /**
   * Get a symptom by ID
   * @param {string} id - Symptom UUID
   * @returns {Promise<Object>} Symptom object
   */
  static async getById(id) {
    const { data, error } = await supabase
      .from('symptoms')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Get all symptoms
   * @returns {Promise<Array>} Array of symptoms
   */
  static async getAll() {
    const { data, error } = await supabase
      .from('symptoms')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  /**
   * Create a new symptom
   * @param {Object} symptomData - Symptom data
   * @returns {Promise<Object>} Created symptom
   */
  static async create(symptomData) {
    const { data, error } = await supabase
      .from('symptoms')
      .insert([symptomData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Update a symptom
   * @param {string} id - Symptom UUID
   * @param {Object} symptomData - Symptom data to update
   * @returns {Promise<Object>} Updated symptom
   */
  static async update(id, symptomData) {
    const { data, error } = await supabase
      .from('symptoms')
      .update(symptomData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Delete a symptom
   * @param {string} id - Symptom UUID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const { error } = await supabase
      .from('symptoms')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  /**
   * Search symptoms by name or keywords
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching symptoms
   */
  static async search(query) {
    const { data, error } = await supabase
      .from('symptoms')
      .select('*')
      .or(`name.ilike.%${query}%,keywords.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name');
    
    if (error) throw error;
    return data;
  }

  /**
   * Get specialties related to a symptom
   * @param {string} id - Symptom UUID
   * @returns {Promise<Array>} Array of specialties with weights
   */
  static async getRelatedSpecialties(id) {
    const { data, error } = await supabase
      .from('symptom_specialty_mapping')
      .select(`
        weight,
        specialties:specialty_id (*)
      `)
      .eq('symptom_id', id)
      .order('weight', { ascending: false });
    
    if (error) throw error;
    
    // Extract the specialty objects and add weight
    return data.map(item => ({
      ...item.specialties,
      weight: item.weight
    }));
  }

  /**
   * Map a symptom to a specialty with a weight
   * @param {string} symptomId - Symptom UUID
   * @param {string} specialtyId - Specialty UUID
   * @param {number} weight - Weight of the mapping (1-10)
   * @returns {Promise<Object>} Created mapping
   */
  static async mapToSpecialty(symptomId, specialtyId, weight) {
    const mappingData = {
      symptom_id: symptomId,
      specialty_id: specialtyId,
      weight: weight
    };
    
    const { data, error } = await supabase
      .from('symptom_specialty_mapping')
      .insert([mappingData])
      .select();
    
    if (error) throw error;
    return data[0];
  }
}

module.exports = Symptom;
