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