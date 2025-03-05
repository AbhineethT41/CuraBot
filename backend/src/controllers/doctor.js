/**
 * Doctor Controller
 * Handles doctor-related routes and logic
 */
const Doctor = require('../models/Doctor');

/**
 * Get all doctors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.getAll();
    return res.status(200).json(doctors);
  } catch (error) {
    console.error('Error getting all doctors:', error);
    return res.status(500).json({ error: 'Failed to get doctors' });
  }
};

/**
 * Get a doctor by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Doctor ID is required' });
    }
    
    const doctor = await Doctor.getById(id);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    return res.status(200).json(doctor);
  } catch (error) {
    console.error('Error getting doctor by ID:', error);
    return res.status(500).json({ error: 'Failed to get doctor' });
  }
};

/**
 * Get doctors by specialty ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDoctorsBySpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Specialty ID is required' });
    }
    
    const doctors = await Doctor.getBySpecialty(id);
    return res.status(200).json(doctors);
  } catch (error) {
    console.error('Error getting doctors by specialty:', error);
    return res.status(500).json({ error: 'Failed to get doctors by specialty' });
  }
};

/**
 * Get a doctor by user ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDoctorByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Check if the requesting user has permission (admin or the doctor themselves)
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Not authorized to access this doctor profile' });
    }
    
    const doctor = await Doctor.getByUserId(userId);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    return res.status(200).json(doctor);
  } catch (error) {
    console.error('Error getting doctor by user ID:', error);
    return res.status(500).json({ error: 'Failed to get doctor' });
  }
};

/**
 * Create a new doctor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createDoctor = async (req, res) => {
  try {
    const doctorData = req.body;
    
    if (!doctorData.user_id || !doctorData.specialty_id) {
      return res.status(400).json({ error: 'User ID and specialty ID are required' });
    }
    
    const doctor = await Doctor.create(doctorData);
    return res.status(201).json(doctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    return res.status(500).json({ error: 'Failed to create doctor' });
  }
};

/**
 * Update a doctor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorData = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Doctor ID is required' });
    }
    
    // Get the doctor to check permissions
    const existingDoctor = await Doctor.getById(id);
    
    if (!existingDoctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    // Check if the requesting user has permission (admin or the doctor themselves)
    if (req.user.role !== 'admin' && req.user.id !== existingDoctor.user_id) {
      return res.status(403).json({ error: 'Not authorized to update this doctor profile' });
    }
    
    const updatedDoctor = await Doctor.update(id, doctorData);
    return res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    return res.status(500).json({ error: 'Failed to update doctor' });
  }
};

/**
 * Delete a doctor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Doctor ID is required' });
    }
    
    await Doctor.delete(id);
    return res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return res.status(500).json({ error: 'Failed to delete doctor' });
  }
};

/**
 * Search for doctors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.searchDoctors = async (req, res) => {
  try {
    const { query } = req.params;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const doctors = await Doctor.search(query);
    return res.status(200).json(doctors);
  } catch (error) {
    console.error('Error searching doctors:', error);
    return res.status(500).json({ error: 'Failed to search doctors' });
  }
};

/**
 * Get available slots for a doctor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Doctor ID is required' });
    }
    
    const doctor = await Doctor.getById(id);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    // Generate available slots based on doctor's available_days and available_hours
    // This is a simplified implementation - in a real app, you would check against existing appointments
    const availableSlots = [];
    
    // Get the next 7 days
    const today = new Date();
    const availableDays = doctor.available_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const availableHours = doctor.available_hours || ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip days that the doctor is not available
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (!availableDays.includes(dayName)) {
        continue;
      }
      
      // Format date as YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0];
      
      // Add this date with available slots
      availableSlots.push({
        date: formattedDate,
        slots: availableHours
      });
    }
    
    return res.status(200).json(availableSlots);
  } catch (error) {
    console.error('Error getting available slots:', error);
    return res.status(500).json({ error: 'Failed to get available slots' });
  }
};
