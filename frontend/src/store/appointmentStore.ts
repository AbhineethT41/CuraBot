import { create } from 'zustand';
import { Doctor } from '../components/appointments/DoctorCard';
import { Appointment } from '../components/appointments/AppointmentCard';

// Mock data for doctors
const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    experience: 12,
    location: 'Main Hospital, Floor 3',
    phone: '(555) 123-4567',
    availableSlots: [
      {
        date: '2025-06-10',
        slots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'],
      },
      {
        date: '2025-06-11',
        slots: ['11:00 AM', '01:30 PM', '03:00 PM'],
      },
      {
        date: '2025-06-12',
        slots: ['09:30 AM', '11:30 AM', '02:30 PM'],
      },
    ],
  },
  {
    id: 'd2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    rating: 4.9,
    experience: 15,
    location: 'Medical Center, Floor 2',
    phone: '(555) 234-5678',
    availableSlots: [
      {
        date: '2025-06-10',
        slots: ['08:30 AM', '11:00 AM', '03:30 PM'],
      },
      {
        date: '2025-06-11',
        slots: ['10:00 AM', '01:00 PM', '04:00 PM'],
      },
      {
        date: '2025-06-12',
        slots: ['09:00 AM', '12:30 PM', '03:00 PM'],
      },
    ],
  },
  {
    id: 'd3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    rating: 4.7,
    experience: 8,
    location: 'Medical Plaza, Floor 1',
    phone: '(555) 345-6789',
    availableSlots: [
      {
        date: '2025-06-10',
        slots: ['10:00 AM', '01:30 PM', '03:30 PM'],
      },
      {
        date: '2025-06-11',
        slots: ['09:30 AM', '12:00 PM', '02:30 PM'],
      },
      {
        date: '2025-06-12',
        slots: ['11:00 AM', '02:00 PM', '04:00 PM'],
      },
    ],
  },
  {
    id: 'd4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    rating: 4.6,
    experience: 10,
    location: 'Main Hospital, Floor 2',
    phone: '(555) 456-7890',
    availableSlots: [
      {
        date: '2025-06-10',
        slots: ['09:30 AM', '11:30 AM', '02:30 PM'],
      },
      {
        date: '2025-06-11',
        slots: ['10:30 AM', '01:30 PM', '03:30 PM'],
      },
      {
        date: '2025-06-12',
        slots: ['08:30 AM', '12:00 PM', '04:30 PM'],
      },
    ],
  },
  {
    id: 'd5',
    name: 'Dr. Olivia Thompson',
    specialty: 'Gastroenterology',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    experience: 11,
    location: 'Medical Center, Floor 3',
    phone: '(555) 567-8901',
    availableSlots: [
      {
        date: '2025-06-10',
        slots: ['08:00 AM', '10:00 AM', '01:00 PM', '03:00 PM'],
      },
      {
        date: '2025-06-11',
        slots: ['09:00 AM', '11:30 AM', '02:30 PM'],
      },
      {
        date: '2025-06-12',
        slots: ['10:30 AM', '01:30 PM', '04:00 PM'],
      },
    ],
  },
  {
    id: 'd6',
    name: 'Dr. Robert Kim',
    specialty: 'Pulmonology',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    rating: 4.7,
    experience: 9,
    location: 'Medical Plaza, Floor 2',
    phone: '(555) 678-9012',
    availableSlots: [
      {
        date: '2025-06-10',
        slots: ['09:00 AM', '11:00 AM', '02:00 PM'],
      },
      {
        date: '2025-06-11',
        slots: ['10:00 AM', '12:30 PM', '03:30 PM'],
      },
      {
        date: '2025-06-12',
        slots: ['08:30 AM', '01:00 PM', '04:30 PM'],
      },
    ],
  },
];

// Mock data for appointments
const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    doctorId: 'd1',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialty: 'Cardiology',
    doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    date: '2025-06-05',
    time: '10:30 AM',
    status: 'upcoming',
    location: 'Main Hospital, Floor 3',
    notes: 'Follow-up appointment for heart palpitations',
  },
  {
    id: 'a2',
    doctorId: 'd3',
    doctorName: 'Dr. Emily Rodriguez',
    doctorSpecialty: 'Dermatology',
    doctorImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    date: '2025-05-20',
    time: '09:00 AM',
    status: 'completed',
    location: 'Medical Plaza, Floor 1',
  },
  {
    id: 'a3',
    doctorId: 'd2',
    doctorName: 'Dr. Michael Chen',
    doctorSpecialty: 'Neurology',
    doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    date: '2025-05-15',
    time: '02:30 PM',
    status: 'cancelled',
    location: 'Medical Center, Floor 2',
  },
];

interface AppointmentState {
  doctors: Doctor[];
  appointments: Appointment[];
  filteredDoctors: Doctor[];
  isLoading: boolean;
  
  // Actions
  getDoctorsBySpecialty: (specialty: string) => Doctor[];
  bookAppointment: (doctorId: string, date: string, time: string, notes: string) => void;
  cancelAppointment: (appointmentId: string) => void;
  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => void;
  getUpcomingAppointments: () => Appointment[];
  getPastAppointments: () => Appointment[];
  getDoctorById: (id: string) => Doctor | undefined;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  doctors: mockDoctors,
  appointments: mockAppointments,
  filteredDoctors: [],
  isLoading: false,
  
  getDoctorsBySpecialty: (specialty: string) => {
    const filteredDocs = specialty
      ? get().doctors.filter(doc => doc.specialty === specialty)
      : get().doctors;
    
    set({ filteredDoctors: filteredDocs });
    return filteredDocs;
  },
  
  bookAppointment: (doctorId, date, time, notes) => {
    set({ isLoading: true });
    
    // Simulate API call
    setTimeout(() => {
      const doctor = get().doctors.find(doc => doc.id === doctorId);
      
      if (doctor) {
        const newAppointment: Appointment = {
          id: `a${Math.random().toString(36).substring(2, 9)}`,
          doctorId,
          doctorName: doctor.name,
          doctorSpecialty: doctor.specialty,
          doctorImage: doctor.image,
          date,
          time,
          status: 'upcoming',
          location: doctor.location,
          notes: notes || undefined,
        };
        
        set(state => ({
          appointments: [newAppointment, ...state.appointments],
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }
    }, 1000);
  },
  
  cancelAppointment: (appointmentId) => {
    set({ isLoading: true });
    
    // Simulate API call
    setTimeout(() => {
      set(state => ({
        appointments: state.appointments.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, status: 'cancelled' }
            : appointment
        ),
        isLoading: false,
      }));
    }, 1000);
  },
  
  rescheduleAppointment: (appointmentId, newDate, newTime) => {
    set({ isLoading: true });
    
    // Simulate API call
    setTimeout(() => {
      set(state => ({
        appointments: state.appointments.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, date: newDate, time: newTime }
            : appointment
        ),
        isLoading: false,
      }));
    }, 1000);
  },
  
  getUpcomingAppointments: () => {
    return get().appointments.filter(
      appointment => appointment.status === 'upcoming'
    );
  },
  
  getPastAppointments: () => {
    return get().appointments.filter(
      appointment => appointment.status === 'completed' || appointment.status === 'cancelled'
    );
  },
  
  getDoctorById: (id) => {
    return get().doctors.find(doctor => doctor.id === id);
  },
}));