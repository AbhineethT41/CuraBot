# CuraBot - Hospital Front-Desk Chatbot

CuraBot is a modern, responsive hospital front-desk chatbot that helps patients check symptoms, find the right doctor, and book appointments seamlessly.

## Project Overview

CuraBot helps patients:
1. Check symptoms and get doctor specialization recommendations using AI-powered analysis
2. View available doctors and their appointment slots
3. Book an appointment and receive a confirmation
4. Authenticate and manage their profile (to be implemented)
5. Provide a doctor dashboard to manage appointments

## Tech Stack

- **Frontend Framework:** React.js (Functional Components, Hooks)
- **Styling:** Tailwind CSS & Material-UI
- **State Management:** Zustand & React Context
- **Routing:** React Router
- **Backend Framework:** Express.js
- **AI Integration:** Groq API for symptom analysis
- **Containerization:** Docker
- **Environment Variables:** .env files

## Project Structure

```
CuraBot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── chatbot/
│   │   │   ├── appointments/
│   │   │   ├── layout/
│   │   │   ├── ui/
│   │   ├── pages/
│   │   ├── store/  # Zustand state management
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   ├── public/
│   ├── .env  # Environment variables
│   ├── .dockerignore
│   ├── Dockerfile  # Frontend containerization
│   ├── docker-compose.yml  # For running the frontend container
│   ├── package.json
├── backend/  # Empty for now
├── README.md
```

## Features

### 1. Chatbot Interface
- Conversational UI to take user symptoms as input
- Recommends doctor specializations based on symptoms
- Uses Zustand to manage chat history and bot responses

### 2. Doctor Availability & Booking
- Shows doctors based on the chatbot's recommendations
- Displays available appointment slots
- Allows users to select a slot and confirm an appointment

### 3. User Dashboard
- View and manage past/future appointments
- UI for appointment history and upcoming bookings

### 4. Doctor Dashboard
- Section for doctors to view and manage upcoming appointments
- Clean, table-based UI for listing appointments

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Docker and Docker Compose (for containerization)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/curabot.git
cd curabot
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build and run with Docker:
```bash
docker-compose up --build
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
VITE_API_URL=http://localhost:3000/api
VITE_ENABLE_DOCTOR_DASHBOARD=true
VITE_ENABLE_USER_PROFILE=true
VITE_APP_NAME=CuraBot
VITE_APP_DESCRIPTION=Skip the Line, See the Right Doctor, Right Now.
```

## Docker Deployment

The frontend is containerized with Docker for easy deployment:

1. Build the Docker image:
```bash
docker build -t curabot-frontend .
```

2. Run the container:
```bash
docker run -p 8080:80 curabot-frontend
```

Or use Docker Compose:
```bash
docker-compose up
```

## Future Enhancements

- Backend implementation with Node.js/Express
- User authentication system
- Real-time notifications for appointments
- Integration with hospital management systems
- Mobile app version

## License

This project is licensed under the MIT License - see the LICENSE file for details.