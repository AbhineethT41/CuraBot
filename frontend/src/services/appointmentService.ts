import { api } from '../lib/api';
import { Doctor } from '../components/appointments/DoctorCard';
import { Appointment } from '../components/appointments/AppointmentCard';

/**
 * Service for handling appointment-related API calls
 */
export const appointmentService = {
  /**
   * Get all doctors
   * @returns List of doctors
   */
  async getDoctors(): Promise<Doctor[]> {
    try {
      const response = await api.get('/doctors');
      
      // Transform the response data to match the Doctor interface
      return response.data.map((doctor: any) => ({
        id: doctor.id,
        name: `${doctor.first_name} ${doctor.last_name}`,
        specialty: doctor.specialty,
        image: `/assets/doctors/${doctor.id}.jpg`,
        rating: 4.5, // Default rating
        experience: doctor.years_of_experience || 5,
        location: 'Main Hospital',
        phone: doctor.phone || '123-456-7890',
        availableSlots: doctor.available_slots || []
      }));
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return []; // Return empty array instead of throwing
    }
  },

  /**
   * Get doctors by specialty
   * @param specialtyId - Specialty ID or name
   * @returns List of doctors in the specified specialty
   */
  async getDoctorsBySpecialty(specialtyId: string): Promise<Doctor[]> {
    try {
      // The correct route is /doctors/specialty/:id
      const response = await api.get(`/doctors/specialty/${specialtyId}`);
      
      // Transform the response data to match the Doctor interface
      return response.data.map((doctor: any) => ({
        id: doctor.id,
        name: `${doctor.first_name} ${doctor.last_name}`,
        specialty: doctor.specialty,
        image: `/assets/doctors/${doctor.id}.jpg`,
        rating: 4.5, // Default rating
        experience: doctor.years_of_experience || 5,
        location: 'Main Hospital',
        phone: doctor.phone || '123-456-7890',
        availableSlots: doctor.available_slots || []
      }));
    } catch (error) {
      console.error('Error fetching doctors by specialty:', error);
      return []; // Return empty array instead of throwing
    }
  },

  /**
   * Get a doctor by ID
   * @param id - Doctor ID
   * @returns Doctor details
   */
  async getDoctorById(id: string): Promise<Doctor | null> {
    try {
      const response = await api.get(`/doctors/${id}`);
      
      // Transform the response data to match the Doctor interface
      const doctor = response.data;
      return {
        id: doctor.id,
        name: `${doctor.first_name} ${doctor.last_name}`,
        specialty: doctor.specialty,
        image: `/assets/doctors/${doctor.id}.jpg`,
        rating: 4.5, // Default rating
        experience: doctor.years_of_experience || 5,
        location: 'Main Hospital',
        phone: doctor.phone || '123-456-7890',
        availableSlots: doctor.available_slots || []
      };
    } catch (error) {
      console.error(`Error fetching doctor with ID ${id}:`, error);
      return null;
    }
  },

  /**
   * Get available time slots for a doctor
   * @param doctorId - Doctor ID
   * @returns Available time slots
   */
  async getAvailableSlots(doctorId: string): Promise<{ date: string; slots: string[] }[]> {
    try {
      const response = await api.get(`/doctors/${doctorId}/available-slots`);
      
      // Ensure the response data is in the correct format
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        // If the response is an object with dates as keys
        const formattedSlots = Object.entries(response.data).map(([date, slots]) => ({
          date,
          slots: Array.isArray(slots) ? slots : []
        }));
        return formattedSlots;
      }
      
      return [];
    } catch (error) {
      console.error(`Error fetching available slots for doctor ${doctorId}:`, error);
      return []; // Return empty array instead of throwing
    }
  },

  /**
   * Get all appointments for the current user
   * @returns List of appointments
   */
  async getAppointments(): Promise<Appointment[]> {
    try {
      const response = await api.get('/appointments');
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return []; // Return empty array instead of throwing
    }
  },

  /**
   * Book a new appointment
   * @param doctorId - Doctor ID
   * @param date - Appointment date
   * @param time - Appointment time
   * @param notes - Appointment notes
   * @returns Created appointment
   */
  async bookAppointment(doctorId: string, date: string, time: string, notes?: string): Promise<Appointment> {
    try {
      const response = await api.post('/appointments', {
        doctorId,
        date,
        time,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error; // We need to throw here to handle the error in the UI
    }
  },

  /**
   * Cancel an appointment
   * @param appointmentId - Appointment ID
   * @returns Success status
   */
  async cancelAppointment(appointmentId: string): Promise<void> {
    try {
      await api.delete(`/appointments/${appointmentId}`);
    } catch (error) {
      console.error(`Error cancelling appointment ${appointmentId}:`, error);
      throw error; // We need to throw here to handle the error in the UI
    }
  },

  /**
   * Reschedule an appointment
   * @param appointmentId - Appointment ID
   * @param newDate - New appointment date
   * @param newTime - New appointment time
   * @returns Updated appointment
   */
  async rescheduleAppointment(appointmentId: string, newDate: string, newTime: string): Promise<Appointment> {
    try {
      const response = await api.put(`/appointments/${appointmentId}/reschedule`, {
        date: newDate,
        time: newTime,
      });
      return response.data;
    } catch (error) {
      console.error(`Error rescheduling appointment ${appointmentId}:`, error);
      throw error; // We need to throw here to handle the error in the UI
    }
  },
};
