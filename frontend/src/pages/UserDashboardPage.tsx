import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import AppointmentCard from '../components/appointments/AppointmentCard';
import { useAppointmentStore } from '../store/appointmentStore';

const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    appointments, 
    cancelAppointment, 
    rescheduleAppointment,
    getUpcomingAppointments,
    getPastAppointments
  } = useAppointmentStore();
  
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
  
  // Handle appointment rescheduling (in a real app, this would open a rescheduling modal)
  const handleRescheduleAppointment = (id: string) => {
    // For demo purposes, we'll just show an alert
    alert(`Reschedule functionality would open a modal for appointment ${id}`);
    
    // In a real implementation, you would open a modal to select a new date and time
    // Then call rescheduleAppointment(id, newDate, newTime)
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
        <p className="text-gray-600">
          Manage your appointments and health information
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Profile</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <User size={48} className="text-blue-500" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">John Doe</h3>
                  <p className="text-gray-600 mt-1">Patient ID: P12345</p>
                </div>
              </div>
              <Button variant="secondary" fullWidth className="mb-2">
                Edit Profile
              </Button>
              <Button variant="secondary" fullWidth>
                Health Records
              </Button>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Quick Stats</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar size={20} className="text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Next Appointment</p>
                    <p className="text-gray-600 text-sm">
                      {upcomingAppointments.length > 0
                        ? `${upcomingAppointments[0].date} at ${upcomingAppointments[0].time}`
                        : 'No upcoming appointments'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User size={20} className="text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Next Doctor</p>
                    <p className="text-gray-600 text-sm">
                      {upcomingAppointments.length > 0
                        ? `${upcomingAppointments[0].doctorName}`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock size={20} className="text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Total Appointments</p>
                    <p className="text-gray-600 text-sm">
                      {appointments.length} ({upcomingAppointments.length} upcoming)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin size={20} className="text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Primary Location</p>
                    <p className="text-gray-600 text-sm">
                      Main Hospital
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <h2 className="text-xl font-semibold">My Appointments</h2>
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
              </div>
              
              <div className="mt-4">
                <Input
                  placeholder="Search by doctor name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search size={18} className="text-gray-400" />}
                />
              </div>
            </CardHeader>
            
            <CardBody>
              {activeTab === 'upcoming' && (
                <>
                  {filteredUpcoming.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="py-12 text-center">
                      <p className="text-gray-500 text-lg mb-4">No upcoming appointments found.</p>
                      <Button
                        onClick={() => navigate('/chatbot')}
                      >
                        Book an Appointment
                      </Button>
                    </div>
                  )}
                </>
              )}
              
              {activeTab === 'past' && (
                <>
                  {filteredPast.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredPast.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-gray-500 text-lg">No past appointments found.</p>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Health Reminders</h2>
              </CardHeader>
              <CardBody>
                <ul className="space-y-3">
                  <li className="flex items-center p-2 bg-blue-50 rounded-md">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Calendar size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Annual Check-up Due</p>
                      <p className="text-xs text-gray-600">Schedule your annual physical examination</p>
                    </div>
                  </li>
                  <li className="flex items-center p-2 bg-green-50 rounded-md">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Calendar size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Vaccination Reminder</p>
                      <p className="text-xs text-gray-600">Flu shot available starting next month</p>
                    </div>
                  </li>
                </ul>
              </CardBody>
            </Card>
            
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Quick Actions</h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/chatbot')}
                    fullWidth
                  >
                    New Appointment
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => alert('This would open the prescription refill form')}
                    fullWidth
                  >
                    Refill Prescription
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => alert('This would open the medical records')}
                    fullWidth
                  >
                    View Records
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => alert('This would open the messaging interface')}
                    fullWidth
                  >
                    Message Doctor
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;