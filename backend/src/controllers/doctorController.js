const asyncHandler = require('express-async-handler');

// Mock data for development
const mockDoctors = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    specialties: ['Cardiology'],
    education: 'Harvard Medical School',
    experience: '15 years',
    rating: 4.8,
    availability: [
      { day: 'Monday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
      { day: 'Wednesday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
      { day: 'Friday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] }
    ]
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    specialties: ['Neurology'],
    education: 'Johns Hopkins University',
    experience: '10 years',
    rating: 4.9,
    availability: [
      { day: 'Tuesday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
      { day: 'Thursday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] }
    ]
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Chen',
    specialties: ['Dermatology'],
    education: 'Stanford University',
    experience: '8 years',
    rating: 4.7,
    availability: [
      { day: 'Monday', slots: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'] },
      { day: 'Wednesday', slots: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'] },
      { day: 'Friday', slots: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'] }
    ]
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    specialties: ['Pediatrics'],
    education: 'Yale University',
    experience: '12 years',
    rating: 4.9,
    availability: [
      { day: 'Tuesday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'] },
      { day: 'Thursday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'] },
      { day: 'Saturday', slots: ['10:00 AM', '11:00 AM', '12:00 PM'] }
    ]
  },
  {
    id: '5',
    firstName: 'Robert',
    lastName: 'Wilson',
    specialties: ['Orthopedics'],
    education: 'University of California',
    experience: '20 years',
    rating: 4.8,
    availability: [
      { day: 'Monday', slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'] },
      { day: 'Wednesday', slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'] },
      { day: 'Friday', slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'] }
    ]
  },
  {
    id: '6',
    firstName: 'Jennifer',
    lastName: 'Lee',
    specialties: ['Psychiatry'],
    education: 'Columbia University',
    experience: '14 years',
    rating: 4.9,
    availability: [
      { day: 'Monday', slots: ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'] },
      { day: 'Thursday', slots: ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'] }
    ]
  },
  {
    id: '7',
    firstName: 'David',
    lastName: 'Brown',
    specialties: ['Gastroenterology'],
    education: 'University of Chicago',
    experience: '16 years',
    rating: 4.7,
    availability: [
      { day: 'Tuesday', slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'] },
      { day: 'Friday', slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'] }
    ]
  },
  {
    id: '8',
    firstName: 'Amanda',
    lastName: 'Garcia',
    specialties: ['ENT'],
    education: 'UCLA Medical School',
    experience: '9 years',
    rating: 4.8,
    availability: [
      { day: 'Wednesday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
      { day: 'Friday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] }
    ]
  },
  {
    id: '9',
    firstName: 'Thomas',
    lastName: 'Wang',
    specialties: ['Ophthalmology'],
    education: 'Duke University',
    experience: '11 years',
    rating: 4.9,
    availability: [
      { day: 'Monday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'] },
      { day: 'Wednesday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'] }
    ]
  },
  {
    id: '10',
    firstName: 'Sophia',
    lastName: 'Martinez',
    specialties: ['Pulmonology'],
    education: 'Mayo Clinic College of Medicine',
    experience: '13 years',
    rating: 4.8,
    availability: [
      { day: 'Tuesday', slots: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'] },
      { day: 'Thursday', slots: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'] }
    ]
  },
  {
    id: '11',
    firstName: 'James',
    lastName: 'Taylor',
    specialties: ['Urology'],
    education: 'University of Pennsylvania',
    experience: '18 years',
    rating: 4.7,
    availability: [
      { day: 'Monday', slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'] },
      { day: 'Wednesday', slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'] }
    ]
  },
  {
    id: '12',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    specialties: ['Gynecology'],
    education: 'NYU School of Medicine',
    experience: '15 years',
    rating: 4.9,
    availability: [
      { day: 'Tuesday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
      { day: 'Thursday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] }
    ]
  },
  {
    id: '13',
    firstName: 'Richard',
    lastName: 'Kim',
    specialties: ['Endocrinology'],
    education: 'Emory University School of Medicine',
    experience: '12 years',
    rating: 4.8,
    availability: [
      { day: 'Wednesday', slots: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'] },
      { day: 'Friday', slots: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'] }
    ]
  },
  {
    id: '14',
    firstName: 'Lisa',
    lastName: 'Patel',
    specialties: ['Allergy and Immunology'],
    education: 'Baylor College of Medicine',
    experience: '10 years',
    rating: 4.7,
    availability: [
      { day: 'Tuesday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'] },
      { day: 'Thursday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'] }
    ]
  },
  {
    id: '15',
    firstName: 'William',
    lastName: 'Thompson',
    specialties: ['General Medicine'],
    education: 'University of Michigan Medical School',
    experience: '22 years',
    rating: 4.9,
    availability: [
      { day: 'Monday', slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'] },
      { day: 'Wednesday', slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'] },
      { day: 'Friday', slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'] }
    ]
  }
];

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = asyncHandler(async (req, res) => {
  res.json(mockDoctors);
});

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = mockDoctors.find(d => d.id === req.params.id);
  
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }
  
  res.json(doctor);
});

// @desc    Get doctors by specialty
// @route   GET /api/doctors/specialty/:specialtyId
// @access  Public
const getDoctorsBySpecialty = asyncHandler(async (req, res) => {
  const specialty = req.params.specialtyId;
  const doctors = mockDoctors.filter(d => d.specialties.includes(specialty));
  
  res.json(doctors);
});

// @desc    Search doctors
// @route   GET /api/doctors/search
// @access  Public
const searchDoctors = asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.json(mockDoctors);
  }
  
  const searchQuery = query.toLowerCase();
  const doctors = mockDoctors.filter(d => 
    d.firstName.toLowerCase().includes(searchQuery) || 
    d.lastName.toLowerCase().includes(searchQuery) ||
    d.specialties.some(s => s.toLowerCase().includes(searchQuery))
  );
  
  res.json(doctors);
});

// @desc    Get doctor availability
// @route   GET /api/doctors/:id/availability
// @access  Public
const getDoctorAvailability = asyncHandler(async (req, res) => {
  const doctor = mockDoctors.find(d => d.id === req.params.id);
  
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }
  
  res.json(doctor.availability);
});

// Helper method to get mock doctors by specialty (for use by other controllers)
const getMockDoctorsBySpecialty = (specialty) => {
  // Case-insensitive search
  const normalizedSpecialty = specialty.toLowerCase();
  
  return mockDoctors.filter(doctor => 
    doctor.specialties.some(s => s.toLowerCase() === normalizedSpecialty)
  );
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorsBySpecialty,
  searchDoctors,
  getDoctorAvailability,
  getMockDoctorsBySpecialty
};
