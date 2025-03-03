import { create } from 'zustand';
import { Message } from '../components/chatbot/ChatMessage';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentSymptoms: string[];
  recommendedSpecialty: string | null;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  sendMessage: (text: string) => void;
  resetChat: () => void;
  setRecommendedSpecialty: (specialty: string) => void;
  addSymptom: (symptom: string) => void;
  removeSymptom: (symptom: string) => void;
  clearSymptoms: () => void;
}

// Mock data for symptom analysis
const symptomToSpecialty: Record<string, string> = {
  'headache': 'Neurology',
  'migraine': 'Neurology',
  'dizziness': 'Neurology',
  'chest pain': 'Cardiology',
  'heart palpitations': 'Cardiology',
  'shortness of breath': 'Pulmonology',
  'cough': 'Pulmonology',
  'stomach pain': 'Gastroenterology',
  'nausea': 'Gastroenterology',
  'joint pain': 'Orthopedics',
  'back pain': 'Orthopedics',
  'rash': 'Dermatology',
  'skin irritation': 'Dermatology',
  'fever': 'General Medicine',
  'sore throat': 'ENT',
  'ear pain': 'ENT',
  'vision problems': 'Ophthalmology',
  'eye pain': 'Ophthalmology',
  'anxiety': 'Psychiatry',
  'depression': 'Psychiatry',
};

// Helper function to analyze symptoms and recommend a specialty
const analyzeSymptoms = (symptoms: string[]): string => {
  if (symptoms.length === 0) return 'General Medicine';
  
  const specialtyCounts: Record<string, number> = {};
  
  symptoms.forEach(symptom => {
    const normalizedSymptom = symptom.toLowerCase();
    
    // Check if we have a direct match for this symptom
    for (const [key, specialty] of Object.entries(symptomToSpecialty)) {
      if (normalizedSymptom.includes(key)) {
        specialtyCounts[specialty] = (specialtyCounts[specialty] || 0) + 1;
      }
    }
  });
  
  // Find the specialty with the highest count
  let maxCount = 0;
  let recommendedSpecialty = 'General Medicine';
  
  for (const [specialty, count] of Object.entries(specialtyCounts)) {
    if (count > maxCount) {
      maxCount = count;
      recommendedSpecialty = specialty;
    }
  }
  
  return recommendedSpecialty;
};

// Generate a unique ID for messages
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Initial welcome message
const welcomeMessage: Message = {
  id: generateId(),
  sender: 'bot',
  text: 'Hello! I\'m CuraBot, your hospital assistant. How can I help you today? You can describe your symptoms, and I\'ll recommend the right specialist for you.',
  timestamp: new Date(),
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [welcomeMessage],
  isLoading: false,
  currentSymptoms: [],
  recommendedSpecialty: null,
  
  addMessage: (message) => {
    const newMessage: Message = {
      id: generateId(),
      timestamp: new Date(),
      ...message,
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },
  
  sendMessage: async (text) => {
    // Add user message
    get().addMessage({ sender: 'user', text });
    
    // Set loading state
    set({ isLoading: true });
    
    // Extract potential symptoms from the message
    const userMessage = text.toLowerCase();
    const foundSymptoms: string[] = [];
    
    Object.keys(symptomToSpecialty).forEach(symptom => {
      if (userMessage.includes(symptom)) {
        foundSymptoms.push(symptom);
        get().addSymptom(symptom);
      }
    });
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate bot response based on the message content
    let botResponse = '';
    
    if (foundSymptoms.length > 0) {
      const specialty = analyzeSymptoms(get().currentSymptoms);
      get().setRecommendedSpecialty(specialty);
      
      botResponse = `Based on your symptoms (${foundSymptoms.join(', ')}), I recommend seeing a ${specialty} specialist. Would you like to see available doctors in this department?`;
    } else if (userMessage.includes('doctor') || userMessage.includes('appointment')) {
      botResponse = 'I can help you find the right doctor and book an appointment. Could you please describe your symptoms first?';
    } else if (userMessage.includes('thank')) {
      botResponse = 'You\'re welcome! Is there anything else I can help you with?';
    } else if (userMessage.includes('yes') && get().recommendedSpecialty) {
      botResponse = `Great! I'll show you available ${get().recommendedSpecialty} specialists. You can view their profiles and book an appointment.`;
    } else if (userMessage.includes('no') && get().recommendedSpecialty) {
      botResponse = 'No problem. Is there anything else I can help you with?';
    } else {
      botResponse = 'I\'m here to help you find the right medical specialist. Could you please describe your symptoms so I can recommend the appropriate doctor?';
    }
    
    // Add bot response
    get().addMessage({ sender: 'bot', text: botResponse });
    
    // Reset loading state
    set({ isLoading: false });
  },
  
  resetChat: () => {
    set({
      messages: [welcomeMessage],
      currentSymptoms: [],
      recommendedSpecialty: null,
    });
  },
  
  setRecommendedSpecialty: (specialty) => {
    set({ recommendedSpecialty: specialty });
  },
  
  addSymptom: (symptom) => {
    set((state) => ({
      currentSymptoms: state.currentSymptoms.includes(symptom)
        ? state.currentSymptoms
        : [...state.currentSymptoms, symptom],
    }));
  },
  
  removeSymptom: (symptom) => {
    set((state) => ({
      currentSymptoms: state.currentSymptoms.filter(s => s !== symptom),
    }));
  },
  
  clearSymptoms: () => {
    set({ currentSymptoms: [] });
  },
}));