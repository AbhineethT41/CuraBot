const asyncHandler = require('express-async-handler');

// Mock data for symptoms
const mockSymptoms = [
  {
    id: '1',
    name: 'Headache',
    description: 'Pain in the head or upper neck',
    relatedSpecialties: ['Neurology', 'General Medicine'],
    severity: 'moderate',
    commonCauses: ['Stress', 'Dehydration', 'Lack of sleep', 'Eye strain']
  },
  {
    id: '2',
    name: 'Chest Pain',
    description: 'Discomfort or pain in the chest area',
    relatedSpecialties: ['Cardiology', 'Pulmonology'],
    severity: 'severe',
    commonCauses: ['Heart attack', 'Angina', 'Muscle strain', 'Anxiety']
  },
  {
    id: '3',
    name: 'Cough',
    description: 'Sudden expulsion of air from the lungs',
    relatedSpecialties: ['Pulmonology', 'ENT', 'General Medicine'],
    severity: 'mild',
    commonCauses: ['Common cold', 'Allergies', 'Asthma', 'Smoking']
  },
  {
    id: '4',
    name: 'Fever',
    description: 'Elevated body temperature',
    relatedSpecialties: ['General Medicine', 'Infectious Disease'],
    severity: 'moderate',
    commonCauses: ['Infection', 'Inflammation', 'Heat exhaustion']
  },
  {
    id: '5',
    name: 'Rash',
    description: 'Area of irritated or swollen skin',
    relatedSpecialties: ['Dermatology', 'Allergy and Immunology'],
    severity: 'mild',
    commonCauses: ['Allergic reaction', 'Eczema', 'Psoriasis', 'Contact with irritants']
  },
  {
    id: '6',
    name: 'Nausea',
    description: 'Feeling of sickness with an inclination to vomit',
    relatedSpecialties: ['Gastroenterology', 'General Medicine'],
    severity: 'moderate',
    commonCauses: ['Food poisoning', 'Motion sickness', 'Pregnancy', 'Migraine']
  },
  {
    id: '7',
    name: 'Joint Pain',
    description: 'Discomfort or pain in any joint',
    relatedSpecialties: ['Orthopedics', 'Rheumatology'],
    severity: 'moderate',
    commonCauses: ['Arthritis', 'Injury', 'Overuse', 'Infection']
  },
  {
    id: '8',
    name: 'Dizziness',
    description: 'Feeling lightheaded or unsteady',
    relatedSpecialties: ['Neurology', 'ENT', 'Cardiology'],
    severity: 'moderate',
    commonCauses: ['Low blood pressure', 'Inner ear problems', 'Dehydration', 'Medication side effects']
  },
  {
    id: '9',
    name: 'Fatigue',
    description: 'Feeling of tiredness or exhaustion',
    relatedSpecialties: ['General Medicine', 'Endocrinology', 'Psychiatry'],
    severity: 'mild',
    commonCauses: ['Lack of sleep', 'Stress', 'Anemia', 'Depression', 'Hypothyroidism']
  },
  {
    id: '10',
    name: 'Shortness of Breath',
    description: 'Difficulty breathing or feeling breathless',
    relatedSpecialties: ['Pulmonology', 'Cardiology', 'Allergy and Immunology'],
    severity: 'severe',
    commonCauses: ['Asthma', 'COPD', 'Heart failure', 'Anxiety', 'Pneumonia']
  }
];

// @desc    Get all symptoms
// @route   GET /api/symptoms
// @access  Public
const getAllSymptoms = asyncHandler(async (req, res) => {
  res.json(mockSymptoms);
});

// @desc    Get symptom by ID
// @route   GET /api/symptoms/:id
// @access  Public
const getSymptomById = asyncHandler(async (req, res) => {
  const symptom = mockSymptoms.find(s => s.id === req.params.id);
  
  if (!symptom) {
    res.status(404);
    throw new Error('Symptom not found');
  }
  
  res.json(symptom);
});

// @desc    Search symptoms
// @route   GET /api/symptoms/search
// @access  Public
const searchSymptoms = asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.json(mockSymptoms);
  }
  
  const searchQuery = query.toLowerCase();
  const symptoms = mockSymptoms.filter(s => 
    s.name.toLowerCase().includes(searchQuery) || 
    s.description.toLowerCase().includes(searchQuery)
  );
  
  res.json(symptoms);
});

// @desc    Get related specialties for a symptom
// @route   GET /api/symptoms/:id/specialties
// @access  Public
const getRelatedSpecialties = asyncHandler(async (req, res) => {
  const symptom = mockSymptoms.find(s => s.id === req.params.id);
  
  if (!symptom) {
    res.status(404);
    throw new Error('Symptom not found');
  }
  
  res.json(symptom.relatedSpecialties);
});

module.exports = {
  getAllSymptoms,
  getSymptomById,
  searchSymptoms,
  getRelatedSpecialties
};
