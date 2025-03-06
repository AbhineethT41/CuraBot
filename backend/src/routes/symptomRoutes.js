const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/symptomController');

// Get all symptoms
router.get('/', symptomController.getAllSymptoms);

// Get symptom by ID
router.get('/:id', symptomController.getSymptomById);

// Search symptoms
router.get('/search', symptomController.searchSymptoms);

// Get related specialties for a symptom
router.get('/:id/specialties', symptomController.getRelatedSpecialties);

module.exports = router;
