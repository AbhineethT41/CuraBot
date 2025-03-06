const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialtyController');

// Get all specialties
router.get('/', specialtyController.getAllSpecialties);

// Get specialty by ID
router.get('/:id', specialtyController.getSpecialtyById);

// Get doctors by specialty
router.get('/:id/doctors', specialtyController.getDoctorsBySpecialty);

// Get common symptoms for a specialty
router.get('/:id/symptoms', specialtyController.getCommonSymptoms);

module.exports = router;
