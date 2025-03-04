import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageSquare, Calendar, User, Stethoscope, Home, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Define public links available to all users
  const publicLinks = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
  ];

  // Define links that require authentication
  const authLinks = [
    { path: '/chatbot', label: 'Chatbot', icon: <MessageSquare size={18} /> },
    { path: '/appointments', label: 'Appointments', icon: <Calendar size={18} /> },
  ];

  // Define role-specific links
  const patientLinks = [
    { path: '/dashboard', label: 'My Profile', icon: <User size={18} /> },
  ];

  const doctorLinks = [
    { path: '/doctor-dashboard', label: 'Doctor Dashboard', icon: <Stethoscope size={18} /> },
  ];

  // Determine which links to show based on authentication state and user role
  const getNavLinks = () => {
    let links = [...publicLinks];
    
    if (user) {
      links = [...links, ...authLinks];
      
      if (user.user_metadata?.user_type === 'doctor') {
        links = [...links, ...doctorLinks];
      } else {
        links = [...links, ...patientLinks];
      }
    }
    
    return links;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-blue-600 font-bold text-xl">CuraBot</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1.5">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            
            {/* Authentication links */}
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-1.5"><LogOut size={18} /></span>
                Sign Out
              </button>
            ) : (
              <Link
                to="/signin"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/signin')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1.5"><LogIn size={18} /></span>
                Sign In
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            
            {/* Authentication links for mobile */}
            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2"><LogOut size={18} /></span>
                Sign Out
              </button>
            ) : (
              <Link
                to="/signin"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/signin')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2"><LogIn size={18} /></span>
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;