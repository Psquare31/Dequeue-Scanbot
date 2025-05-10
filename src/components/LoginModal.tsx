import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Form validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
            onClick={closeLoginModal}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Sign In</h3>
                <button
                  onClick={closeLoginModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p>{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your password"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    
                    <div className="text-sm">
                      <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isLoading 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>
                
                {/* Registration hint */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      Sign up
                    </a>
                  </p>
                </div>
                
                {/* Demo login hint */}
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-xs text-blue-700 text-center">
                    For demo purposes, any email and password (min 6 chars) will work
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;