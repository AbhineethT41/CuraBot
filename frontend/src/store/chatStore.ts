import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { api } from '../lib/api';

export type MessageRole = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string;
  email?: string;
  phone?: string;
  years_of_experience?: number;
}

interface ChatState {
  messages: ChatMessage[];
  currentSymptoms: string[];
  recommendedSpecialty: string | null;
  recommendedDoctors: Doctor[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  sendMessage: (content: string) => Promise<void>;
  addBotMessage: (content: string) => void;
  resetChat: () => void;
  removeSymptom: (symptom: string) => void;
  setRecommendedSpecialty: (specialty: string) => void;
  setRecommendedDoctors: (doctors: Doctor[]) => void;
}

const WELCOME_MESSAGE = "Hello! I'm CuraBot, your healthcare assistant. Please describe your symptoms, and I'll help you find the right specialist.";

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: uuidv4(),
      role: 'bot',
      content: WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ],
  currentSymptoms: [],
  recommendedSpecialty: null,
  recommendedDoctors: [],
  isLoading: false,
  error: null,
  
  sendMessage: async (content: string) => {
    try {
      // Don't process empty messages
      if (!content.trim()) return;
      
      // Add user message to state
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      
      set((state) => ({
        messages: [...state.messages, userMessage],
        isLoading: true,
        error: null,
      }));
      
      // Send message to backend API
      const response = await api.post('/chatbot/message', {
        message: content,
        symptoms: get().currentSymptoms,
      });
      
      // Extract data from response
      const { 
        reply, 
        symptoms = [], 
        specialty = null, 
        doctors = [] 
      } = response.data;
      
      // Create bot response message
      const botMessage: ChatMessage = {
        id: uuidv4(),
        role: 'bot',
        content: reply,
        timestamp: new Date(),
      };
      
      // Update state with bot message and any extracted symptoms/recommendations
      set((state) => {
        // Merge new symptoms with existing ones (avoiding duplicates)
        const updatedSymptoms = [...new Set([...state.currentSymptoms, ...symptoms])];
        
        return {
          messages: [...state.messages, botMessage],
          currentSymptoms: updatedSymptoms,
          recommendedSpecialty: specialty || state.recommendedSpecialty,
          recommendedDoctors: doctors.length > 0 ? doctors : state.recommendedDoctors,
          isLoading: false,
        };
      });
    } catch (error: any) {
      console.error('Error sending message to chatbot:', error);
      
      // Add error message from bot
      const errorMessage = {
        id: uuidv4(),
        role: 'bot',
        content: "I'm sorry, I'm having trouble processing your request. Please try again later.",
        timestamp: new Date(),
      };
      
      set((state) => ({
        messages: [...state.messages, errorMessage],
        isLoading: false,
        error: error.message || 'Failed to get response from chatbot',
      }));
    }
  },
  
  addBotMessage: (content: string) => {
    const botMessage: ChatMessage = {
      id: uuidv4(),
      role: 'bot',
      content,
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, botMessage],
    }));
  },
  
  resetChat: () => {
    set({
      messages: [
        {
          id: uuidv4(),
          role: 'bot',
          content: WELCOME_MESSAGE,
          timestamp: new Date(),
        },
      ],
      currentSymptoms: [],
      recommendedSpecialty: null,
      recommendedDoctors: [],
      error: null,
    });
  },
  
  removeSymptom: (symptom: string) => {
    set((state) => ({
      currentSymptoms: state.currentSymptoms.filter((s) => s !== symptom),
    }));
  },
  
  setRecommendedSpecialty: (specialty: string) => {
    set({ recommendedSpecialty: specialty });
  },
  
  setRecommendedDoctors: (doctors: Doctor[]) => {
    set({ recommendedDoctors: doctors });
  },
}));