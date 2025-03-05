import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import Button from '../ui/Button';
import { Appointment } from './AppointmentCard';
import { useAppointmentStore } from '../../store/appointmentStore';

interface RescheduleModalProps {
  appointment: Appointment;
  onClose: () => void;
  onReschedule: (appointmentId: string, newDate: string, newTime: string) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  appointment,
  onClose,
  onReschedule,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<{date: string, slots: string[]}[]>([]);
  
  const { getAvailableSlots } = useAppointmentStore();
  
  // Fetch available slots when component mounts
  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoading(true);
      try {
        const slots = await getAvailableSlots(appointment.doctorId);
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching available slots:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSlots();
  }, [appointment.doctorId, getAvailableSlots]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDate && selectedTime) {
      setIsLoading(true);
      onReschedule(appointment.id, selectedDate, selectedTime);
    }
  };
  
  const getAvailableTimesForDate = (date: string) => {
    const dateSlot = availableSlots.find(slot => slot.date === date);
    return dateSlot ? dateSlot.slots : [];
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X size={20} />
            </button>
          </div>
          
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Reschedule Appointment
                </h3>
                
                <div className="mt-4">
                  <div className="flex items-center mb-4">
                    <img
                      src={appointment.doctorImage}
                      alt={appointment.doctorName}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <div>
                      <h4 className="font-medium">{appointment.doctorName}</h4>
                      <p className="text-sm text-gray-600">{appointment.doctorSpecialty}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Current appointment: {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  
                  {isLoading && !availableSlots.length ? (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">Loading available slots...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Calendar size={16} className="inline mr-1" /> Select New Date
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot.date}
                              type="button"
                              className={`py-2 px-3 text-sm border rounded-md focus:outline-none ${
                                selectedDate === slot.date
                                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                              onClick={() => {
                                setSelectedDate(slot.date);
                                setSelectedTime(null);
                              }}
                            >
                              {slot.date}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {selectedDate && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Clock size={16} className="inline mr-1" /> Select New Time
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {getAvailableTimesForDate(selectedDate).map((time) => (
                              <button
                                key={time}
                                type="button"
                                className={`py-2 px-2 text-sm border rounded-md focus:outline-none ${
                                  selectedTime === time
                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                    : 'border-gray-300 hover:bg-gray-50'
                                }`}
                                onClick={() => setSelectedTime(time)}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={isLoading}
                          disabled={!selectedDate || !selectedTime || isLoading}
                          className="w-full sm:ml-3 sm:w-auto"
                        >
                          Confirm Reschedule
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={onClose}
                          className="mt-3 w-full sm:mt-0 sm:w-auto"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
