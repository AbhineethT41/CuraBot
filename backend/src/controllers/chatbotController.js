const asyncHandler = require('express-async-handler');
const { Groq } = require('groq-sdk');

// Initialize Groq client
let groq;
try {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
  console.log('Groq client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Groq client:', error);
}

// Medical specialty mapping based on symptoms
const symptomToSpecialty = {
  'headache': 'Neurology',
  'migraine': 'Neurology',
  'dizziness': 'Neurology',
  'seizure': 'Neurology',
  'memory loss': 'Neurology',
  'numbness': 'Neurology',
  'tingling': 'Neurology',
  'tremor': 'Neurology',
  'weakness': 'Neurology',
  
  'chest pain': 'Cardiology',
  'heart palpitations': 'Cardiology',
  'high blood pressure': 'Cardiology',
  'irregular heartbeat': 'Cardiology',
  'shortness of breath': 'Cardiology',
  'swelling in legs': 'Cardiology',
  'fainting': 'Cardiology',
  
  'cough': 'Pulmonology',
  'wheezing': 'Pulmonology',
  'breathing difficulty': 'Pulmonology',
  'sleep apnea': 'Pulmonology',
  'coughing up blood': 'Pulmonology',
  
  'stomach pain': 'Gastroenterology',
  'nausea': 'Gastroenterology',
  'vomiting': 'Gastroenterology',
  'diarrhea': 'Gastroenterology',
  'constipation': 'Gastroenterology',
  'heartburn': 'Gastroenterology',
  'blood in stool': 'Gastroenterology',
  'jaundice': 'Gastroenterology',
  
  'joint pain': 'Orthopedics',
  'back pain': 'Orthopedics',
  'fracture': 'Orthopedics',
  'sprain': 'Orthopedics',
  'arthritis': 'Orthopedics',
  'swollen joints': 'Orthopedics',
  'limited mobility': 'Orthopedics',
  
  'rash': 'Dermatology',
  'skin irritation': 'Dermatology',
  'acne': 'Dermatology',
  'eczema': 'Dermatology',
  'psoriasis': 'Dermatology',
  'mole changes': 'Dermatology',
  'hair loss': 'Dermatology',
  
  'fever': 'General Medicine',
  'fatigue': 'General Medicine',
  'weight loss': 'General Medicine',
  'weight gain': 'General Medicine',
  'night sweats': 'General Medicine',
  
  'sore throat': 'ENT',
  'ear pain': 'ENT',
  'hearing loss': 'ENT',
  'ringing in ears': 'ENT',
  'nasal congestion': 'ENT',
  'sinus pain': 'ENT',
  'hoarseness': 'ENT',
  'difficulty swallowing': 'ENT',
  
  'vision problems': 'Ophthalmology',
  'eye pain': 'Ophthalmology',
  'blurry vision': 'Ophthalmology',
  'double vision': 'Ophthalmology',
  'dry eyes': 'Ophthalmology',
  'red eyes': 'Ophthalmology',
  
  'anxiety': 'Psychiatry',
  'depression': 'Psychiatry',
  'mood swings': 'Psychiatry',
  'insomnia': 'Psychiatry',
  'panic attacks': 'Psychiatry',
  'hallucinations': 'Psychiatry',
  'suicidal thoughts': 'Psychiatry',
  
  'frequent urination': 'Urology',
  'painful urination': 'Urology',
  'blood in urine': 'Urology',
  'kidney stones': 'Urology',
  'erectile dysfunction': 'Urology',
  
  'menstrual problems': 'Gynecology',
  'pelvic pain': 'Gynecology',
  'pregnancy': 'Gynecology',
  'vaginal discharge': 'Gynecology',
  'breast lump': 'Gynecology',
  
  'allergies': 'Allergy and Immunology',
  'hives': 'Allergy and Immunology',
  'frequent infections': 'Allergy and Immunology',
  'autoimmune disorders': 'Allergy and Immunology',
  
  'diabetes': 'Endocrinology',
  'thyroid problems': 'Endocrinology',
  'hormone imbalance': 'Endocrinology',
  'excessive thirst': 'Endocrinology',
  'excessive hunger': 'Endocrinology'
};

