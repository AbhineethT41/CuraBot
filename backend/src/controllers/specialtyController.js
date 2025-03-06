const asyncHandler = require('express-async-handler');
const doctorController = require('./doctorController');

// Mock data for medical specialties
const mockSpecialties = [
  {
    id: '1',
    name: 'Cardiology',
    description: 'Deals with disorders of the heart and cardiovascular system',
    commonSymptoms: ['Chest pain', 'Shortness of breath', 'Palpitations', 'High blood pressure', 'Dizziness'],
    subSpecialties: ['Interventional Cardiology', 'Electrophysiology', 'Heart Failure']
  },
  {
    id: '2',
    name: 'Dermatology',
    description: 'Focuses on diseases of the skin, hair, and nails',
    commonSymptoms: ['Rash', 'Itching', 'Skin lesions', 'Hair loss', 'Nail changes'],
    subSpecialties: ['Cosmetic Dermatology', 'Pediatric Dermatology', 'Dermatopathology']
  },
  {
    id: '3',
    name: 'Neurology',
    description: 'Deals with disorders of the nervous system',
    commonSymptoms: ['Headache', 'Dizziness', 'Numbness', 'Weakness', 'Memory problems', 'Seizures'],
    subSpecialties: ['Stroke', 'Epilepsy', 'Movement Disorders', 'Neuromuscular Medicine']
  },
  {
    id: '4',
    name: 'Orthopedics',
    description: 'Focuses on the musculoskeletal system',
    commonSymptoms: ['Joint pain', 'Back pain', 'Fractures', 'Sprains', 'Limited range of motion'],
    subSpecialties: ['Sports Medicine', 'Spine Surgery', 'Joint Replacement', 'Hand Surgery']
  },
  {
    id: '5',
    name: 'Gastroenterology',
    description: 'Deals with disorders of the digestive system',
    commonSymptoms: ['Abdominal pain', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Heartburn'],
    subSpecialties: ['Hepatology', 'Inflammatory Bowel Disease', 'Pancreatic Disease']
  },
  {
    id: '6',
    name: 'Pulmonology',
    description: 'Focuses on diseases of the respiratory system',
    commonSymptoms: ['Cough', 'Shortness of breath', 'Wheezing', 'Chest pain', 'Sleep apnea'],
    subSpecialties: ['Interventional Pulmonology', 'Sleep Medicine', 'Critical Care']
  },
  {
    id: '7',
    name: 'ENT',
    description: 'Deals with conditions of the ear, nose, and throat',
    commonSymptoms: ['Ear pain', 'Hearing loss', 'Sore throat', 'Difficulty swallowing', 'Nasal congestion'],
    subSpecialties: ['Otology', 'Rhinology', 'Laryngology', 'Head and Neck Surgery']
  },
  {
    id: '8',
    name: 'Endocrinology',
    description: 'Focuses on disorders of the endocrine system and hormones',
    commonSymptoms: ['Fatigue', 'Weight changes', 'Excessive thirst', 'Hair loss', 'Temperature sensitivity'],
    subSpecialties: ['Diabetes', 'Thyroid Disorders', 'Reproductive Endocrinology']
  },
  {
    id: '9',
    name: 'Ophthalmology',
    description: 'Deals with disorders of the eye',
    commonSymptoms: ['Vision changes', 'Eye pain', 'Redness', 'Dry eyes', 'Floaters'],
    subSpecialties: ['Retina', 'Glaucoma', 'Cornea', 'Pediatric Ophthalmology']
  },
  {
    id: '10',
    name: 'General Medicine',
    description: 'Provides primary care and manages common health problems',
    commonSymptoms: ['Fever', 'Fatigue', 'Pain', 'Cough', 'Headache', 'Nausea'],
    subSpecialties: ['Family Medicine', 'Internal Medicine', 'Preventive Medicine']
  }
];

// @desc    Get all specialties
// @route   GET /api/specialties
// @access  Public
const getAllSpecialties = asyncHandler(async (req, res) => {
  res.json(mockSpecialties);
});

// @desc    Get specialty by ID
// @route   GET /api/specialties/:id
// @access  Public
const getSpecialtyById = asyncHandler(async (req, res) => {
  const specialty = mockSpecialties.find(s => s.id === req.params.id);
  
  if (!specialty) {
    res.status(404);
    throw new Error('Specialty not found');
  }
  
  res.json(specialty);
});

// @desc    Get doctors by specialty
// @route   GET /api/specialties/:id/doctors
// @access  Public
const getDoctorsBySpecialty = asyncHandler(async (req, res) => {
  const specialty = mockSpecialties.find(s => s.id === req.params.id);
  
  if (!specialty) {
    res.status(404);
    throw new Error('Specialty not found');
  }
  
  const doctors = doctorController.getDoctorsBySpecialtyHelper(specialty.name);
  res.json(doctors);
});

// @desc    Get common symptoms for a specialty
// @route   GET /api/specialties/:id/symptoms
// @access  Public
const getCommonSymptoms = asyncHandler(async (req, res) => {
  const specialty = mockSpecialties.find(s => s.id === req.params.id);
  
  if (!specialty) {
    res.status(404);
    throw new Error('Specialty not found');
  }
  
  res.json(specialty.commonSymptoms);
});

// Helper function to get specialty by name
const getSpecialtyByNameHelper = (name) => {
  return mockSpecialties.find(s => s.name.toLowerCase() === name.toLowerCase());
};

module.exports = {
  getAllSpecialties,
  getSpecialtyById,
  getDoctorsBySpecialty,
  getCommonSymptoms,
  getSpecialtyByNameHelper
};
