import React from 'react';
import { Calendar, Clock, MapPin, Phone } from 'lucide-react';
import { Card, CardBody, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience: number;
  location: string;
  phone: string;
  availableSlots: {
    date: string;
    slots: string[];
  }[];
}

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBookAppointment }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardBody className="flex-grow">
        <div className="flex items-start">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-20 h-20 rounded-full object-cover mr-4"
          />
          <div>
            <h3 className="text-lg font-semibold">{doctor.name}</h3>
            <Badge variant="primary" className="mt-1">
              {doctor.specialty}
            </Badge>
            <div className="flex items-center mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < doctor.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-600">
                ({doctor.rating.toFixed(1)})
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {doctor.experience} years of experience
            </p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2 text-gray-400" />
            <span>{doctor.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone size={16} className="mr-2 text-gray-400" />
            <span>{doctor.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2 text-gray-400" />
            <span>Next available: {doctor.availableSlots[0]?.date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {doctor.availableSlots[0]?.slots.slice(0, 3).map((slot, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  {slot}
                </Badge>
              ))}
              {doctor.availableSlots[0]?.slots.length > 3 && (
                <Badge variant="secondary" size="sm">
                  +{doctor.availableSlots[0].slots.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardBody>
      
      <CardFooter className="border-t border-gray-100 pt-4">
        <Button
          variant="primary"
          fullWidth
          onClick={() => onBookAppointment(doctor)}
        >
          Book Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;