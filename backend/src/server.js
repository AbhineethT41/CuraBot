/**
 * CuraBot Backend Server
 * Main entry point for the application
 */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('./config');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/users');
const chatbotRoutes = require('./routes/chatbot');
const appointmentRoutes = require('./routes/appointments');
const doctorRoutes = require('./routes/doctors');
const webhookRoutes = require('./routes/webhookRoutes');
const notificationRoutes = require('./routes/notifications');
const messageRoutes = require('./routes/messages');
const specialtyRoutes = require('./routes/specialties');
const symptomRoutes = require('./routes/symptoms');

// Initialize express app
const app = express();

// Apply middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/specialties', specialtyRoutes);
app.use('/api/symptoms', symptomRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(config.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.NODE_ENV} mode`);
});

module.exports = app; // Export for testing