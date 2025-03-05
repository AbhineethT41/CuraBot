import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import DoctorCard, { Doctor } from '../components/appointments/DoctorCard';
import BookingModal from '../components/appointments/BookingModal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { useAppointmentStore } from '../store/appointmentStore';
import { useChatStore } from '../store/chatStore';

// Interface for recommended doctors from the chatbot
interface RecommendedDoctor {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string;
  email?: string;
  phone?: string;
  years_of_experience?: number;
}

const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const { 
    doctors, 
    isLoading,
    error,
    selectedSpecialty,
    getDoctorsBySpecialty, 
    bookAppointment,
    fetchDoctors,
    getAvailableSlots
  } = useAppointmentStore();
  
  const { recommendedSpecialty, recommendedDoctors } = useChatStore();
  
  // Parse query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const doctorId = queryParams.get('doctor');
    
    // If doctor ID is in the URL, find the doctor and open booking modal
    if (doctorId) {
      const doctor = doctors.find(d => d.id === doctorId);
      if (doctor) {
        setSelectedDoctor(doctor);
        setShowBookingModal(true);
      } else {
        // If doctor not found in current list, fetch all doctors
        fetchDoctors().then(() => {
          const foundDoctor = doctors.find(d => d.id === doctorId);
          if (foundDoctor) {
            setSelectedDoctor(foundDoctor);
            setShowBookingModal(true);
          }
        });
      }
    }
  }, [location.search, doctors, fetchDoctors]);
  
  useEffect(() => {
    // Fetch doctors when component mounts
    fetchDoctors();
  }, [fetchDoctors]);
  
  useEffect(() => {
    // If we have a recommended specialty from the chatbot, filter doctors by it
    if (recommendedSpecialty && !selectedSpecialty) {
      getDoctorsBySpecialty(recommendedSpecialty);
    }
  }, [recommendedSpecialty, getDoctorsBySpecialty, selectedSpecialty]);
  
  // Filter doctors by search term
  const filteredBySearch = searchTerm
    ? doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : doctors;
  
  const handleBookAppointment = async (doctor: Doctor) => {
    // Fetch available slots before opening the modal
    try {
      await getAvailableSlots(doctor.id);
      setSelectedDoctor(doctor);
      setShowBookingModal(true);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // Show error message to user
      alert('Could not fetch available appointment slots. Please try again later.');
    }
  };
  
  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedDoctor(null);
    
    // Remove the doctor query parameter from the URL
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.has('doctor')) {
      queryParams.delete('doctor');
      navigate({
        pathname: location.pathname,
        search: queryParams.toString()
      });
    }
  };
  
  const handleConfirmBooking = async (doctorId: string, date: string, time: string, notes: string) => {
    try {
      await bookAppointment(doctorId, date, time, notes);
      setShowBookingModal(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again later.');
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    fetchDoctors();
  };
  
  // Convert recommended doctors to the Doctor interface format
  const convertRecommendedDoctors = (recommendedDocs: RecommendedDoctor[]): Doctor[] => {
    return recommendedDocs.map(doctor => ({
      id: doctor.id,
      name: `${doctor.first_name} ${doctor.last_name}`,
      specialty: doctor.specialty,
      image: `/assets/doctors/${doctor.id}.jpg`,
      rating: 4.5,
      experience: doctor.years_of_experience || 5,
      location: 'Main Hospital',
      phone: doctor.phone || '123-456-7890',
      availableSlots: []
    }));
  };
  
  // Get formatted recommended doctors
  const formattedRecommendedDoctors = convertRecommendedDoctors(recommendedDoctors);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Doctor</h1>
        <p className="text-gray-600">
          {selectedSpecialty
            ? `Showing doctors specializing in ${selectedSpecialty}`
            : recommendedSpecialty
            ? `Based on your symptoms, we recommend doctors specializing in ${recommendedSpecialty}`
            : 'Browse our list of specialists and book an appointment'}
        </p>
      </div>
      
      {/* Search and filter */}
      <Card className="mb-8">
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                placeholder="Search by doctor name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={18} className="text-gray-400" />}
                className="mb-0"
              />
            </div>
            <div className="flex gap-2">
              {recommendedSpecialty && (
                <Button
                  variant={selectedSpecialty === recommendedSpecialty ? 'primary' : 'secondary'}
                  leftIcon={<Filter size={18} />}
                  onClick={() => getDoctorsBySpecialty(recommendedSpecialty)}
                >
                  {recommendedSpecialty}
                </Button>
              )}
              {selectedSpecialty && (
                <Button
                  variant="secondary"
                  onClick={clearFilters}
                >
                  Clear Filter
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
      
      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
          <p className="text-red-700">{error}</p>
          <Button
            variant="secondary"
            className="mt-2"
            onClick={clearFilters}
          >
            Retry
          </Button>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="col-span-full py-12 text-center">
          <p className="text-gray-500 text-lg">Loading doctors...</p>
        </div>
      )}
      
      {/* Recommended doctors from chatbot */}
      {!isLoading && formattedRecommendedDoctors.length > 0 && !selectedSpecialty && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recommended Doctors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formattedRecommendedDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onBookAppointment={handleBookAppointment}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* All doctors grid */}
      {!isLoading && (
        <>
          {formattedRecommendedDoctors.length > 0 && !selectedSpecialty && (
            <h2 className="text-xl font-semibold mb-4">All Doctors</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBySearch.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onBookAppointment={handleBookAppointment}
              />
            ))}
            
            {filteredBySearch.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Booking modal */}
      {showBookingModal && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={handleCloseModal}
          onBookAppointment={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;