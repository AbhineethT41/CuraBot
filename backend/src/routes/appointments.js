/**
 * Appointment Routes
 * Handles routes for appointment-related operations
 */
const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');

// Import controller (to be implemented)
const appointmentController = require('../controllers/appointment');

/**
 * @route GET /api/appointments
 * @desc Get all appointments (admin only)
 * @access Private/Admin
 */
router.get('/', authenticate, requireRole('admin'), appointmentController.getAllAppointments);

/**
 * @route GET /api/appointments/:id
 * @desc Get an appointment by ID
 * @access Private
 */
router.get('/:id', authenticate, appointmentController.getAppointmentById);

/**
 * @route GET /api/appointments/patient/:patientId
 * @desc Get appointments for a patient
 * @access Private
 */
router.get('/patient/:patientId', authenticate, appointmentController.getPatientAppointments);

/**
 * @route GET /api/appointments/doctor/:doctorId
 * @desc Get appointments for a doctor
 * @access Private
 */
router.get('/doctor/:doctorId', authenticate, appointmentController.getDoctorAppointments);

/**
 * @route POST /api/appointments
 * @desc Create a new appointment
 * @access Private
 */
router.post('/', authenticate, appointmentController.createAppointment);

/**
 * @route PUT /api/appointments/:id
 * @desc Update an appointment
 * @access Private
 */
router.put('/:id', authenticate, appointmentController.updateAppointment);

/**
 * @route DELETE /api/appointments/:id
 * @desc Delete an appointment
 * @access Private
 */
router.delete('/:id', authenticate, appointmentController.deleteAppointment);

/**
 * @route PUT /api/appointments/:id/status
 * @desc Update appointment status (confirm, cancel, complete)
 * @access Private
 */
router.put('/:id/status', authenticate, appointmentController.updateAppointmentStatus);

/**
 * @route GET /api/appointments/available/:doctorId
 * @desc Get available appointment slots for a doctor
 * @access Public
 */
router.get('/available/:doctorId', appointmentController.getAvailableSlots);

module.exports = router;
