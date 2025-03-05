/**
 * Groq API Service
 * Handles interactions with the Groq AI API for symptom analysis and doctor recommendations
 */
const axios = require('axios');
const config = require('../config');

class GroqService {
  constructor() {
    this.apiKey = config.GROQ_API_KEY;
    this.baseUrl = 'https://api.groq.com/openai/v1';
    this.model = 'llama3-70b-8192'; // Default model
  }

  /**
   * Initialize the HTTP client with auth headers
   * @returns {Object} Configured axios instance
   */
  getClient() {
    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Process a user message to extract symptoms and provide health guidance
   * @param {string} message - User message
   * @param {Array} chatHistory - Previous chat history
   * @returns {Promise<Object>} AI response with extracted symptoms and recommendations
   */
  async processMessage(message, chatHistory = []) {
    try {
      if (!this.apiKey) {
        throw new Error('GROQ_API_KEY is not configured');
      }

      const client = this.getClient();
      
      // Format chat history for the API
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Add the current message
      formattedHistory.push({
        role: 'user',
        content: message
      });
      
      // System prompt for symptom analysis
      const systemPrompt = `You are a medical assistant AI that helps identify potential symptoms from user messages. 
      Extract any symptoms mentioned, suggest possible medical specialties that would be relevant, 
      and provide helpful health guidance. Format your response as JSON with the following structure:
      {
        "symptoms": ["symptom1", "symptom2", ...],
        "specialties": ["specialty1", "specialty2", ...],
        "response": "Your helpful response to the user",
        "severity": "low|medium|high",
        "recommendation": "Your recommendation (e.g., see a doctor, home remedies, etc.)"
      }`;
      
      const response = await client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...formattedHistory
        ],
        temperature: 0.7,
        max_tokens: 1024
      });
      
      const aiResponse = response.data.choices[0].message.content;
      
      // Try to parse JSON from the response
      try {
        // Extract JSON object from the response if it's wrapped in text
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
        return JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('Error parsing AI response as JSON:', parseError);
        // Return a structured format even if parsing fails
        return {
          symptoms: [],
          specialties: [],
          response: aiResponse,
          severity: "unknown",
          recommendation: "Please consult with a healthcare professional for proper diagnosis."
        };
      }
    } catch (error) {
      console.error('Error processing message with Groq API:', error);
      throw new Error(`Failed to process message: ${error.message}`);
    }
  }

  /**
   * Map symptoms to medical specialties
   * @param {Array} symptoms - List of symptoms
   * @returns {Promise<Array>} Recommended medical specialties
   */
  async mapSymptomsToSpecialties(symptoms) {
    try {
      if (!this.apiKey) {
        throw new Error('GROQ_API_KEY is not configured');
      }

      if (!symptoms || symptoms.length === 0) {
        return [];
      }

      const client = this.getClient();
      
      const systemPrompt = `You are a medical assistant AI that helps map symptoms to appropriate medical specialties.
      Given a list of symptoms, return the top 3 most relevant medical specialties that a patient should consult.
      Format your response as a JSON array of strings containing only the specialty names.
      Example: ["Cardiology", "Internal Medicine", "Pulmonology"]`;
      
      const response = await client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Map these symptoms to medical specialties: ${symptoms.join(', ')}` }
        ],
        temperature: 0.3,
        max_tokens: 256
      });
      
      const aiResponse = response.data.choices[0].message.content;
      
      // Try to parse JSON from the response
      try {
        // Extract JSON array from the response if it's wrapped in text
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
        return JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('Error parsing specialties response as JSON:', parseError);
        return [];
      }
    } catch (error) {
      console.error('Error mapping symptoms to specialties:', error);
      return [];
    }
  }

  /**
   * Generate health advice based on symptoms
   * @param {Array} symptoms - List of symptoms
   * @returns {Promise<Object>} Health advice and recommendations
   */
  async generateHealthAdvice(symptoms) {
    try {
      if (!this.apiKey) {
        throw new Error('GROQ_API_KEY is not configured');
      }

      if (!symptoms || symptoms.length === 0) {
        return {
          advice: "No symptoms provided. Please describe your symptoms for personalized advice.",
          severity: "unknown",
          recommendation: "Please consult with a healthcare professional for proper diagnosis."
        };
      }

      const client = this.getClient();
      
      const systemPrompt = `You are a medical assistant AI that provides preliminary health advice.
      Given a list of symptoms, provide general health advice, assess potential severity, and make recommendations.
      DO NOT diagnose specific conditions, but suggest when to seek medical attention.
      Format your response as JSON with the following structure:
      {
        "advice": "Your general health advice",
        "severity": "low|medium|high",
        "recommendation": "Your recommendation (e.g., see a doctor, home remedies, etc.)",
        "urgency": "routine|soon|immediate",
        "disclaimer": "Standard medical disclaimer"
      }`;
      
      const response = await client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Provide health advice for these symptoms: ${symptoms.join(', ')}` }
        ],
        temperature: 0.5,
        max_tokens: 512
      });
      
      const aiResponse = response.data.choices[0].message.content;
      
      // Try to parse JSON from the response
      try {
        // Extract JSON object from the response if it's wrapped in text
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
        return JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('Error parsing health advice response as JSON:', parseError);
        return {
          advice: aiResponse,
          severity: "unknown",
          recommendation: "Please consult with a healthcare professional for proper diagnosis.",
          urgency: "unknown",
          disclaimer: "This is not medical advice. Always consult with a healthcare professional."
        };
      }
    } catch (error) {
      console.error('Error generating health advice:', error);
      return {
        advice: "Sorry, I couldn't process your symptoms at this time.",
        severity: "unknown",
        recommendation: "Please consult with a healthcare professional for proper diagnosis.",
        urgency: "unknown",
        disclaimer: "This is not medical advice. Always consult with a healthcare professional."
      };
    }
  }
}

module.exports = new GroqService();
