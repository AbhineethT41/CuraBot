const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Get all doctors
router.get('/', doctorController.getAllDoctors);

// Get doctor by ID
router.get('/:id', doctorController.getDoctorById);

// Get doctors by specialty
router.get('/specialty/:specialtyId', doctorController.getDoctorsBySpecialty);

// Search doctors
router.get('/search', doctorController.searchDoctors);

// Get doctor availability
router.get('/:id/availability', doctorController.getDoctorAvailability);

module.exports = router;
