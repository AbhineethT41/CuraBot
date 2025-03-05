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
    
    // Format the data for easier use with the chatbot
    return data.map(doctor => ({
      id: doctor.id,
      first_name: doctor.users.first_name,
      last_name: doctor.users.last_name,
      email: doctor.users.email,
      phone: doctor.users.phone,
      specialty: doctor.specialties.name,
      bio: doctor.bio,
      years_of_experience: doctor.years_of_experience,
      education: doctor.education,
      certifications: doctor.certifications,
      available_days: doctor.available_days,
      available_hours: doctor.available_hours
    }));
  }

  /**
   * Get doctors by specialty
   * @param {string} specialtyName - Specialty name (not ID)
   * @returns {Promise<Array>} Array of doctors
   */
  static async getBySpecialtyName(specialtyName) {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        users:user_id (id, first_name, last_name, email, phone),
        specialties:specialty_id (id, name)
      `)
      .ilike('specialties.name', `%${specialtyName}%`);
    
    if (error) throw error;
    
    // Format the data for easier use with the chatbot
    return data.map(doctor => ({
      id: doctor.id,
      first_name: doctor.users.first_name,
      last_name: doctor.users.last_name,
      email: doctor.users.email,
      phone: doctor.users.phone,
      specialty: doctor.specialties.name,
      bio: doctor.bio,
      years_of_experience: doctor.years_of_experience,
      education: doctor.education,
      certifications: doctor.certifications,
      available_days: doctor.available_days,
      available_hours: doctor.available_hours
    }));
  }

  /**
   * Get doctors by specialty ID
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
    
    // Format the data for easier use
    return data.map(doctor => ({
      id: doctor.id,
      first_name: doctor.users.first_name,
      last_name: doctor.users.last_name,
      email: doctor.users.email,
      phone: doctor.users.phone,
      specialty: doctor.specialties.name,
      bio: doctor.bio,
      years_of_experience: doctor.years_of_experience,
      education: doctor.education,
      certifications: doctor.certifications,
      available_days: doctor.available_days,
      available_hours: doctor.available_hours
    }));
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
   * Delete a doctor by user ID
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteByUserId(userId) {
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
    return true;
  }

  /**
   * Find doctors by symptoms
   * @param {Array} symptoms - Array of symptoms
   * @returns {Promise<Array>} Array of doctors
   */
  static async findBySymptoms(symptoms) {
    try {
      // This is a simplified implementation
      // In a real-world scenario, you would have a more sophisticated mapping
      // of symptoms to specialties, possibly using a medical knowledge base
      
      // Common symptom-to-specialty mappings
      const symptomSpecialtyMap = {
        // Cardiology
        'chest pain': 'Cardiology',
        'shortness of breath': 'Cardiology',
        'heart palpitations': 'Cardiology',
        'high blood pressure': 'Cardiology',
        
        // Dermatology
        'rash': 'Dermatology',
        'acne': 'Dermatology',
        'skin lesion': 'Dermatology',
        'itching': 'Dermatology',
        
        // Gastroenterology
        'abdominal pain': 'Gastroenterology',
        'nausea': 'Gastroenterology',
        'vomiting': 'Gastroenterology',
        'diarrhea': 'Gastroenterology',
        'constipation': 'Gastroenterology',
        
        // Neurology
        'headache': 'Neurology',
        'dizziness': 'Neurology',
        'seizure': 'Neurology',
        'tremor': 'Neurology',
        'memory loss': 'Neurology',
        
        // Orthopedics
        'joint pain': 'Orthopedics',
        'back pain': 'Orthopedics',
        'fracture': 'Orthopedics',
        'sprain': 'Orthopedics',
        
        // Psychiatry
        'depression': 'Psychiatry',
        'anxiety': 'Psychiatry',
        'insomnia': 'Psychiatry',
        'mood swings': 'Psychiatry',
        
        // ENT (Otolaryngology)
        'sore throat': 'ENT',
        'ear pain': 'ENT',
        'hearing loss': 'ENT',
        'sinus pain': 'ENT',
        
        // Ophthalmology
        'eye pain': 'Ophthalmology',
        'blurred vision': 'Ophthalmology',
        'red eye': 'Ophthalmology',
        
        // Pulmonology
        'cough': 'Pulmonology',
        'wheezing': 'Pulmonology',
        'shortness of breath': 'Pulmonology',
        
        // Urology
        'urinary frequency': 'Urology',
        'urinary incontinence': 'Urology',
        'blood in urine': 'Urology',
        
        // Endocrinology
        'fatigue': 'Endocrinology',
        'weight gain': 'Endocrinology',
        'weight loss': 'Endocrinology',
        'excessive thirst': 'Endocrinology',
        
        // General practice / Internal medicine (default)
        'fever': 'Internal Medicine',
        'fatigue': 'Internal Medicine',
        'pain': 'Internal Medicine'
      };
      
      // Map symptoms to specialties
      const specialties = new Set();
      
      symptoms.forEach(symptom => {
        // Check for exact matches
        const exactMatch = symptomSpecialtyMap[symptom.toLowerCase()];
        if (exactMatch) {
          specialties.add(exactMatch);
          return;
        }
        
        // Check for partial matches
        for (const [key, value] of Object.entries(symptomSpecialtyMap)) {
          if (symptom.toLowerCase().includes(key) || key.includes(symptom.toLowerCase())) {
            specialties.add(value);
          }
        }
      });
      
      // If no specialties found, default to Internal Medicine
      if (specialties.size === 0) {
        specialties.add('Internal Medicine');
      }
      
      // Get doctors for each specialty
      const doctorPromises = Array.from(specialties).map(specialty => 
        this.getBySpecialtyName(specialty)
      );
      
      const doctorsBySpecialty = await Promise.all(doctorPromises);
      
      // Flatten and remove duplicates
      const doctors = Array.from(
        new Map(
          doctorsBySpecialty.flat().map(doctor => [doctor.id, doctor])
        ).values()
      );
      
      return doctors;
    } catch (error) {
      console.error('Error finding doctors by symptoms:', error);
      return [];
    }
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
    
    // Format the data for easier use
    return uniqueDoctors.map(doctor => ({
      id: doctor.id,
      first_name: doctor.users.first_name,
      last_name: doctor.users.last_name,
      email: doctor.users.email,
      phone: doctor.users.phone,
      specialty: doctor.specialties.name,
      bio: doctor.bio,
      years_of_experience: doctor.years_of_experience,
      education: doctor.education,
      certifications: doctor.certifications,
      available_days: doctor.available_days,
      available_hours: doctor.available_hours
    }));
  }

  /**
   * Find doctors by symptoms using specialty mapping
   * @param {Array} symptoms - Array of symptoms
   * @returns {Promise<Array>} Array of recommended doctors
   */
  static async findBySymptomsOld(symptoms) {
    // Simple mapping of symptoms to specialties
    const symptomToSpecialty = {
      'headache': 'Neurology',
      'migraine': 'Neurology',
      'dizziness': 'Neurology',
      'chest pain': 'Cardiology',
      'heart palpitations': 'Cardiology',
      'shortness of breath': 'Pulmonology',
      'cough': 'Pulmonology',
      'stomach pain': 'Gastroenterology',
      'nausea': 'Gastroenterology',
      'joint pain': 'Orthopedics',
      'back pain': 'Orthopedics',
      'rash': 'Dermatology',
      'skin irritation': 'Dermatology',
      'fever': 'General Medicine',
      'sore throat': 'ENT',
      'ear pain': 'ENT',
      'vision problems': 'Ophthalmology',
      'eye pain': 'Ophthalmology',
      'anxiety': 'Psychiatry',
      'depression': 'Psychiatry',
    };
    
    // Count specialty matches
    const specialtyCounts = {};
    
    symptoms.forEach(symptom => {
      const normalizedSymptom = symptom.toLowerCase();
      
      // Check if we have a direct match for this symptom
      for (const [key, specialty] of Object.entries(symptomToSpecialty)) {
        if (normalizedSymptom.includes(key)) {
          specialtyCounts[specialty] = (specialtyCounts[specialty] || 0) + 1;
        }
      }
    });
    
    // Find the specialty with the highest count
    let maxCount = 0;
    let recommendedSpecialty = 'General Medicine';
    
    for (const [specialty, count] of Object.entries(specialtyCounts)) {
      if (count > maxCount) {
        maxCount = count;
        recommendedSpecialty = specialty;
      }
    }
    
    // Get doctors with the recommended specialty
    const doctors = await this.getBySpecialtyName(recommendedSpecialty);
    
    // Sort doctors by years of experience
    return doctors.sort((a, b) => 
      (b.years_of_experience || 0) - (a.years_of_experience || 0)
    );
  }
}

module.exports = Doctor;
