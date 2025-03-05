/**
 * Groq AI Service
 * Handles interactions with the Groq API for chatbot functionality
 */
const Groq = require('groq-sdk');
const config = require('../config');
const Doctor = require('../models/Doctor');

// Initialize Groq client
const groq = new Groq({
  apiKey: config.GROQ_API_KEY,
});

/**
 * Generate a system prompt with doctor information
 * @param {Array} doctors - List of doctors from the database
 * @returns {string} System prompt with doctor information
 */
const generateSystemPrompt = (doctors) => {
  let doctorInfo = '';
  
  if (doctors && doctors.length > 0) {
    doctorInfo = 'Available doctors in our hospital:\n';
    doctors.forEach(doctor => {
      doctorInfo += `- Dr. ${doctor.first_name} ${doctor.last_name}, ${doctor.specialty}, ${doctor.years_of_experience} years of experience`;
      if (doctor.bio) {
        doctorInfo += `, Bio: ${doctor.bio}`;
      }
      doctorInfo += '\n';
    });
  }
  
  return `You are CuraBot, an AI medical assistant for a hospital. Your role is to help patients identify potential health issues based on their symptoms and recommend appropriate medical specialists.

${doctorInfo}

Guidelines:
1. Be empathetic and professional when discussing medical concerns.
2. Extract symptoms from user messages and suggest appropriate medical specialties.
3. When recommending doctors, prioritize matching the specialty to the symptoms.
4. If multiple doctors are available in a specialty, recommend the one with more experience.
5. If no doctors are available for a specific specialty, suggest the closest alternative.
6. Do not diagnose conditions - only suggest which type of specialist might be appropriate.
7. Always clarify that your recommendations are not a substitute for professional medical advice.
8. Keep responses concise and focused on helping the user find the right medical care.
9. If you're unsure about a symptom, ask clarifying questions.
10. For emergencies (chest pain, difficulty breathing, severe bleeding, etc.), advise the user to call emergency services immediately.

Your goal is to help patients navigate the healthcare system efficiently while providing a supportive experience.`;
};

/**
 * Process a chat message with Groq AI
 * @param {string} message - User message
 * @param {Array} history - Chat history
 * @returns {Promise<Object>} Response from Groq AI
 */
const processMessage = async (message, history = []) => {
  try {
    // Get all doctors from the database
    const doctors = await Doctor.getAll();
    
    // Format chat history for Groq
    const formattedHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    
    // Add the new user message
    const messages = [
      {
        role: 'system',
        content: generateSystemPrompt(doctors)
      },
      ...formattedHistory,
      {
        role: 'user',
        content: message
      }
    ];
    
    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama3-70b-8192',  // Use the appropriate model
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
      stream: false,
    });
    
    // Extract symptoms and recommended specialty from the response
    const response = completion.choices[0].message.content;
    
    // Extract symptoms using a simple heuristic
    // This could be improved with a more sophisticated approach
    const symptomsMatch = response.match(/symptoms?:?\s*\(?(.*?)\)?[.,]/i);
    const symptoms = symptomsMatch ? 
      symptomsMatch[1].split(/,\s*/).map(s => s.trim()) : 
      [];
    
    // Extract recommended specialty
    const specialtyMatch = response.match(/(?:recommend|suggest|see|visit)\s+(?:a|an)?\s*([A-Za-z\s]+(?:specialist|doctor|physician))/i);
    const specialty = specialtyMatch ? 
      specialtyMatch[1].replace(/(specialist|doctor|physician)/i, '').trim() : 
      null;
    
    // Find recommended doctor based on specialty
    let recommendedDoctor = null;
    if (specialty && doctors.length > 0) {
      recommendedDoctor = doctors.find(d => 
        d.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
      
      // If no exact match, find the closest match
      if (!recommendedDoctor) {
        // Default to the first doctor if no match
        recommendedDoctor = doctors[0];
      }
    }
    
    return {
      response,
      symptoms,
      specialty,
      recommendedDoctor
    };
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error('Failed to process message with Groq AI');
  }
};

/**
 * Analyze symptoms and recommend a specialty
 * @param {Array} symptoms - List of symptoms
 * @returns {Promise<Object>} Recommended specialty and doctor
 */
