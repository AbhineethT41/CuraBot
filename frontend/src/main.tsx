import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { SupabaseProvider } from './context/SupabaseContext';

import App from './App';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ReschedulePage from './pages/ReschedulePage';
import ChatbotPage from './pages/ChatbotPage';
import NotFoundPage from './pages/NotFoundPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

import './index.css';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'signin',
        element: <SignInPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <UserDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'appointments',
        element: (
          <ProtectedRoute>
            <AppointmentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'appointments/reschedule/:appointmentId',
        element: (
          <ProtectedRoute>
            <ReschedulePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'chatbot',
        element: (
          <ProtectedRoute>
            <ChatbotPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <UserDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'messages',
        element: (
          <ProtectedRoute>
            <UserDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'records',
        element: (
          <ProtectedRoute>
            <UserDashboardPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SupabaseProvider supabase={supabase}>
      <RouterProvider router={router} />
    </SupabaseProvider>
  </React.StrictMode>
);