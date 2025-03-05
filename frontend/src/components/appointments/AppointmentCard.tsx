import React from 'react';
import { Calendar, Clock, MapPin, X, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  date: string;
  time: string;
  status: string;
  location: string;
  notes?: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  onReschedule,
}) => {
  const isPast = appointment.status === 'completed' || appointment.status === 'cancelled';
  
  const getStatusBadge = () => {
    switch (appointment.status) {
      case 'upcoming':
        return <Badge variant="primary">Upcoming</Badge>;
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="primary">Scheduled</Badge>;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
      <div className="flex items-start">
        <img
          src={appointment.doctorImage}
          alt={appointment.doctorName}
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
              <p className="text-gray-600 text-sm">{appointment.doctorSpecialty}</p>
            </div>
            <div className="mt-2 sm:mt-0">{getStatusBadge()}</div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2 text-gray-400" />
              <span>{appointment.date}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-2 text-gray-400" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 sm:col-span-2">
              <MapPin size={16} className="mr-2 text-gray-400" />
              <span>{appointment.location}</span>
            </div>
          </div>
          
          {appointment.notes && (
            <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
              <p className="font-medium mb-1">Notes:</p>
              <p>{appointment.notes}</p>
            </div>
          )}
          
          {!isPast && onCancel && onReschedule && (
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onReschedule(appointment.id)}
                leftIcon={<RefreshCw size={14} />}
              >
                Reschedule
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onCancel(appointment.id)}
                leftIcon={<X size={14} />}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;