import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import ChatbotInterface from '../components/chatbot/ChatbotInterface';

const ChatbotPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          CuraBot Medical Assistant
        </Typography>
        <Typography variant="body1" paragraph align="center" color="text.secondary">
          Describe your symptoms and get personalized medical recommendations
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <ChatbotInterface />
        </Paper>
        
        <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            How it works:
          </Typography>
          <Typography variant="body2" component="div">
            <ol>
              <li>Describe your symptoms in detail</li>
              <li>CuraBot analyzes your symptoms using advanced AI</li>
              <li>Get recommended medical specialties based on your symptoms</li>
              <li>Answer follow-up questions to improve the diagnosis</li>
              <li>Receive doctor recommendations from our network of specialists</li>
            </ol>
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Note: This tool is for informational purposes only and does not replace professional medical advice.
            Always consult with a qualified healthcare provider for medical concerns.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ChatbotPage;
