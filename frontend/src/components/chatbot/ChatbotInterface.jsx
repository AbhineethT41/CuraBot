import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem, Divider, Chip, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { api } from '../../lib/api';

const ChatbotInterface = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm CuraBot, your medical assistant. Please describe your symptoms, and I'll help you find the right specialist.", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSymptoms, setCurrentSymptoms] = useState([]);
  const [recommendedSpecialty, setRecommendedSpecialty] = useState(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { id: messages.length + 1, text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setIsLoading(true);
    
    try {
      // Call the symptom analysis API
      console.log('Sending message to analyze:', input);
      console.log('Current symptoms:', currentSymptoms);
      
      const response = await api.post('/chatbot/analyze', {
        message: input,
        currentSymptoms
      });

      console.log('Raw API Response:', response);

      // Process the response data
      let botResponse = '';
      
      // Handle extracted symptoms
      if (response.extractedSymptoms && Array.isArray(response.extractedSymptoms) && response.extractedSymptoms.length > 0) {
        setCurrentSymptoms(prevSymptoms => [...new Set([...prevSymptoms, ...response.extractedSymptoms])]);
        botResponse += `I've identified these symptoms: ${response.extractedSymptoms.join(', ')}. `;
      }
      
      // Handle recommended specialty
      if (response.recommendedSpecialty) {
        setRecommendedSpecialty(response.recommendedSpecialty);
        botResponse += `Based on your symptoms, I recommend consulting with a ${response.recommendedSpecialty} specialist. `;
        
        try {
          // Get doctor recommendations if we have a specialty
          const doctorsResponse = await api.post('/chatbot/recommend-doctors', {
            symptoms: [...currentSymptoms, ...(response.extractedSymptoms || [])],
            specialty: response.recommendedSpecialty
          });
          
          if (doctorsResponse && doctorsResponse.doctors && Array.isArray(doctorsResponse.doctors)) {
            setRecommendedDoctors(doctorsResponse.doctors);
          }
        } catch (doctorError) {
          console.error('Error getting doctor recommendations:', doctorError);
          // Continue with the conversation even if doctor recommendations fail
        }
      }
      
      // Handle follow-up questions
      if (response.followUpQuestions && Array.isArray(response.followUpQuestions) && response.followUpQuestions.length > 0) {
        setFollowUpQuestions(response.followUpQuestions);
        botResponse += `\n\nTo better understand your condition, could you please answer these questions:\n• ${response.followUpQuestions.join('\n• ')}`;
      }

      // Add reasoning if available
      if (response.reasoning) {
        botResponse += `\n\nReasoning: ${response.reasoning}`;
      }

      // Add fallback message if no response was generated
      if (!botResponse) {
        botResponse = "I've analyzed your symptoms. Please provide more details for a better assessment.";
      }

      // Add bot message to chat
      const botMessage = { id: messages.length + 2, text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      const errorMessage = { 
        id: messages.length + 2, 
        text: "I'm sorry, I encountered an error while analyzing your symptoms. Please try again. Error details: " + (error.message || "Unknown error"), 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MedicalServicesIcon color="primary" />
        CuraBot Medical Assistant
      </Typography>
      
      {/* Current symptoms display */}
      {currentSymptoms.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Current Symptoms:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {currentSymptoms.map((symptom, index) => (
              <Chip 
                key={index} 
                label={symptom} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            ))}
          </Box>
        </Box>
      )}
      
      {/* Recommended specialty */}
      {recommendedSpecialty && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Recommended Specialty:</Typography>
          <Chip 
            label={recommendedSpecialty} 
            color="secondary" 
            sx={{ mt: 1 }} 
          />
        </Box>
      )}
      
      {/* Chat messages */}
      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, 
          mb: 2, 
          p: 2, 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '400px'
        }}
      >
        <List sx={{ width: '100%', padding: 0 }}>
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              <ListItem 
                alignItems="flex-start"
                sx={{ 
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  mb: 1
                }}
              >
                <Box 
                  sx={{ 
                    maxWidth: '80%',
                    backgroundColor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    p: 2,
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line' }}>
                    {message.text}
                  </Typography>
                </Box>
              </ListItem>
              {index < messages.length - 1 && <Divider variant="middle" component="li" />}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </List>
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>
      
      {/* Recommended doctors */}
      {recommendedDoctors.length > 0 && (
        <Paper elevation={2} sx={{ mb: 2, p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Recommended Doctors:</Typography>
          <List dense>
            {recommendedDoctors.slice(0, 3).map((doctor) => (
              <ListItem key={doctor.id}>
                <Box>
                  <Typography variant="subtitle2">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doctor.specialties.join(', ')} • {doctor.experience} • Rating: {doctor.rating}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      
      {/* Input area */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Describe your symptoms..."
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          multiline
          maxRows={3}
        />
        <Button 
          variant="contained" 
          color="primary" 
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatbotInterface;
