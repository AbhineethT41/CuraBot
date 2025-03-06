const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Get all appointments
router.get('/', appointmentController.getAllAppointments);

// Get appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// Get user appointments
router.get('/user/:userId', appointmentController.getUserAppointments);

// Get doctor appointments
router.get('/doctor/:doctorId', appointmentController.getDoctorAppointments);

// Create appointment
router.post('/', appointmentController.createAppointment);

// Update appointment
router.put('/:id', appointmentController.updateAppointment);

// Cancel appointment
router.delete('/:id', appointmentController.cancelAppointment);

module.exports = router;