const analyzeSymptoms = async (symptoms) => {
  try {
    // Get all doctors from the database
    const doctors = await Doctor.getAll();
    
    // Create a prompt for symptom analysis
    const prompt = `
      I have the following symptoms: ${symptoms.join(', ')}. 
      Based on these symptoms, what medical specialty should I see?
      Please respond in a structured format with:
      1. The recommended medical specialty
      2. A brief explanation of why this specialty is appropriate for my symptoms
    `;
    
    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: generateSystemPrompt(doctors)
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama3-70b-8192',
      temperature: 0.5,
      max_tokens: 512,
      top_p: 0.9,
      stream: false,
    });
    
    const response = completion.choices[0].message.content;
    
    // Extract recommended specialty
    const specialtyMatch = response.match(/(?:recommend|suggest|see|visit)\s+(?:a|an)?\s*([A-Za-z\s]+(?:specialist|doctor|physician))/i);
    const specialty = specialtyMatch ? 
      specialtyMatch[1].replace(/(specialist|doctor|physician)/i, '').trim() : 
      'General Medicine';
    
    // Find recommended doctor based on specialty
    let recommendedDoctor = null;
    if (specialty && doctors.length > 0) {
      recommendedDoctor = doctors.find(d => 
        d.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
      
      // If no exact match, find the closest match
      if (!recommendedDoctor) {
        // Default to the first doctor if no match
        recommendedDoctor = doctors[0];
      }
    }
    
    return {
      specialty,
      explanation: response,
      recommendedDoctor
    };
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error('Failed to analyze symptoms with Groq AI');
  }
};

/**
 * Extract symptoms from a conversation
 * @param {Array} conversation - Conversation history
 * @returns {Promise<Object>} Extracted symptoms and specialties
 */
const extractSymptomsFromConversation = async (conversation) => {
  try {
    // Format conversation for Groq
    const formattedConversation = conversation.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    
    // Create a prompt for symptom extraction
    const extractionPrompt = `
      Based on the conversation above, please extract:
      1. All mentioned symptoms
      2. The most appropriate medical specialties for these symptoms
      
      Format your response as a JSON object with two arrays:
      {
        "symptoms": ["symptom1", "symptom2", ...],
        "specialties": ["specialty1", "specialty2", ...]
      }
      
      Only include the JSON in your response, nothing else.
    `;
    
    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a medical AI assistant that extracts symptoms and recommends appropriate medical specialties from conversations.'
        },
        ...formattedConversation,
        {
          role: 'user',
          content: extractionPrompt
        }
      ],
      model: 'llama3-70b-8192',
      temperature: 0.3,
      max_tokens: 512,
      top_p: 0.9,
      stream: false,
    });
    
    const response = completion.choices[0].message.content;
    
    // Extract the JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { symptoms: [], specialties: [] };
    }
    
    try {
      const extractedData = JSON.parse(jsonMatch[0]);
      return {
        symptoms: Array.isArray(extractedData.symptoms) ? extractedData.symptoms : [],
        specialties: Array.isArray(extractedData.specialties) ? extractedData.specialties : []
      };
    } catch (parseError) {
      console.error('Error parsing JSON from Groq response:', parseError);
      
      // Fallback to regex extraction if JSON parsing fails
      const symptomsMatch = response.match(/symptoms"?\s*:?\s*\[([^\]]*)\]/i);
      const specialtiesMatch = response.match(/specialties"?\s*:?\s*\[([^\]]*)\]/i);
      
      const symptoms = symptomsMatch ? 
        symptomsMatch[1].split(/,\s*/).map(s => s.replace(/"/g, '').trim()).filter(Boolean) : 
        [];
        
      const specialties = specialtiesMatch ? 
        specialtiesMatch[1].split(/,\s*/).map(s => s.replace(/"/g, '').trim()).filter(Boolean) : 
        [];
      
      return { symptoms, specialties };
    }
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error('Failed to extract symptoms from conversation');
  }
};

module.exports = {
  processMessage,
  analyzeSymptoms,
  extractSymptomsFromConversation
};
