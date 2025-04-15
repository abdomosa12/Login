import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LoginForm({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if there's a new user email from signup
    const newUserEmail = localStorage.getItem('newUserEmail');
    if (newUserEmail) {
      setFormData(prev => ({
        ...prev,
        email: newUserEmail
      }));
      // Clear the stored email after using it
      localStorage.removeItem('newUserEmail');
      localStorage.removeItem('newUserName');
    }
  }, []);

  // Validate form fields
  const validateForm = () => {
    // Check for empty fields
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate password length
    if (formData.password.trim().length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error state
    setError('');

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // For demo purposes, accept any email/password
      const mockUserData = {
        email: formData.email,
        displayName: formData.email.split('@')[0],
        photoURL: 'https://via.placeholder.com/150',
        isAdmin: formData.email === 'admin@restaurant.com' && formData.password === 'admin123'
      };

      // Clear form and call onLogin callback
      setFormData({
        email: '',
        password: ''
      });

      // Call the onLogin callback with the user data
      onLogin(mockUserData);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user types
    setError('');
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError('');

    try {
      // Simulate social login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock social login data
      const mockUserData = {
        email: `${provider}@example.com`,
        displayName: `${provider} User`,
        photoURL: `https://via.placeholder.com/150?text=${provider}`,
        isAdmin: false
      };

      onLogin(mockUserData);
      navigate('/dashboard');
    } catch (err) {
      setError(`${provider} login failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8 bg-white rounded-lg shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center text-cafe-brown mb-8">Welcome Back</h2>
        
        {/* Admin Credentials Info - Commented out
        <div className="mb-6 p-4 bg-cafe-brown bg-opacity-10 rounded-lg">
          <h3 className="text-sm font-medium text-cafe-brown mb-2">Admin Login:</h3>
          <p className="text-sm text-gray-600">Email: admin@restaurant.com</p>
          <p className="text-sm text-gray-600">Password: admin123</p>
        </div>
        */}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                error && !formData.email.trim() ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-cafe-brown focus:border-cafe-brown`}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                error && !formData.password.trim() ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-cafe-brown focus:border-cafe-brown`}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-sm font-medium text-cafe-brown hover:text-cafe-dark"
            >
              Forgot password?
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !formData.email.trim() || !formData.password.trim()}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading || !formData.email.trim() || !formData.password.trim()
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-cafe-brown hover:bg-cafe-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cafe-brown'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSocialLogin('Google')}
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cafe-brown disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
            Google
          </button>
          <button
            onClick={() => handleSocialLogin('Facebook')}
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cafe-brown disabled:opacity-50"
          >
            <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-5 h-5 mr-2" />
            Facebook
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <button
            onClick={() => navigate('/signup')}
            className="text-sm font-medium text-cafe-brown hover:text-cafe-dark"
          >
            Sign up
          </button>
        </div>
      </motion.div>
    </div>
  );
} 