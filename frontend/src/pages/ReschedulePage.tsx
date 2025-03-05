import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAppointmentStore } from '../store/appointmentStore';
import RescheduleModal from '../components/appointments/RescheduleModal';
import { Appointment } from '../components/appointments/AppointmentCard';

const ReschedulePage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { fetchAppointments, appointments, rescheduleAppointment } = useAppointmentStore();
  
  useEffect(() => {
    const loadAppointment = async () => {
      setIsLoading(true);
      try {
        // Fetch appointments if they haven't been loaded yet
        if (appointments.length === 0) {
          await fetchAppointments();
        }
        
        // Find the appointment
        const foundAppointment = appointments.find(a => a.id === appointmentId);
        
        if (foundAppointment) {
          setAppointment(foundAppointment);
        } else {
          setError('Appointment not found');
        }
      } catch (err) {
        setError('Failed to load appointment details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAppointment();
  }, [appointmentId, appointments, fetchAppointments]);
  
  const handleReschedule = (appointmentId: string, newDate: string, newTime: string) => {
    rescheduleAppointment(appointmentId, newDate, newTime)
      .then(() => {
        setShowModal(false);
        navigate('/dashboard');
      })
      .catch(err => {
        console.error('Error rescheduling appointment:', err);
      });
  };
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Loading appointment details...</p>
      </div>
    );
  }
  
  if (error || !appointment) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error || 'Appointment not found'}</p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => navigate('/dashboard')}
          leftIcon={<ArrowLeft size={18} />}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Button
        variant="secondary"
        className="mb-6"
        onClick={() => navigate('/dashboard')}
        leftIcon={<ArrowLeft size={18} />}
      >
        Back to Dashboard
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reschedule Appointment</h1>
        <p className="text-gray-600">
          Review your appointment details and select a new date and time
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Current Appointment Details</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-start">
            <img
              src={appointment.doctorImage}
              alt={appointment.doctorName}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">{appointment.doctorName}</h3>
              <p className="text-gray-600">{appointment.doctorSpecialty}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-2 text-gray-400" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User size={16} className="mr-2 text-gray-400" />
                  <span>Patient: John Doe</span>
                </div>
              </div>
              
              {appointment.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium mb-1">Notes:</p>
                  <p className="text-sm text-gray-700">{appointment.notes}</p>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
      
      <div className="text-center">
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowModal(true)}
        >
          Select New Date & Time
        </Button>
      </div>
      
      {showModal && (
        <RescheduleModal
          appointment={appointment}
          onClose={() => setShowModal(false)}
          onReschedule={handleReschedule}
        />
      )}
    </div>
  );
};

export default ReschedulePage;
