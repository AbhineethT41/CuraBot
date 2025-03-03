import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAppointmentStore } from '../store/appointmentStore';

const DoctorDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past'>('today');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const { appointments } = useAppointmentStore();
  
  // Filter appointments for the doctor dashboard
  // In a real app, this would filter by the logged-in doctor's ID
  const doctorAppointments = appointments.filter(appointment => 
    appointment.doctorId === 'd1' || appointment.doctorId === 'd2'
  );
  
  const todayAppointments = doctorAppointments.filter(
    appointment => appointment.date === '2025-06-05' && appointment.status === 'upcoming'
  );
  
  const upcomingAppointments = doctorAppointments.filter(
    appointment => 
      appointment.status === 'upcoming' && 
      appointment.date !== '2025-06-05'
  );
  
  const pastAppointments = doctorAppointments.filter(
    appointment => appointment.status === 'completed' || appointment.status === 'cancelled'
  );
  
  const handleCompleteAppointment = (id: string) => {
    // In a real app, this would update the appointment status
    alert(`Appointment ${id} marked as completed`);
  };
  
  const handleCancelAppointment = (id: string) => {
    // In a real app, this would update the appointment status
    alert(`Appointment ${id} cancelled`);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
        <p className="text-gray-600">
          Manage your appointments and patient schedule
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Doctor Profile</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                  alt="Dr. Sarah Johnson"
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <div className="text-center">
                  <h3 className="font-semibold text-lg">Dr. Sarah Johnson</h3>
                  <Badge variant="primary" className="mt-1">Cardiology</Badge>
                  <p className="text-gray-600 mt-2">12 years experience</p>
                </div>
              </div>
              <Button variant="secondary" fullWidth className="mb-2">
                Edit Profile
              </Button>
              <Button variant="secondary" fullWidth>
                Manage Schedule
              </Button>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Today's Summary</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar size={20} className="text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-600 text-sm">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock size={20} className="text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Appointments Today</p>
                    <p className="text-gray-600 text-sm">
                      {todayAppointments.length} scheduled
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User size={20} className="text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Next Patient</p>
                    <p className="text-gray-600 text-sm">
                      {todayAppointments.length > 0
                        ? `${todayAppointments[0].time} - John Doe`
                        : 'No patients scheduled'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin size={20} className="text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600 text-sm">
                      Main Hospital, Floor 3
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
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Appointments</h2>
                <div className="flex space-x-2">
                  <Button
                    variant={activeTab === 'today' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setActiveTab('today')}
                  >
                    Today
                  </Button>
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
            </CardHeader>
            <CardBody>
              {activeTab === 'today' && (
                <>
                  {todayAppointments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Patient
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reason
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {todayAppointments.map((appointment) => (
                            <tr key={appointment.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {appointment.time}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User size={16} className="text-gray-500" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      John Doe
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      ID: P-12345
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {appointment.notes || 'Regular checkup'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="success">
                                  Confirmed
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => handleCompleteAppointment(appointment.id)}
                                  >
                                    <CheckCircle size={16} className="mr-1" /> Complete
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                  >
                                    <XCircle size={16} className="mr-1" /> Cancel
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You don't have any appointments scheduled for today.</p>
                      <Button variant="secondary">
                        Add Availability
                      </Button>
                    </div>
                  )}
                </>
              )}
              
              {activeTab === 'upcoming' && (
                <>
                  {upcomingAppointments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Patient
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reason
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {upcomingAppointments.map((appointment) => (
                            <tr key={appointment.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {appointment.date} at {appointment.time}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User size={16} className="text-gray-500" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      Jane Smith
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      ID: P-67890
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {appointment.notes || 'Regular checkup'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="success">
                                  Confirmed
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                >
                                  Cancel
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">You don't have any upcoming appointments scheduled.</p>
                    </div>
                  )}
                </>
              )}
              
              {activeTab === 'past' && (
                <>
                  {pastAppointments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Patient
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reason
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pastAppointments.map((appointment) => (
                            <tr key={appointment.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {appointment.date} at {appointment.time}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User size={16} className="text-gray-500" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      Michael Brown
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      ID: P-54321
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {appointment.notes || 'Regular checkup'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge
                                  variant={appointment.status === 'completed' ? 'secondary' : 'danger'}
                                >
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">You don't have any past appointments.</p>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;