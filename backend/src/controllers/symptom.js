/**
 * Symptom Controller
 * Handles symptom-related routes and logic
 */
const Symptom = require('../models/Symptom');

/**
 * Get all symptoms
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptom.getAll();
    return res.status(200).json(symptoms);
  } catch (error) {
    console.error('Error getting all symptoms:', error);
    return res.status(500).json({ error: 'Failed to get symptoms' });
  }
};

/**
 * Get a symptom by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSymptomById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Symptom ID is required' });
    }
    
    const symptom = await Symptom.getById(id);
    
    if (!symptom) {
      return res.status(404).json({ error: 'Symptom not found' });
    }
    
    return res.status(200).json(symptom);
  } catch (error) {
    console.error('Error getting symptom by ID:', error);
    return res.status(500).json({ error: 'Failed to get symptom' });
  }
};

/**
 * Create a new symptom (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createSymptom = async (req, res) => {
  try {
    const symptomData = req.body;
    
    if (!symptomData.name) {
      return res.status(400).json({ error: 'Symptom name is required' });
    }
    
    const symptom = await Symptom.create({
      ...symptomData,
      created_at: new Date().toISOString()
    });
    
    return res.status(201).json(symptom);
  } catch (error) {
    console.error('Error creating symptom:', error);
    return res.status(500).json({ error: 'Failed to create symptom' });
  }
};

/**
 * Update a symptom (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateSymptom = async (req, res) => {
  try {
    const { id } = req.params;
    const symptomData = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Symptom ID is required' });
    }
    
    const symptom = await Symptom.getById(id);
    
    if (!symptom) {
      return res.status(404).json({ error: 'Symptom not found' });
    }
    
    const updatedSymptom = await Symptom.update(id, {
      ...symptomData,
      updated_at: new Date().toISOString()
    });
    
    return res.status(200).json(updatedSymptom);
  } catch (error) {
    console.error('Error updating symptom:', error);
    return res.status(500).json({ error: 'Failed to update symptom' });
  }
};

/**
 * Delete a symptom (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteSymptom = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Symptom ID is required' });
    }
    
    const symptom = await Symptom.getById(id);
    
    if (!symptom) {
      return res.status(404).json({ error: 'Symptom not found' });
    }
    
    await Symptom.delete(id);
    
    return res.status(200).json({ message: 'Symptom deleted successfully' });
  } catch (error) {
    console.error('Error deleting symptom:', error);
    return res.status(500).json({ error: 'Failed to delete symptom' });
  }
};

/**
 * Search symptoms by name or keywords
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.searchSymptoms = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const symptoms = await Symptom.search(query);
    
    return res.status(200).json(symptoms);
  } catch (error) {
    console.error('Error searching symptoms:', error);
    return res.status(500).json({ error: 'Failed to search symptoms' });
  }
};

/**
 * Get specialties related to a symptom
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRelatedSpecialties = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Symptom ID is required' });
    }
    
    const specialties = await Symptom.getRelatedSpecialties(id);
    
    return res.status(200).json(specialties);
  } catch (error) {
    console.error('Error getting related specialties:', error);
    return res.status(500).json({ error: 'Failed to get related specialties' });
  }
};

/**
 * Map a symptom to a specialty with a weight (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.mapToSpecialty = async (req, res) => {
  try {
    const { symptomId, specialtyId, weight } = req.body;
    
    if (!symptomId || !specialtyId || !weight) {
      return res.status(400).json({ 
        error: 'Symptom ID, specialty ID, and weight are required' 
      });
    }
    
    // Validate weight is between 1 and 10
    const weightNum = parseInt(weight, 10);
    if (isNaN(weightNum) || weightNum < 1 || weightNum > 10) {
      return res.status(400).json({ 
        error: 'Weight must be a number between 1 and 10' 
      });
    }
    
    const mapping = await Symptom.mapToSpecialty(symptomId, specialtyId, weightNum);
    
    return res.status(201).json(mapping);
  } catch (error) {
    console.error('Error mapping symptom to specialty:', error);
    return res.status(500).json({ error: 'Failed to map symptom to specialty' });
  }
};
