import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, StopCircle } from 'lucide-react';
import Button from '../ui/Button';

interface VoiceInputProps {
  onSpeechResult: (text: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  onInterimResult?: (text: string) => void;
  disabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onSpeechResult, 
  onInterimResult = () => {}, 
  isListening, 
  setIsListening, 
  disabled = false 
}) => {
  const [recognition, setRecognition] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [isRecognitionActive, setIsRecognitionActive] = useState<boolean>(false);
  const recognitionRef = useRef<any | null>(null);
  const hasPermissionRef = useRef<boolean>(false);

  // Check for microphone permission
  const checkMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // If we get here, permission was granted
      hasPermissionRef.current = true;
      
      // Clean up the stream
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (err) {
      console.error('Microphone permission error:', err);
      setError('Microphone access denied. Please allow microphone access and try again.');
      hasPermissionRef.current = false;
      return false;
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    // Use webkit prefix since it's more widely supported
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    
    recognitionInstance.onstart = () => {
      console.log('Speech recognition started');
      setIsRecognitionActive(true);
    };
    
    recognitionInstance.onresult = (event: any) => {
      try {
        const results = event.results;
        const currentIndex = event.resultIndex;
        
        // Get the latest result (could be final or interim)
        const latestResult = results[currentIndex];
        const transcript = latestResult[0].transcript;
        
        console.log('Speech recognition result:', transcript, 'isFinal:', latestResult.isFinal);
        
        // Store the current transcript regardless of whether it's final
        setCurrentTranscript(transcript);
        
        if (latestResult.isFinal) {
          // Send the final result to be processed
          onSpeechResult(transcript);
        } else {
          // Send interim result for display
          onInterimResult(transcript);
        }
      } catch (err) {
        console.error('Error processing speech result:', err);
      }
    };
    
    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      
      let errorMessage = `Error: ${event.error}`;
      
      // Provide more specific error messages
      if (event.error === 'not-allowed') {
        errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.';
        hasPermissionRef.current = false;
      } else if (event.error === 'network') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (event.error === 'no-speech') {
        errorMessage = 'No speech detected. Please try again.';
        // This is not a critical error, so we can restart
        setTimeout(() => {
          if (isListening && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.error('Error restarting after no-speech:', e);
            }
          }
        }, 300);
        return; // Don't set error or stop listening for no-speech errors
      }
      
      setError(errorMessage);
      setIsListening(false);
      setIsRecognitionActive(false);
    };
    
    recognitionInstance.onend = () => {
      console.log('Speech recognition ended');
      setIsRecognitionActive(false);
      
      // When recognition ends, if we have a transcript and we're still in listening mode,
      // send it as a final result and then stop listening
      if (isListening && currentTranscript.trim()) {
        onSpeechResult(currentTranscript);
        setIsListening(false);
      } else if (isListening) {
        // If we're still supposed to be listening but recognition ended,
        // try to restart it (unless there was an error)
        if (!error && hasPermissionRef.current) {
          console.log('Recognition ended unexpectedly, restarting...');
          try {
            setTimeout(() => {
              recognitionInstance.start();
            }, 300);
          } catch (err) {
            console.error('Error restarting speech recognition:', err);
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      }
    };
    
    setRecognition(recognitionInstance);
    recognitionRef.current = recognitionInstance;
    
    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.abort();
        } catch (err) {
          console.error('Error aborting recognition:', err);
        }
      }
    };
  }, [onSpeechResult, onInterimResult, setIsListening, isListening, currentTranscript, error]);

  // Start or stop listening
  const toggleListening = useCallback(async () => {
    if (!recognition) return;
    
    if (isListening) {
      console.log('Stopping speech recognition');
      
      // When stopping, if we have a transcript, send it as a final result
      if (currentTranscript.trim()) {
        onSpeechResult(currentTranscript);
      }
      
      try {
        recognition.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
      
      setIsListening(false);
      setCurrentTranscript('');
    } else {
      // Check for microphone permission before starting
      const hasPermission = await checkMicrophonePermission();
      
      if (!hasPermission) {
        return; // Don't proceed if permission denied
      }
      
      try {
        console.log('Starting speech recognition');
        setIsListening(true);
        setError(null);
        
        // Small delay to ensure state is updated before starting recognition
        setTimeout(() => {
          try {
            recognition.start();
          } catch (err) {
            console.error('Error starting speech recognition:', err);
            setError('Could not start speech recognition. Please try again.');
            setIsListening(false);
          }
        }, 100);
      } catch (err) {
        console.error('Error in toggle listening:', err);
        setError('Could not start speech recognition. Please try again.');
        setIsListening(false);
      }
    }
  }, [isListening, recognition, setIsListening, currentTranscript, onSpeechResult, checkMicrophonePermission]);

  if (error) {
    return (
      <div className="text-red-500 text-xs">
        {error}
      </div>
    );
  }

  // Determine the appropriate button style based on listening state
  const buttonVariant = isListening ? "danger" : "secondary";
  
  return (
    <Button
      type="button"
      variant={buttonVariant}
      onClick={toggleListening}
      disabled={disabled}
      className={`rounded-full p-2 flex items-center justify-center ${isListening ? 'animate-pulse ring-2 ring-red-500 ring-opacity-75' : ''}`}
      title={isListening ? "Stop listening and send" : "Start voice input"}
    >
      {isListening ? (
        <div className="relative">
          <StopCircle size={20} />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
        </div>
      ) : (
        <Mic size={20} />
      )}
    </Button>
  );
};

export default VoiceInput;

// Add type definition for browsers that don't have it
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}
