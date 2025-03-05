import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;