const asyncHandler = require('express-async-handler');

// Mock data for appointments
const mockAppointments = [
  {
    id: '101',
    patientId: '1',
    doctorId: '101',
    date: '2023-06-15',
    time: '10:00',
    duration: 30, // minutes
    status: 'confirmed',
    type: 'in-person',
    reason: 'Headache consultation',
    notes: 'Patient has been experiencing severe headaches for the past week.'
  },
  {
    id: '102',
    patientId: '2',
    doctorId: '102',
    date: '2023-06-05',
    time: '14:30',
    duration: 45, // minutes
    status: 'confirmed',
    type: 'virtual',
    reason: 'Chest pain evaluation',
    notes: 'Patient reports chest pain during exercise.'
  },
  {
    id: '103',
    patientId: '1',
    doctorId: '103',
    date: '2023-06-20',
    time: '11:15',
    duration: 30, // minutes
    status: 'pending',
    type: 'in-person',
    reason: 'Annual physical',
    notes: 'Routine annual physical examination.'
  },
  {
    id: '104',
    patientId: '3',
    doctorId: '101',
    date: '2023-06-16',
    time: '09:00',
    duration: 30, // minutes
    status: 'confirmed',
    type: 'in-person',
    reason: 'Follow-up appointment',
    notes: 'Follow-up for migraine treatment.'
  },
  {
    id: '105',
    patientId: '2',
    doctorId: '104',
    date: '2023-06-10',
    time: '15:45',
    duration: 60, // minutes
    status: 'confirmed',
    type: 'virtual',
    reason: 'Skin rash consultation',
    notes: 'Patient has developed a rash on arms and legs.'
  }
];

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
const getAllAppointments = asyncHandler(async (req, res) => {
  res.json(mockAppointments);
});

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = mockAppointments.find(a => a.id === req.params.id);
  
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  
  res.json(appointment);
});

// @desc    Get user appointments
// @route   GET /api/appointments/user/:userId
// @access  Private
const getUserAppointments = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const appointments = mockAppointments.filter(a => a.patientId === userId);
  
  res.json(appointments);
});

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor/:doctorId
// @access  Private
const getDoctorAppointments = asyncHandler(async (req, res) => {
  const doctorId = req.params.doctorId;
  const appointments = mockAppointments.filter(a => a.doctorId === doctorId);
  
  res.json(appointments);
});

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  const { patientId, doctorId, date, time, duration, type, reason, notes } = req.body;
  
  if (!patientId || !doctorId || !date || !time || !duration || !type || !reason) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }
  
  // Check for conflicts (in a real app, this would be more sophisticated)
  const conflictingAppointments = mockAppointments.filter(a => 
    a.doctorId === doctorId && 
    a.date === date && 
    a.time === time
  );
  
  if (conflictingAppointments.length > 0) {
    res.status(400);
    throw new Error('This time slot is already booked');
  }
  
  const newAppointment = {
    id: (parseInt(mockAppointments[mockAppointments.length - 1].id) + 1).toString(),
    patientId,
    doctorId,
    date,
    time,
    duration,
    status: 'pending',
    type,
    reason,
    notes: notes || ''
  };
  
  mockAppointments.push(newAppointment);
  
  res.status(201).json(newAppointment);
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = mockAppointments.find(a => a.id === req.params.id);
  
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  
  const { date, time, duration, status, type, reason, notes } = req.body;
  
  // Update appointment fields
  if (date) appointment.date = date;
  if (time) appointment.time = time;
  if (duration) appointment.duration = duration;
  if (status) appointment.status = status;
  if (type) appointment.type = type;
  if (reason) appointment.reason = reason;
  if (notes) appointment.notes = notes;
  
  res.json(appointment);
});

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = mockAppointments.find(a => a.id === req.params.id);
  
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  
  appointment.status = 'cancelled';
  
  res.json({ message: 'Appointment cancelled', appointment });
});

module.exports = {
  getAllAppointments,
  getAppointmentById,
  getUserAppointments,
  getDoctorAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment
};
