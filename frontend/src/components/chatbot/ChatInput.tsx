import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import Button from '../ui/Button';
import VoiceInput from './VoiceInput';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimResult, setInterimResult] = useState('');
  
  // Clear interim result when not listening
  useEffect(() => {
    if (!isListening) {
      setInterimResult('');
    }
  }, [isListening]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If we're listening, send the interim result
    if (isListening) {
      if (interimResult.trim() && !isLoading) {
        onSendMessage(interimResult);
        setInterimResult('');
        setIsListening(false); // Stop listening after sending
      }
    } else {
      // Otherwise send the typed message
      if (message.trim() && !isLoading) {
        onSendMessage(message);
        setMessage('');
      }
    }
  };
  
  const handleVoiceInput = (text: string) => {
    // For final results from voice recognition
    console.log('Final voice input received:', text);
    
    // Automatically send the message after voice input
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setMessage('');
      setInterimResult('');
    }
  };
  
  const handleInterimResult = (text: string) => {
    // For interim results - display them in the input field
    console.log('Interim result:', text);
    setInterimResult(text);
  };
  
  return (
    <div className="border-t border-gray-200">
      {/* Voice input status indicator */}
      {isListening && (
        <div className="px-4 pt-2 flex items-center">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Listening: </span>
            {interimResult || "Say something..."}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-center p-4">
        <VoiceInput 
          onSpeechResult={handleVoiceInput}
          onInterimResult={handleInterimResult}
          isListening={isListening}
          setIsListening={setIsListening}
          disabled={isLoading}
        />
        <input
          type="text"
          value={isListening ? interimResult : message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isListening ? "Listening..." : "Type your message here..."}
          className={`flex-grow mx-2 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isListening ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
          disabled={isLoading}
          readOnly={isListening}
        />
        <Button
          type="submit"
          variant="primary"
          className="rounded-l-none"
          disabled={(!message.trim() && !interimResult.trim()) || isLoading}
          isLoading={isLoading}
          rightIcon={<Send size={16} />}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;