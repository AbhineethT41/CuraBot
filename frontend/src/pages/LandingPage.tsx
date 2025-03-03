import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/chatbot');
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Skip the Line, See the Right Doctor, Right Now.
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                CuraBot helps you identify your symptoms, recommends the right specialist, and books your appointment in minutes.
              </p>
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                Get Started
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                alt="Doctor with patient"
                className="rounded-lg shadow-2xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How CuraBot Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent chatbot guides you through the entire process, from symptom assessment to appointment confirmation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardBody className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Describe Your Symptoms</h3>
                <p className="text-gray-600">
                  Chat with our AI assistant and describe your symptoms. CuraBot will analyze your condition.
                </p>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Find the Right Specialist</h3>
                <p className="text-gray-600">
                  Get matched with the appropriate medical specialist based on your symptoms and needs.
                </p>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Book Your Appointment</h3>
                <p className="text-gray-600">
                  Choose a convenient time slot and book your appointment with just a few clicks.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CuraBot</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing the way patients connect with healthcare providers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                <p className="text-gray-600">
                  No more waiting on hold or standing in line. Book appointments 24/7 from anywhere.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-2">Find the Right Doctor</h3>
                <p className="text-gray-600">
                  Our intelligent system matches your symptoms with the appropriate medical specialist.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-2">Easy Management</h3>
                <p className="text-gray-600">
                  View and manage all your appointments in one place. Reschedule or cancel with ease.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-gray-600">
                  Your health information is encrypted and secure. We prioritize your privacy.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" onClick={handleGetStarted}>
              Start Using CuraBot Now
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from patients who have used CuraBot to improve their healthcare experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">Sarah M.</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "CuraBot saved me hours of waiting on the phone. I described my symptoms and got an appointment with a specialist the same week!"
                </p>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">David R.</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The chatbot correctly identified that I needed to see a neurologist based on my symptoms. The whole process was smooth and efficient."
                </p>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">Jennifer K.</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "As a busy mom, I don't have time to wait on hold. CuraBot let me book appointments for my kids after hours when I finally had time."
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Healthcare Experience?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of patients who are saving time and getting the right care with CuraBot.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;