import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import Button from '../ui/Button';

// Add SpeechRecognition type definitions
interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal?: boolean;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: any;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onstart: () => void;
}

// Add global type declarations
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Initialize speech recognition if available
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setMessage(transcript);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          setIsRecording(false);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);
  
  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      
      // Focus the input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        // If already started, stop and restart
        recognitionRef.current.stop();
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.start();
          }
        }, 100);
      }
    }
    
    setIsRecording(!isRecording);
  };
  
  return (
    <div className="border-t border-gray-200 p-3 bg-white">
      <div className="flex items-end space-x-2">
        <div className="flex-grow relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
            disabled={isLoading}
          />
          
          {isRecording && (
            <div className="absolute right-3 top-2 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
              <span className="text-xs text-gray-500">Recording...</span>
            </div>
          )}
        </div>
        
        {('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={toggleRecording}
            disabled={isLoading}
            className={isRecording ? 'bg-red-100 text-red-600 hover:bg-red-200' : ''}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </Button>
        )}
        
        <Button
          type="button"
          variant="primary"
          size="icon"
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;