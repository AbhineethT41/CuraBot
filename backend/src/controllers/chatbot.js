/**
 * Chatbot Controller
 * Handles chatbot-related routes and logic
 */
const groqService = require('../services/groqService');
const Doctor = require('../models/Doctor');

/**
 * Process a message from the user and generate a response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.processMessage = async (req, res) => {
  try {
    const { message, conversation } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Process the message with Groq AI
    const response = await groqService.processMessage(message, conversation || []);
    
    return res.status(200).json({ response });
  } catch (error) {
    console.error('Error processing message:', error);
    return res.status(500).json({ error: 'Failed to process message' });
  }
};

/**
 * Analyze symptoms and recommend doctors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, conversation } = req.body;
    
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'Valid symptoms array is required' });
    }
    
    // Map symptoms to specialties
    const specialties = await groqService.mapSymptomsToSpecialties(symptoms);
    
    // Generate health advice
    const healthAdvice = await groqService.generateHealthAdvice(symptoms);
    
    // Find doctors based on the specialties
    let recommendedDoctors = [];
    
    if (specialties && specialties.length > 0) {
      // Get doctors by specialty name
      const doctorsBySpecialty = await Promise.all(
        specialties.map(specialty => Doctor.getBySpecialtyName(specialty))
      );
      
      // Flatten and remove duplicates
      recommendedDoctors = Array.from(
        new Map(
          doctorsBySpecialty.flat().map(doctor => [doctor.id, doctor])
        ).values()
      );
    }
    
    return res.status(200).json({
      symptoms,
      specialties,
      advice: healthAdvice,
      doctors: recommendedDoctors.slice(0, 3) // Return top 3 doctors
    });
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    return res.status(500).json({ error: 'Failed to analyze symptoms' });
  }
};

/**
 * Get doctor recommendations based on a conversation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDoctorRecommendations = async (req, res) => {
  try {
    const { conversation } = req.body;
    
    if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
      return res.status(400).json({ error: 'Valid conversation array is required' });
    }
    
    // Extract symptoms from the conversation using Groq AI
    const lastUserMessage = conversation
      .filter(msg => msg.isUser)
      .map(msg => msg.content)
      .pop();
      
    if (!lastUserMessage) {
      return res.status(400).json({ error: 'No user messages found in conversation' });
    }
    
    // Process the last user message to extract symptoms
    const processedMessage = await groqService.processMessage(lastUserMessage, conversation);
    const { symptoms, specialties } = processedMessage;
    
    if (!symptoms || symptoms.length === 0) {
      return res.status(200).json({
        message: 'No symptoms detected in the conversation',
        doctors: []
      });
    }
    
    // Find doctors based on the specialties
    let recommendedDoctors = [];
    
    if (specialties && specialties.length > 0) {
      // Get doctors by specialty name
      const doctorsBySpecialty = await Promise.all(
        specialties.map(specialty => Doctor.getBySpecialtyName(specialty))
      );
      
      // Flatten and remove duplicates
      recommendedDoctors = Array.from(
        new Map(
          doctorsBySpecialty.flat().map(doctor => [doctor.id, doctor])
        ).values()
      );
    }
    
    return res.status(200).json({
      symptoms,
      specialties,
      response: processedMessage.response,
      recommendation: processedMessage.recommendation,
      severity: processedMessage.severity,
      doctors: recommendedDoctors.slice(0, 5) // Return top 5 doctors
    });
  } catch (error) {
    console.error('Error getting doctor recommendations:', error);
    return res.status(500).json({ error: 'Failed to get doctor recommendations' });
  }
};
