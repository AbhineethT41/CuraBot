# CuraBot Backend

This is the backend server for the CuraBot healthcare application.

## Features

- **Chatbot API**: Analyzes user symptoms using Groq's LLM and recommends appropriate medical specialists
- **Doctor Management**: API endpoints for doctor profiles, search, and availability
- **Appointment System**: Endpoints for creating, updating, and managing appointments

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd CuraBot/backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   GROQ_API_KEY=your_groq_api_key_here
   ```
   Replace `your_groq_api_key_here` with your actual Groq API key.

### Running the Server

Development mode with auto-reload:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Chatbot

- `POST /api/chatbot/analyze` - Analyze symptoms and recommend specialists
  - Request body: `{ "message": "string", "currentSymptoms": ["string"] }`
  - Response: `{ "extractedSymptoms": ["string"], "recommendedSpecialty": "string", "followUpQuestions": ["string"], "reasoning": "string" }`

- `POST /api/chatbot/follow-up` - Get follow-up questions for symptoms
  - Request body: `{ "symptoms": ["string"] }`
  - Response: `{ "followUpQuestions": ["string"] }`

- `POST /api/chatbot/recommend-doctors` - Get doctor recommendations based on symptoms
  - Request body: `{ "symptoms": ["string"], "specialty": "string" }`
  - Response: `{ "recommendedSpecialty": "string", "doctors": [Doctor] }`

### Doctors

- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/specialty/:specialtyId` - Get doctors by specialty
- `GET /api/doctors/search?query=term` - Search doctors
- `GET /api/doctors/:id/availability` - Get doctor availability

### Appointments

- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `GET /api/appointments/user/:userId` - Get user appointments
- `GET /api/appointments/doctor/:doctorId` - Get doctor appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

## Chatbot Implementation

The chatbot feature uses Groq's LLM API to:

1. Extract symptoms from user messages
2. Generate follow-up questions to gather more information
3. Analyze symptoms to recommend appropriate medical specialists
4. Match symptoms to the most suitable doctor specialties

If the Groq API is unavailable, the system falls back to a local symptom analysis algorithm.

## Development

The backend is built with:
- Express.js for the API server
- Groq SDK for LLM integration
- Express Async Handler for cleaner error handling

Currently using mock data for development. Database integration will be added in future versions.
