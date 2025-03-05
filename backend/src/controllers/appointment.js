/**
 * Appointment Controller
 * Handles appointment-related routes and logic
 */
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

/**
 * Get all appointments (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.getAll();
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error getting all appointments:', error);
    return res.status(500).json({ error: 'Failed to get appointments' });
  }
};

/**
 * Get an appointment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Appointment ID is required' });
    }
    
    const appointment = await Appointment.getById(id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Check if the requesting user has permission (admin, the patient, or the doctor)
    if (
      req.user.role !== 'admin' && 
      req.user.id !== appointment.patient_id && 
      req.user.id !== appointment.doctor_user_id
    ) {
      return res.status(403).json({ error: 'Not authorized to access this appointment' });
    }
    
    return res.status(200).json(appointment);
  } catch (error) {
    console.error('Error getting appointment by ID:', error);
    return res.status(500).json({ error: 'Failed to get appointment' });
  }
};

/**
 * Get appointments for a patient
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }
    
    // Check if the requesting user has permission (admin or the patient themselves)
    if (req.user.role !== 'admin' && req.user.id !== patientId) {
      return res.status(403).json({ error: 'Not authorized to access these appointments' });
    }
    
    const appointments = await Appointment.getByPatient(patientId);
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error getting patient appointments:', error);
    return res.status(500).json({ error: 'Failed to get patient appointments' });
  }
};

/**
 * Get appointments for a doctor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    if (!doctorId) {
      return res.status(400).json({ error: 'Doctor ID is required' });
    }
    
    // Get the doctor to check permissions
    const doctor = await Doctor.getById(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    // Check if the requesting user has permission (admin or the doctor themselves)
    if (req.user.role !== 'admin' && req.user.id !== doctor.user_id) {
      return res.status(403).json({ error: 'Not authorized to access these appointments' });
    }
    
    const appointments = await Appointment.getByDoctor(doctorId);
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error getting doctor appointments:', error);
    return res.status(500).json({ error: 'Failed to get doctor appointments' });
  }
};

/**
 * Create a new appointment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    
    if (!appointmentData.doctor_id || !appointmentData.date || !appointmentData.time) {
      return res.status(400).json({ error: 'Doctor ID, date, and time are required' });
    }
    
    // If patient_id is not provided, use the authenticated user's ID
    if (!appointmentData.patient_id) {
      appointmentData.patient_id = req.user.id;
    } else if (req.user.role !== 'admin' && appointmentData.patient_id !== req.user.id) {
      // Only admins can create appointments for other patients
      return res.status(403).json({ error: 'Not authorized to create appointments for other patients' });
    }
    
    // Check if the slot is available
    const isAvailable = await Appointment.isSlotAvailable(
      appointmentData.doctor_id,
      appointmentData.date,
      appointmentData.time
    );
    
    if (!isAvailable) {
      return res.status(400).json({ error: 'This appointment slot is not available' });
    }
    
    // Set initial status
    appointmentData.status = 'pending';
    
    const appointment = await Appointment.create(appointmentData);
    return res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({ error: 'Failed to create appointment' });
  }
};

/**
 * Update an appointment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointmentData = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Appointment ID is required' });
    }
    
    // Get the existing appointment to check permissions
    const existingAppointment = await Appointment.getById(id);
    
    if (!existingAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Check if the requesting user has permission (admin, the patient, or the doctor)
    if (
      req.user.role !== 'admin' && 
      req.user.id !== existingAppointment.patient_id && 
      req.user.id !== existingAppointment.doctor_user_id
    ) {
      return res.status(403).json({ error: 'Not authorized to update this appointment' });
    }
    
    // If date or time is changing, check if the new slot is available
    if (
      (appointmentData.date && appointmentData.date !== existingAppointment.date) ||
      (appointmentData.time && appointmentData.time !== existingAppointment.time)
    ) {
      const isAvailable = await Appointment.isSlotAvailable(
        existingAppointment.doctor_id,
        appointmentData.date || existingAppointment.date,
        appointmentData.time || existingAppointment.time,
        id // Exclude current appointment from availability check
      );
      
      if (!isAvailable) {
        return res.status(400).json({ error: 'This appointment slot is not available' });
      }
    }
    
    const updatedAppointment = await Appointment.update(id, appointmentData);
    return res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return res.status(500).json({ error: 'Failed to update appointment' });
  }
};

/**
 * Delete an appointment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Appointment ID is required' });
    }
    
    // Get the existing appointment to check permissions
    const existingAppointment = await Appointment.getById(id);
    
    if (!existingAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Check if the requesting user has permission (admin, the patient, or the doctor)
    if (
      req.user.role !== 'admin' && 
      req.user.id !== existingAppointment.patient_id && 
      req.user.id !== existingAppointment.doctor_user_id
    ) {
      return res.status(403).json({ error: 'Not authorized to delete this appointment' });
    }
    
    await Appointment.delete(id);
    return res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return res.status(500).json({ error: 'Failed to delete appointment' });
  }
};

/**
 * Update appointment status (confirm, cancel, complete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Appointment ID is required' });
    }
    
    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required (pending, confirmed, cancelled, completed)' });
    }
    
    // Get the existing appointment to check permissions
    const existingAppointment = await Appointment.getById(id);
    
    if (!existingAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Check if the requesting user has permission (admin, the patient, or the doctor)
    if (
      req.user.role !== 'admin' && 
      req.user.id !== existingAppointment.patient_id && 
      req.user.id !== existingAppointment.doctor_user_id
    ) {
      return res.status(403).json({ error: 'Not authorized to update this appointment status' });
    }
    
    // Only doctors and admins can mark appointments as completed
    if (status === 'completed' && req.user.role !== 'admin' && req.user.id !== existingAppointment.doctor_user_id) {
      return res.status(403).json({ error: 'Only doctors and admins can mark appointments as completed' });
    }
    
    const updatedAppointment = await Appointment.update(id, { status });
    return res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return res.status(500).json({ error: 'Failed to update appointment status' });
  }
};

/**
 * Get available appointment slots for a doctor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    
    if (!doctorId) {
      return res.status(400).json({ error: 'Doctor ID is required' });
    }
    
    if (!date) {
      return res.status(400).json({ error: 'Date is required (YYYY-MM-DD format)' });
    }
    
    // Get the doctor to check their availability
    const doctor = await Doctor.getById(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    const availableSlots = await Appointment.getAvailableSlots(doctorId, date);
    return res.status(200).json(availableSlots);
  } catch (error) {
    console.error('Error getting available slots:', error);
    return res.status(500).json({ error: 'Failed to get available slots' });
  }
};
