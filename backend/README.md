# CuraBot Backend

This is the backend server for the CuraBot application, which provides API endpoints for the frontend to interact with.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   # Server configuration
   PORT=5000
   NODE_ENV=development

   # Supabase configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_role_key

   # CORS configuration
   CORS_ORIGIN=http://localhost:3000

   # Groq AI configuration for chatbot (if using)
   GROQ_API_KEY=your_groq_api_key
   ```

3. Set up the database tables in Supabase:
   - Go to your Supabase project
   - Navigate to the SQL Editor
   - Copy the contents of `scripts/create-tables.sql` and run it

4. Set up Supabase Authentication webhook:
   - Go to your Supabase project
   - Navigate to Authentication > Webhooks
   - Create a new webhook with the following settings:
     - Event Type: `auth.signup`, `auth.login`
     - URL: `https://your-backend-url.com/api/webhooks/supabase`
     - HTTP Method: `POST`
     - Enable the webhook

## Running the server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/profile` - Create or update user profile
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/doctor-profile` - Create doctor profile

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/role/:role` - Get users by role (admin only)

### Doctors

- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/specialty/:specialtyId` - Get doctors by specialty
- `GET /api/doctors/available` - Get available doctors
- `POST /api/doctors` - Create a doctor profile (admin only)
- `PUT /api/doctors/:id` - Update a doctor profile
- `DELETE /api/doctors/:id` - Delete a doctor profile (admin only)

### Appointments

- `GET /api/appointments` - Get all appointments for the authenticated user
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create a new appointment
- `PUT /api/appointments/:id` - Update an appointment
- `DELETE /api/appointments/:id` - Cancel an appointment
- `GET /api/appointments/doctor/:doctorId` - Get appointments for a doctor
- `GET /api/appointments/user/:userId` - Get appointments for a user
- `GET /api/appointments/available/:doctorId` - Get available time slots for a doctor

### Chatbot

- `POST /api/chatbot/message` - Send a message to the chatbot
- `POST /api/chatbot/analyze-symptoms` - Analyze symptoms and get doctor recommendations

### Notifications

- `GET /api/notifications` - Get notifications for the authenticated user
- `PUT /api/notifications/:id/read` - Mark a notification as read
- `DELETE /api/notifications/:id` - Delete a notification

### Messages

- `GET /api/messages/conversations` - Get all conversations for the authenticated user
- `GET /api/messages/conversation/:conversationId` - Get messages in a conversation
- `POST /api/messages/send` - Send a message
- `POST /api/messages/conversation` - Create a new conversation
- `PUT /api/messages/read/:conversationId` - Mark messages in a conversation as read
- `GET /api/messages/unread` - Get count of unread messages

### Specialties

- `GET /api/specialties` - Get all specialties
- `GET /api/specialties/:id` - Get a specialty by ID
- `POST /api/specialties` - Create a new specialty (admin only)
- `PUT /api/specialties/:id` - Update a specialty (admin only)
- `DELETE /api/specialties/:id` - Delete a specialty (admin only)
- `GET /api/specialties/symptom/:symptomId` - Get specialties related to a symptom

### Symptoms

- `GET /api/symptoms` - Get all symptoms
- `GET /api/symptoms/:id` - Get a symptom by ID
- `GET /api/symptoms/search` - Search symptoms by name or keywords
- `GET /api/symptoms/:id/specialties` - Get specialties related to a symptom
- `POST /api/symptoms` - Create a new symptom (admin only)
- `PUT /api/symptoms/:id` - Update a symptom (admin only)
- `DELETE /api/symptoms/:id` - Delete a symptom (admin only)
- `POST /api/symptoms/map-specialty` - Map a symptom to a specialty with a weight (admin only)

### Webhooks

- `POST /api/webhooks/supabase` - Handle Supabase authentication events

## Database Schema

### Users Table

The users table stores user profile information:

| Column      | Type      | Description                           |
|-------------|-----------|---------------------------------------|
| id          | UUID      | Primary key                           |
| auth_id     | UUID      | Supabase Auth ID (foreign key)        |
| email       | VARCHAR   | User's email address                  |
| first_name  | VARCHAR   | User's first name                     |
| last_name   | VARCHAR   | User's last name                      |
| phone       | VARCHAR   | User's phone number                   |
| role        | VARCHAR   | User role (patient or doctor)         |
| created_at  | TIMESTAMP | Creation timestamp                    |
| updated_at  | TIMESTAMP | Last update timestamp                 |
| last_login  | TIMESTAMP | Last login timestamp                  |
| is_active   | BOOLEAN   | Whether the user is active            |