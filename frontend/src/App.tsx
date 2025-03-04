import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import ChatbotPage from './pages/ChatbotPage';
import AppointmentsPage from './pages/AppointmentsPage';
import UserDashboardPage from './pages/UserDashboardPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/chatbot" element={
                <ProtectedRoute>
                  <ChatbotPage />
                </ProtectedRoute>
              } />
              <Route path="/appointments" element={
                <ProtectedRoute>
                  <AppointmentsPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute requiredRole="patient">
                  <UserDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;