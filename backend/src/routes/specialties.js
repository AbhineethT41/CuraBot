/**
 * Specialty Routes
 * Handles routes for specialty-related operations
 */
const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const specialtyController = require('../controllers/specialty');

/**
 * @route GET /api/specialties
 * @desc Get all specialties
 * @access Public
 */
router.get('/', specialtyController.getAllSpecialties);

/**
 * @route GET /api/specialties/:id
 * @desc Get a specialty by ID
 * @access Public
 */
router.get('/:id', specialtyController.getSpecialtyById);

/**
 * @route POST /api/specialties
 * @desc Create a new specialty (admin only)
 * @access Private/Admin
 */
router.post('/', authenticate, requireRole('admin'), specialtyController.createSpecialty);

/**
 * @route PUT /api/specialties/:id
 * @desc Update a specialty (admin only)
 * @access Private/Admin
 */
router.put('/:id', authenticate, requireRole('admin'), specialtyController.updateSpecialty);

/**
 * @route DELETE /api/specialties/:id
 * @desc Delete a specialty (admin only)
 * @access Private/Admin
 */
router.delete('/:id', authenticate, requireRole('admin'), specialtyController.deleteSpecialty);

/**
 * @route GET /api/specialties/symptom/:symptomId
 * @desc Get specialties related to a symptom
 * @access Public
 */
router.get('/symptom/:symptomId', specialtyController.getSpecialtiesBySymptom);

module.exports = router;
