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

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;