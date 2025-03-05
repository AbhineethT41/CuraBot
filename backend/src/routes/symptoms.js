/**
 * Symptom Routes
 * Handles routes for symptom-related operations
 */
const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const symptomController = require('../controllers/symptom');

/**
 * @route GET /api/symptoms
 * @desc Get all symptoms
 * @access Public
 */
router.get('/', symptomController.getAllSymptoms);

/**
 * @route GET /api/symptoms/:id
 * @desc Get a symptom by ID
 * @access Public
 */
router.get('/:id', symptomController.getSymptomById);

/**
 * @route GET /api/symptoms/search
 * @desc Search symptoms by name or keywords
 * @access Public
 */
router.get('/search', symptomController.searchSymptoms);

/**
 * @route GET /api/symptoms/:id/specialties
 * @desc Get specialties related to a symptom
 * @access Public
 */
router.get('/:id/specialties', symptomController.getRelatedSpecialties);

/**
 * @route POST /api/symptoms
 * @desc Create a new symptom (admin only)
 * @access Private/Admin
 */
router.post('/', authenticate, requireRole('admin'), symptomController.createSymptom);

/**
 * @route PUT /api/symptoms/:id
 * @desc Update a symptom (admin only)
 * @access Private/Admin
 */
router.put('/:id', authenticate, requireRole('admin'), symptomController.updateSymptom);

/**
 * @route DELETE /api/symptoms/:id
 * @desc Delete a symptom (admin only)
 * @access Private/Admin
 */
router.delete('/:id', authenticate, requireRole('admin'), symptomController.deleteSymptom);

/**
 * @route POST /api/symptoms/map-specialty
 * @desc Map a symptom to a specialty with a weight (admin only)
 * @access Private/Admin
 */
router.post('/map-specialty', authenticate, requireRole('admin'), symptomController.mapToSpecialty);

module.exports = router;
