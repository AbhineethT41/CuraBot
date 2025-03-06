@echo off
echo Setting up CuraBot...

echo Installing backend dependencies...
cd backend
npm install

echo Setting up environment variables...
echo Please enter your Groq API key:
set /p GROQ_API_KEY=

echo Updating .env file...
echo PORT=5000 > .env
echo NODE_ENV=development >> .env
echo GROQ_API_KEY=%GROQ_API_KEY% >> .env

echo Starting backend server...
start cmd /k "npm run dev"

echo Setting up frontend...
cd ..\frontend
npm install

echo Starting frontend development server...
start cmd /k "npm run dev"

echo Setup complete!
echo Backend running at http://localhost:5000
echo Frontend running at http://localhost:5173
echo.
echo Note: You need to have a valid Groq API key for the chatbot functionality to work properly.
echo If you didn't provide one, you can edit the .env file in the backend directory later.