// @desc    Analyze symptoms and recommend specialists
// @route   POST /api/chatbot/analyze
// @access  Public
const analyzeSymptoms = asyncHandler(async (req, res) => {
  const { message, currentSymptoms = [] } = req.body;
  
  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }
  
  try {
    if (!groq) {
      throw new Error('Groq client not initialized');
    }
    
    // Prepare the prompt for Groq
    const prompt = `
    You are a medical assistant AI that helps identify symptoms and recommend appropriate medical specialists.
    
    Current symptoms reported by the patient: ${currentSymptoms.join(', ')}
    
    Patient's new message: "${message}"
    
    Please analyze this message and:
    1. Extract any new symptoms mentioned
    2. Determine the most appropriate medical specialty based on all symptoms
    3. Suggest 2-3 follow-up questions to better understand the patient's condition
    
    Respond in JSON format only:
    {
      "extractedSymptoms": ["symptom1", "symptom2", ...],
      "recommendedSpecialty": "specialty name",
      "followUpQuestions": ["question1", "question2", "question3"],
      "reasoning": "brief explanation of your recommendation"
    }
    `;
    
    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 0.9,
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    const responseContent = completion.choices[0].message.content;
    console.log('Groq API response content:', responseContent);
    
    try {
      const parsedResponse = JSON.parse(responseContent);
      console.log('Parsed response:', parsedResponse);
      
      // Validate the response format
      if (!parsedResponse.extractedSymptoms || !Array.isArray(parsedResponse.extractedSymptoms)) {
        parsedResponse.extractedSymptoms = [];
      }
      
      if (!parsedResponse.recommendedSpecialty) {
        parsedResponse.recommendedSpecialty = analyzeSymptomLocally([...currentSymptoms, ...parsedResponse.extractedSymptoms]);
      }
      
      if (!parsedResponse.followUpQuestions || !Array.isArray(parsedResponse.followUpQuestions)) {
        parsedResponse.followUpQuestions = [
          "How long have you been experiencing these symptoms?",
          "Are your symptoms constant or do they come and go?",
          "Have you taken any medication for these symptoms?"
        ];
      }
      
      if (!parsedResponse.reasoning) {
        parsedResponse.reasoning = `Based on the symptoms, a ${parsedResponse.recommendedSpecialty} specialist would be most appropriate.`;
      }
      
      // Return the analysis
      res.json(parsedResponse);
    } catch (parseError) {
      console.error('Error parsing Groq response:', parseError);
      // Fallback to local analysis if parsing fails
      const fallbackAnalysis = performLocalSymptomAnalysis(message, currentSymptoms);
      res.json(fallbackAnalysis);
    }
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    
    // Fallback to local analysis if Groq fails
    const fallbackAnalysis = performLocalSymptomAnalysis(message, currentSymptoms);
    
    res.json(fallbackAnalysis);
  }
});

// @desc    Get follow-up questions for symptoms
// @route   POST /api/chatbot/follow-up
// @access  Public
const getFollowUpQuestions = asyncHandler(async (req, res) => {
  const { symptoms = [] } = req.body;
  
  if (!symptoms || symptoms.length === 0) {
    res.status(400);
    throw new Error('Symptoms are required');
  }
  
  try {
    if (!groq) {
      throw new Error('Groq client not initialized');
    }
    
    // Prepare the prompt for Groq
    const prompt = `
    You are a medical assistant AI that helps gather more information about patient symptoms.
    
    Current symptoms reported by the patient: ${symptoms.join(', ')}
    
    Please generate 3 specific follow-up questions that would help better understand the patient's condition and narrow down the potential diagnosis.
    
    Respond in JSON format only:
    {
      "followUpQuestions": ["question1", "question2", "question3"]
    }
    `;
    
    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 512,
      top_p: 0.9,
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    const responseContent = completion.choices[0].message.content;
    const parsedResponse = JSON.parse(responseContent);
    
    // Return the follow-up questions
    res.json(parsedResponse);
    
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    
    // Fallback to local generation if Groq fails
    const fallbackQuestions = {
      followUpQuestions: [
        `How long have you been experiencing ${symptoms[0]}?`,
        `Is the ${symptoms[0]} constant or does it come and go?`,
        `Have you tried any treatments for your symptoms?`
      ]
    };
    
    res.json(fallbackQuestions);
  }
});

