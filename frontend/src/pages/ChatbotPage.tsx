import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Volume2, VolumeX } from 'lucide-react';
import ChatMessage from '../components/chatbot/ChatMessage';
import ChatInput from '../components/chatbot/ChatInput';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useChatStore } from '../store/chatStore';
import { useAppointmentStore } from '../store/appointmentStore';

// Create a context for voice settings
export const VoiceContext = React.createContext({
  isVoiceEnabled: true,
  toggleVoice: () => {}
});

const ChatbotPage: React.FC = () => {
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  
  const {
    messages,
    isLoading,
    currentSymptoms,
    recommendedSpecialty,
    sendMessage,
    resetChat,
    removeSymptom,
  } = useChatStore();
  
  const { getDoctorsBySpecialty } = useAppointmentStore();
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };
  
  const handleViewDoctors = () => {
    if (recommendedSpecialty) {
      getDoctorsBySpecialty(recommendedSpecialty);
      navigate('/appointments');
    }
  };
  
  const handleRemoveSymptom = (symptom: string) => {
    removeSymptom(symptom);
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    // Cancel any ongoing speech when disabling voice
    if (isVoiceEnabled) {
      window.speechSynthesis?.cancel();
    }
  };
  
  return (
    <VoiceContext.Provider value={{ isVoiceEnabled, toggleVoice }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
          {/* Chat header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">CuraBot Assistant</h2>
              <p className="text-sm text-blue-100">Describe your symptoms to get started</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoice}
                className="text-white hover:bg-blue-500"
                title={isVoiceEnabled ? "Disable voice" : "Enable voice"}
              >
                {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={resetChat}
              >
                New Chat
              </Button>
            </div>
          </div>
          
          {/* Symptoms list */}
          {currentSymptoms.length > 0 && (
            <div className="bg-gray-50 p-3 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Your symptoms:</p>
              <div className="flex flex-wrap gap-2">
                {currentSymptoms.map((symptom, index) => (
                  <Badge key={index} variant="primary" className="flex items-center">
                    {symptom}
                    <button
                      onClick={() => handleRemoveSymptom(symptom)}
                      className="ml-1 p-0.5 rounded-full hover:bg-blue-200 focus:outline-none"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Recommendation banner */}
          {recommendedSpecialty && (
            <div className="bg-green-50 p-3 border-b border-green-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Recommended specialty:</span> {recommendedSpecialty}
                </p>
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleViewDoctors}
                >
                  View Available Doctors
                </Button>
              </div>
            </div>
          )}
          
          {/* Chat messages */}
          <div
            ref={chatContainerRef}
            className="flex-grow p-4 overflow-y-auto"
          >
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
          
          {/* Chat input */}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </VoiceContext.Provider>
  );
};

export default ChatbotPage;