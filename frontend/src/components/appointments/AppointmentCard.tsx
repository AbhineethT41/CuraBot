import React from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Card, CardBody, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { format } from 'date-fns';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
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
  const statusColors = {
    upcoming: 'success',
    completed: 'secondary',
    cancelled: 'danger',
  };
  
  const isUpcoming = appointment.status === 'upcoming';
  const appointmentDate = new Date(appointment.date);
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');
  
  return (
    <Card className="h-full flex flex-col">
      <CardBody className="flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <img
              src={appointment.doctorImage}
              alt={appointment.doctorName}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div>
              <h3 className="font-medium">{appointment.doctorName}</h3>
              <p className="text-sm text-gray-600">{appointment.doctorSpecialty}</p>
            </div>
          </div>
          <Badge variant={statusColors[appointment.status] as any}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2 text-gray-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2 text-gray-400" />
            <span>{appointment.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2 text-gray-400" />
            <span>{appointment.location}</span>
          </div>
          {appointment.notes && (
            <div className="mt-3 p-2 bg-gray-50 rounded-md text-sm text-gray-700">
              <p className="font-medium mb-1">Notes:</p>
              <p>{appointment.notes}</p>
            </div>
          )}
        </div>
      </CardBody>
      
      {isUpcoming && (
        <CardFooter className="border-t border-gray-100 pt-4 flex space-x-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => onReschedule && onReschedule(appointment.id)}
          >
            Reschedule
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => onCancel && onCancel(appointment.id)}
          >
            Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AppointmentCard;