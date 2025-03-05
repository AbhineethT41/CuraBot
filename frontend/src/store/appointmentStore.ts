import { create } from 'zustand';
import { appointmentService } from '../services/appointmentService';
import { Appointment } from '../components/appointments/AppointmentCard';
import { Doctor } from '../components/appointments/DoctorCard';

interface AppointmentStore {
  doctors: Doctor[];
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  selectedSpecialty: string | null;
  
  // Fetch doctors
  fetchDoctors: () => Promise<void>;
  
  // Get doctors by specialty
  getDoctorsBySpecialty: (specialty: string) => Promise<void>;
  
  // Fetch appointments
  fetchAppointments: () => Promise<void>;
  
  // Get upcoming appointments
  getUpcomingAppointments: () => Appointment[];
  
  // Get past appointments
  getPastAppointments: () => Appointment[];
  
  // Book a new appointment
  bookAppointment: (doctorId: string, date: string, time: string, notes?: string) => Promise<void>;
  
  // Cancel an appointment
  cancelAppointment: (appointmentId: string) => Promise<void>;
  
  // Reschedule an appointment
  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => Promise<void>;
  
  // Get available slots for a doctor
  getAvailableSlots: (doctorId: string) => Promise<{ date: string; slots: string[] }[]>;
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  doctors: [],
  appointments: [],
  isLoading: false,
  error: null,
  selectedSpecialty: null,
  
  // Fetch doctors
  fetchDoctors: async () => {
    set({ isLoading: true, error: null });
    try {
      const doctors = await appointmentService.getDoctors();
      set({ doctors, isLoading: false, selectedSpecialty: null });
    } catch (error) {
      set({ error: 'Failed to fetch doctors', isLoading: false });
      console.error('Error fetching doctors:', error);
    }
  },
  
  // Get doctors by specialty
  getDoctorsBySpecialty: async (specialty: string) => {
    set({ isLoading: true, error: null, selectedSpecialty: specialty });
    try {
      const doctors = await appointmentService.getDoctorsBySpecialty(specialty);
      // Only update state if doctors were found
      if (doctors.length > 0) {
        set({ doctors, isLoading: false });
      } else {
        set({ 
          error: `No doctors found for specialty: ${specialty}`, 
          isLoading: false,
          doctors: [] 
        });
      }
    } catch (error) {
      set({ 
        error: `Failed to fetch doctors for specialty: ${specialty}`, 
        isLoading: false 
      });
      console.error(`Error fetching doctors for specialty ${specialty}:`, error);
    }
  },
  
  // Fetch appointments
  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const appointments = await appointmentService.getAppointments();
      set({ appointments, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch appointments', isLoading: false });
      console.error('Error fetching appointments:', error);
    }
  },
  
  // Get upcoming appointments
  getUpcomingAppointments: () => {
    return get().appointments.filter(
      (appointment) => appointment.status === 'upcoming' || appointment.status === 'confirmed'
    );
  },
  
  // Get past appointments
  getPastAppointments: () => {
    return get().appointments.filter(
      (appointment) => appointment.status === 'completed' || appointment.status === 'cancelled'
    );
  },
  
  // Book a new appointment
  bookAppointment: async (doctorId: string, date: string, time: string, notes?: string) => {
    set({ isLoading: true, error: null });
    try {
      const newAppointment = await appointmentService.bookAppointment(doctorId, date, time, notes);
      set((state) => ({
        appointments: [...state.appointments, newAppointment],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to book appointment', isLoading: false });
      console.error('Error booking appointment:', error);
      throw error; // Re-throw to handle in UI
    }
  },
  
  // Cancel an appointment
  cancelAppointment: async (appointmentId: string) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentService.cancelAppointment(appointmentId);
      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: 'cancelled' }
            : appointment
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to cancel appointment', isLoading: false });
      console.error('Error cancelling appointment:', error);
      throw error; // Re-throw to handle in UI
    }
  },
  
  // Reschedule an appointment
  rescheduleAppointment: async (appointmentId: string, newDate: string, newTime: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAppointment = await appointmentService.rescheduleAppointment(
        appointmentId,
        newDate,
        newTime
      );
      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...updatedAppointment }
            : appointment
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to reschedule appointment', isLoading: false });
      console.error('Error rescheduling appointment:', error);
      throw error; // Re-throw to handle in UI
    }
  },
  
  // Get available slots for a doctor
  getAvailableSlots: async (doctorId: string) => {
    set({ isLoading: true, error: null });
    try {
      const slots = await appointmentService.getAvailableSlots(doctorId);
      
      // Update the doctor's available slots in the store
      set((state) => ({
        doctors: state.doctors.map((doctor) =>
          doctor.id === doctorId
            ? { ...doctor, availableSlots: slots }
            : doctor
        ),
        isLoading: false,
      }));
      
      return slots;
    } catch (error) {
      set({ error: 'Failed to fetch available slots', isLoading: false });
      console.error('Error fetching available slots:', error);
      return []; // Return empty array on error
    }
  },
}));