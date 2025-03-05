import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import AppointmentCard from '../components/appointments/AppointmentCard';
import { useAppointmentStore } from '../store/appointmentStore';
import RescheduleModal from '../components/appointments/RescheduleModal';
import { Appointment } from '../components/appointments/AppointmentCard';

const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  
  const { 
    appointments, 
    cancelAppointment, 
    rescheduleAppointment,
    getUpcomingAppointments,
    getPastAppointments,
    fetchAppointments,
    isLoading
  } = useAppointmentStore();
  
  // Fetch appointments when component mounts
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);
  
  // Get upcoming and past appointments
  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();
  
  // Filter appointments based on search term
  const filteredUpcoming = searchTerm
    ? upcomingAppointments.filter(
        (appointment) =>
          appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : upcomingAppointments;
  
  const filteredPast = searchTerm
    ? pastAppointments.filter(
        (appointment) =>
          appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : pastAppointments;
  
  // Handle appointment cancellation
  const handleCancelAppointment = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment(id);
    }
  };
  
  // Handle appointment rescheduling
  const handleRescheduleAppointment = (id: string) => {
    const appointment = appointments.find(app => app.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setShowRescheduleModal(true);
    }
  };
  
  // Handle reschedule confirmation
  const handleConfirmReschedule = (appointmentId: string, newDate: string, newTime: string) => {
    rescheduleAppointment(appointmentId, newDate, newTime)
      .then(() => {
        setShowRescheduleModal(false);
        setSelectedAppointment(null);
      })
      .catch(error => {
        console.error('Error rescheduling appointment:', error);
      });
  };
  
  // Handle close modal
  const handleCloseModal = () => {
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
        <p className="text-gray-600">
          Manage your appointments and health information
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - User info and quick actions */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Your Information</h2>
            </CardHeader>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <User size={32} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">John Doe</h3>
                  <p className="text-gray-500">Patient</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>DOB: January 15, 1985</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>123 Main St, Anytown, USA</span>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => navigate('/profile')}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/appointments')}
                >
                  Book New Appointment
                </Button>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => navigate('/chatbot')}
                >
                  Talk to CuraBot
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => navigate('/messages')}
                >
                  Message Your Doctor
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => navigate('/records')}
                >
                  View Medical Records
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Right column - Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h2 className="text-xl font-semibold mb-2 sm:mb-0">Your Appointments</h2>
              <div className="flex space-x-2">
                <Button
                  variant={activeTab === 'upcoming' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveTab('upcoming')}
                >
                  Upcoming
                </Button>
                <Button
                  variant={activeTab === 'past' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveTab('past')}
                >
                  Past
                </Button>
              </div>
            </CardHeader>
            
            <CardBody>
              <div className="mb-4">
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search size={18} className="text-gray-400" />}
                />
              </div>
              
              {isLoading ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Loading appointments...</p>
                </div>
              ) : activeTab === 'upcoming' ? (
                <>
                  {filteredUpcoming.length > 0 ? (
                    <div className="space-y-4">
                      {filteredUpcoming.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onCancel={handleCancelAppointment}
                          onReschedule={handleRescheduleAppointment}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">No upcoming appointments found.</p>
                      <Button
                        variant="primary"
                        className="mt-4"
                        onClick={() => navigate('/appointments')}
                      >
                        Book an Appointment
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {filteredPast.length > 0 ? (
                    <div className="space-y-4">
                      {filteredPast.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">No past appointments found.</p>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
      
      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <RescheduleModal
          appointment={selectedAppointment}
          onClose={handleCloseModal}
          onReschedule={handleConfirmReschedule}
        />
      )}
    </div>
  );
};

export default UserDashboardPage;