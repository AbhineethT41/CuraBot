import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import DoctorCard, { Doctor } from '../components/appointments/DoctorCard';
import BookingModal from '../components/appointments/BookingModal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { useAppointmentStore } from '../store/appointmentStore';
import { useChatStore } from '../store/chatStore';

const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const { doctors, filteredDoctors, getDoctorsBySpecialty, bookAppointment } = useAppointmentStore();
  const { recommendedSpecialty } = useChatStore();
  
  useEffect(() => {
    // If we have a recommended specialty from the chatbot, filter doctors by it
    if (recommendedSpecialty) {
      getDoctorsBySpecialty(recommendedSpecialty);
    }
  }, [recommendedSpecialty, getDoctorsBySpecialty]);
  
  const displayedDoctors = filteredDoctors.length > 0 ? filteredDoctors : doctors;
  
  const filteredBySearch = searchTerm
    ? displayedDoctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : displayedDoctors;
  
  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };
  
  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedDoctor(null);
  };
  
  const handleConfirmBooking = (doctorId: string, date: string, time: string, notes: string) => {
    bookAppointment(doctorId, date, time, notes);
    setShowBookingModal(false);
    navigate('/dashboard');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Doctor</h1>
        <p className="text-gray-600">
          {recommendedSpecialty
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
              <Button
                variant={recommendedSpecialty ? 'primary' : 'secondary'}
                leftIcon={<Filter size={18} />}
                onClick={() => getDoctorsBySpecialty(recommendedSpecialty || '')}
              >
                {recommendedSpecialty || 'All Specialties'}
              </Button>
              {recommendedSpecialty && (
                <Button
                  variant="secondary"
                  onClick={() => getDoctorsBySpecialty('')}
                >
                  Clear Filter
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
      
      {/* Doctors grid */}
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
              onClick={() => {
                setSearchTerm('');
                getDoctorsBySpecialty('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      
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