// @desc    Recommend doctors based on symptoms
// @route   POST /api/chatbot/recommend-doctors
// @access  Public
const recommendDoctors = asyncHandler(async (req, res) => {
  const { symptoms = [], specialty = null } = req.body;
  
  console.log('Recommend doctors request:', { symptoms, specialty });
  
  // If no symptoms and no specialty provided, return error
  if ((!symptoms || symptoms.length === 0) && !specialty) {
    res.status(400);
    throw new Error('Symptoms or specialty are required');
  }
  
  try {
    // If specialty is provided, use it directly
    let recommendedSpecialty = specialty;
    
    // If no specialty but symptoms are provided, analyze symptoms
    if (!recommendedSpecialty && symptoms.length > 0) {
      // Use Groq for analysis if available
      if (groq) {
        const prompt = `
        You are a medical assistant AI that helps recommend appropriate medical specialists.
        
        Patient's symptoms: ${symptoms.join(', ')}
        
        Based on these symptoms, what medical specialty would be most appropriate for the patient to consult?
        Choose from: Cardiology, Dermatology, ENT, Endocrinology, Gastroenterology, General Medicine, Gynecology, Neurology, Ophthalmology, Orthopedics, Psychiatry, Pulmonology, Urology, Allergy and Immunology.
        
        Respond in JSON format only:
        {
          "recommendedSpecialty": "specialty name",
          "reasoning": "brief explanation of your recommendation"
        }
        `;
        
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "llama3-8b-8192",
          temperature: 0.3,
          max_tokens: 256,
          top_p: 0.9,
          response_format: { type: "json_object" }
        });
        
        const responseContent = completion.choices[0].message.content;
        console.log('Groq API response for specialty recommendation:', responseContent);
        
        try {
          const parsedResponse = JSON.parse(responseContent);
          recommendedSpecialty = parsedResponse.recommendedSpecialty;
        } catch (parseError) {
          console.error('Error parsing Groq specialty response:', parseError);
          // Fallback to local analysis if parsing fails
          recommendedSpecialty = analyzeSymptomLocally(symptoms);
        }
      } else {
        // Fallback to local analysis
        recommendedSpecialty = analyzeSymptomLocally(symptoms);
      }
    }
    
    // If still no specialty, default to General Medicine
    if (!recommendedSpecialty) {
      recommendedSpecialty = 'General Medicine';
    }
    
    // Import the doctor controller to get doctors by specialty
    const doctorController = require('./doctorController');
    
    // Get doctors for the recommended specialty
    const doctors = doctorController.getMockDoctorsBySpecialty(recommendedSpecialty);
    
    console.log(`Recommending ${doctors.length} doctors for specialty: ${recommendedSpecialty}`);
    
    // Return the recommendation
    res.json({
      recommendedSpecialty,
      doctors
    });
    
  } catch (error) {
    console.error('Error recommending doctors:', error);
    res.status(500).json({
      message: 'Error recommending doctors',
      error: error.message
    });
  }
});

// Helper function to analyze symptoms locally
function analyzeSymptomLocally(symptoms) {
  const specialtyCounts = {};
  
  symptoms.forEach(symptom => {
    const normalizedSymptom = symptom.toLowerCase();
    
    // Check for matches in our symptom-to-specialty mapping
    for (const [key, specialty] of Object.entries(symptomToSpecialty)) {
      if (normalizedSymptom.includes(key)) {
        specialtyCounts[specialty] = (specialtyCounts[specialty] || 0) + 1;
      }
    }
  });
  
  // Find the specialty with the highest count
  let maxCount = 0;
  let recommendedSpecialty = 'General Medicine';
  
  for (const [specialty, count] of Object.entries(specialtyCounts)) {
    if (count > maxCount) {
      maxCount = count;
      recommendedSpecialty = specialty;
    }
  }
  
  return recommendedSpecialty;
}

// Helper function for local symptom analysis as fallback
function performLocalSymptomAnalysis(message, currentSymptoms) {
  const normalizedMessage = message.toLowerCase();
  const extractedSymptoms = [];
  
  // Extract symptoms from the message
  for (const symptom of Object.keys(symptomToSpecialty)) {
    if (normalizedMessage.includes(symptom)) {
      extractedSymptoms.push(symptom);
    }
  }
  
  // Combine with current symptoms
  const allSymptoms = [...new Set([...currentSymptoms, ...extractedSymptoms])];
  
  // Determine specialty
  const recommendedSpecialty = analyzeSymptomLocally(allSymptoms);
  
  // Generate follow-up questions
  const followUpQuestions = [
    `How long have you been experiencing these symptoms?`,
    `Are your symptoms constant or do they come and go?`,
    `Have you taken any medication for these symptoms?`
  ];
  
  return {
    extractedSymptoms,
    recommendedSpecialty,
    followUpQuestions,
    reasoning: `Based on the symptoms ${allSymptoms.join(', ')}, a ${recommendedSpecialty} specialist would be most appropriate.`
  };
}

module.exports = {
  analyzeSymptoms,
  getFollowUpQuestions,
  recommendDoctors
};
