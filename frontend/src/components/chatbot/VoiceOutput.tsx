import React, { useEffect, useRef, useState, useContext } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import Button from '../ui/Button';
import { VoiceContext } from '../../pages/ChatbotPage';

interface VoiceOutputProps {
  text: string;
  autoPlay?: boolean;
}

const VoiceOutput: React.FC<VoiceOutputProps> = ({ text, autoPlay = false }) => {
  const { isVoiceEnabled } = useContext(VoiceContext);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Track user interaction with the page
  useEffect(() => {
    const markUserInteraction = () => {
      setHasUserInteracted(true);
    };

    // Add event listeners for common user interactions
    window.addEventListener('click', markUserInteraction);
    window.addEventListener('keydown', markUserInteraction);
    window.addEventListener('touchstart', markUserInteraction);

    return () => {
      window.removeEventListener('click', markUserInteraction);
      window.removeEventListener('keydown', markUserInteraction);
      window.removeEventListener('touchstart', markUserInteraction);
    };
  }, []);

  // Initialize speech synthesis
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis is not supported in your browser.');
      return;
    }

    try {
      speechSynthRef.current = new SpeechSynthesisUtterance();
      speechSynthRef.current.lang = 'en-US';
      
      // Set default voice properties
      speechSynthRef.current.rate = 1.0;
      speechSynthRef.current.pitch = 1.0;
      speechSynthRef.current.volume = 1.0;
      
      speechSynthRef.current.onstart = () => setIsSpeaking(true);
      speechSynthRef.current.onend = () => setIsSpeaking(false);
      speechSynthRef.current.onerror = (event) => {
        console.error('Speech synthesis error', event);
        setIsSpeaking(false);
      };
    } catch (err) {
      console.error('Error initializing speech synthesis:', err);
    }

    return () => {
      if (speechSynthRef.current && isSpeaking) {
        try {
          window.speechSynthesis.cancel();
        } catch (err) {
          console.error('Error canceling speech synthesis:', err);
        }
      }
    };
  }, []);

  // Handle voice changes when voices are loaded asynchronously
  useEffect(() => {
    const handleVoicesChanged = () => {
      if (!speechSynthRef.current) return;
      
      try {
        const voices = window.speechSynthesis.getVoices();
        // First try to find a female voice
        let selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('woman')
        );
        
        // If no female voice is found, try to find an English voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang.startsWith('en-') || 
            voice.name.toLowerCase().includes('english')
          );
        }
        
        // If still no voice is found, use the first available voice
        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices[0];
        }
        
        if (selectedVoice) {
          speechSynthRef.current.voice = selectedVoice;
        }
      } catch (err) {
        console.error('Error setting voice:', err);
      }
    };

    // Try to get voices immediately
    handleVoicesChanged();

    // Also set up the event listener for when voices are loaded asynchronously
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    }
    
    return () => {
      if ('onvoiceschanged' in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Auto-play text when component mounts or text changes
  useEffect(() => {
    // Only auto-play if user has interacted with the page
    if (autoPlay && text && isVoiceEnabled && speechSynthRef.current && hasUserInteracted) {
      // Add a small delay to ensure browser recognizes user interaction
      const timer = setTimeout(() => {
        speak();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [text, autoPlay, isVoiceEnabled, hasUserInteracted]);

  const speak = () => {
    if (!speechSynthRef.current || !isVoiceEnabled) return;
    
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Set the text to speak
      speechSynthRef.current.text = text;
      
      // Start speaking
      window.speechSynthesis.speak(speechSynthRef.current);
    } catch (err) {
      console.error('Error speaking text:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    try {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } catch (err) {
      console.error('Error stopping speech:', err);
    }
  };

  if (!isVoiceEnabled) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => {
        setHasUserInteracted(true);
        isSpeaking ? stopSpeaking() : speak();
      }}
      className="p-1 rounded-full hover:bg-gray-100"
      title={isSpeaking ? "Stop speaking" : "Speak this message"}
    >
      {isSpeaking ? 
        <VolumeX size={16} className="text-blue-500" /> : 
        <Volume2 size={16} />
      }
    </Button>
  );
};

export default VoiceOutput;
