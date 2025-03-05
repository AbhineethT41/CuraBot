/**
 * Doctor Routes
 * Handles routes for doctor-related operations
 */
const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');

// Import controller (to be implemented)
const doctorController = require('../controllers/doctor');

/**
 * @route GET /api/doctors
 * @desc Get all doctors
 * @access Public
 */
router.get('/', doctorController.getAllDoctors);

/**
 * @route GET /api/doctors/:id
 * @desc Get a doctor by ID
 * @access Public
 */
router.get('/:id', doctorController.getDoctorById);

/**
 * @route GET /api/doctors/specialty/:id
 * @desc Get doctors by specialty ID
 * @access Public
 */
router.get('/specialty/:id', doctorController.getDoctorsBySpecialty);

/**
 * @route GET /api/doctors/user/:userId
 * @desc Get a doctor by user ID
 * @access Private
 */
router.get('/user/:userId', authenticate, doctorController.getDoctorByUserId);

/**
 * @route GET /api/doctors/:id/available-slots
 * @desc Get available appointment slots for a doctor
 * @access Public
 */
router.get('/:id/available-slots', doctorController.getAvailableSlots);

/**
 * @route POST /api/doctors
 * @desc Create a new doctor profile (admin only)
 * @access Private/Admin
 */
router.post('/', authenticate, requireRole('admin'), doctorController.createDoctor);

/**
 * @route PUT /api/doctors/:id
 * @desc Update a doctor
 * @access Private/Admin or Doctor
 */
router.put('/:id', authenticate, doctorController.updateDoctor);

/**
 * @route DELETE /api/doctors/:id
 * @desc Delete a doctor profile (admin only)
 * @access Private/Admin
 */
router.delete('/:id', authenticate, requireRole('admin'), doctorController.deleteDoctor);

/**
 * @route GET /api/doctors/search/:query
 * @desc Search for doctors
 * @access Public
 */
router.get('/search/:query', doctorController.searchDoctors);

module.exports = router;
