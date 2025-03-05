/**
 * Specialty Controller
 * Handles specialty-related routes and logic
 */
const Specialty = require('../models/Specialty');

/**
 * Get all specialties
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.getAll();
    return res.status(200).json(specialties);
  } catch (error) {
    console.error('Error getting all specialties:', error);
    return res.status(500).json({ error: 'Failed to get specialties' });
  }
};

/**
 * Get a specialty by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSpecialtyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Specialty ID is required' });
    }
    
    const specialty = await Specialty.getById(id);
    
    if (!specialty) {
      return res.status(404).json({ error: 'Specialty not found' });
    }
    
    return res.status(200).json(specialty);
  } catch (error) {
    console.error('Error getting specialty by ID:', error);
    return res.status(500).json({ error: 'Failed to get specialty' });
  }
};

/**
 * Create a new specialty (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createSpecialty = async (req, res) => {
  try {
    const specialtyData = req.body;
    
    if (!specialtyData.name) {
      return res.status(400).json({ error: 'Specialty name is required' });
    }
    
    const specialty = await Specialty.create({
      ...specialtyData,
      created_at: new Date().toISOString()
    });
    
    return res.status(201).json(specialty);
  } catch (error) {
    console.error('Error creating specialty:', error);
    return res.status(500).json({ error: 'Failed to create specialty' });
  }
};

/**
 * Update a specialty (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateSpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    const specialtyData = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Specialty ID is required' });
    }
    
    const specialty = await Specialty.getById(id);
    
    if (!specialty) {
      return res.status(404).json({ error: 'Specialty not found' });
    }
    
    const updatedSpecialty = await Specialty.update(id, {
      ...specialtyData,
      updated_at: new Date().toISOString()
    });
    
    return res.status(200).json(updatedSpecialty);
  } catch (error) {
    console.error('Error updating specialty:', error);
    return res.status(500).json({ error: 'Failed to update specialty' });
  }
};

/**
 * Delete a specialty (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteSpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Specialty ID is required' });
    }
    
    const specialty = await Specialty.getById(id);
    
    if (!specialty) {
      return res.status(404).json({ error: 'Specialty not found' });
    }
    
    await Specialty.delete(id);
    
    return res.status(200).json({ message: 'Specialty deleted successfully' });
  } catch (error) {
    console.error('Error deleting specialty:', error);
    return res.status(500).json({ error: 'Failed to delete specialty' });
  }
};

/**
 * Get specialties related to a symptom
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSpecialtiesBySymptom = async (req, res) => {
  try {
    const { symptomId } = req.params;
    
    if (!symptomId) {
      return res.status(400).json({ error: 'Symptom ID is required' });
    }
    
    const specialties = await Specialty.getBySymptom(symptomId);
    
    return res.status(200).json(specialties);
  } catch (error) {
    console.error('Error getting specialties by symptom:', error);
    return res.status(500).json({ error: 'Failed to get specialties' });
  }
};
