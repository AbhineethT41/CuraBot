/**
 * Models Index
 * Export all models for easy importing
 */

const User = require('./User');
const Doctor = require('./Doctor');
const Specialty = require('./Specialty');
const Symptom = require('./Symptom');
const Appointment = require('./Appointment');
const AvailableSlot = require('./AvailableSlot');
const ChatMessage = require('./ChatMessage');

module.exports = {
  User,
  Doctor,
  Specialty,
  Symptom,
  Appointment,
  AvailableSlot,
  ChatMessage
};
