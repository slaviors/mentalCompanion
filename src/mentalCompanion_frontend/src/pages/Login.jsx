import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, userProfile, isPlayground, loginError } = useAuth();

  // Animation states
  const [animationProgress, setAnimationProgress] = useState(0);
  const [leafGrowth, setLeafGrowth] = useState(0);
  const [pulseEffect, setPulseEffect] = useState(1);

  // Start animation when component mounts
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setAnimationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 0.5;
      });
    }, 30);
    
    const leafInterval = setInterval(() => {
      setLeafGrowth(prev => {
        if (prev >= 100) {
          clearInterval(leafInterval);
          return 100;
        }
        return prev + 0.3;
      });
    }, 40);
    
    // Heart pulse animation
    const pulseInterval = setInterval(() => {
      setPulseEffect(prev => (prev === 1 ? 1.05 : 1));
    }, 1000);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(leafInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  // If authenticated and has profile, redirect to /chats
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      navigate('/chats');
    }
  }, [isAuthenticated, userProfile, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login();
      // Login process is handled by AuthContext including success callbacks
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to authenticate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-teal-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          {/* Custom SVG Animation */}
          <div className="w-40 h-40 relative">
            {/* Base Circle */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#E2E8F0" 
                strokeWidth="2"
              />
              
              {/* Animated Circle */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="url(#gradient)" 
                strokeWidth="2"
                strokeDasharray="283"
                strokeDashoffset={283 - (animationProgress / 100) * 283}
                transform="rotate(-90 50 50)"
                strokeLinecap="round"
                className="transition-all duration-300 ease-out"
              />
              
              {/* Define gradient for the circle */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4FD1C5" />
                  <stop offset="100%" stopColor="#9F7AEA" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Heart in the middle */}
            <svg 
              viewBox="0 0 100 100" 
              className="absolute inset-0 w-full h-full transition-transform duration-1000"
              style={{ 
                opacity: animationProgress / 100,
                transform: `scale(${pulseEffect})`
              }}
            >
              <path 
                d="M50,30 C35,10 10,20 10,40 C10,60 30,70 50,90 C70,70 90,60 90,40 C90,20 65,10 50,30 Z" 
                fill="url(#heartGradient)" 
                transform={`scale(${0.6 + (animationProgress / 100) * 0.4})`}
                className="transition-all duration-300 ease-out"
              />
              
              {/* Define gradient for the heart */}
              <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9F7AEA" />
                  <stop offset="100%" stopColor="#4FD1C5" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Animated leaves/growth elements */}
            <svg 
              viewBox="0 0 100 100" 
              className="absolute inset-0 w-full h-full"
              style={{ opacity: leafGrowth > 30 ? (leafGrowth - 30) / 70 : 0 }}
            >
              {/* Right leaf */}
              <path 
                d="M50,100 C60,85 65,75 55,60 C70,70 75,60 70,50" 
                stroke="#68D391" 
                strokeWidth="2"
                fill="none"
                strokeDasharray="100"
                strokeDashoffset={100 - (Math.max(0, leafGrowth - 30) / 70) * 100}
                className="transition-all duration-300 ease-out"
                strokeLinecap="round"
              />
              
              {/* Left leaf */}
              <path 
                d="M50,100 C40,85 35,75 45,60 C30,70 25,60 30,50" 
                stroke="#68D391" 
                strokeWidth="2"
                fill="none"
                strokeDasharray="100"
                strokeDashoffset={100 - (Math.max(0, leafGrowth - 40) / 60) * 100}
                className="transition-all duration-300 ease-out"
                strokeLinecap="round"
              />
              
              {/* Small leaves */}
              <path 
                d="M46,65 C42,60 44,55 48,53" 
                stroke="#68D391" 
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="20"
                strokeDashoffset={20 - (Math.max(0, leafGrowth - 50) / 50) * 20}
                className="transition-all duration-300 ease-out"
                strokeLinecap="round"
              />
              
              <path 
                d="M54,65 C58,60 56,55 52,53" 
                stroke="#68D391" 
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="20"
                strokeDashoffset={20 - (Math.max(0, leafGrowth - 60) / 40) * 20}
                className="transition-all duration-300 ease-out"
                strokeLinecap="round"
              />
              
              {/* Tiny dots for additional detail */}
              <circle 
                cx="40" 
                cy="75" 
                r="1.5" 
                fill="#68D391"
                style={{ opacity: Math.max(0, (leafGrowth - 70) / 30) }}
              />
              <circle 
                cx="60" 
                cy="75" 
                r="1.5" 
                fill="#68D391"
                style={{ opacity: Math.max(0, (leafGrowth - 75) / 25) }}
              />
              <circle 
                cx="45" 
                cy="85" 
                r="1.5" 
                fill="#68D391"
                style={{ opacity: Math.max(0, (leafGrowth - 80) / 20) }}
              />
              <circle 
                cx="55" 
                cy="85" 
                r="1.5" 
                fill="#68D391"
                style={{ opacity: Math.max(0, (leafGrowth - 85) / 15) }}
              />
            </svg>
            
            {/* Ripple effect circles */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              <circle 
                cx="50" 
                cy="50" 
                r={10 + (animationProgress * 0.2)} 
                fill="none" 
                stroke="#9F7AEA" 
                strokeWidth="0.5"
                opacity={animationProgress > 50 ? (100 - animationProgress) / 50 * 0.3 : 0}
              />
              <circle 
                cx="50" 
                cy="50" 
                r={10 + (animationProgress * 0.35)} 
                fill="none" 
                stroke="#4FD1C5" 
                strokeWidth="0.5"
                opacity={animationProgress > 30 ? (100 - animationProgress) / 70 * 0.2 : 0}
              />
            </svg>
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-teal-800">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w">
          Sign in to continue your mental wellness journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-purple-100">
          {(error || loginError) && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error || loginError}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div className="mt-2">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in with Internet Identity"
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Why Internet Identity?</span>
              </div>
            </div>

            <div className="mt-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-sm text-gray-600">Secure authentication with no passwords to remember</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-sm text-gray-600">Your data remains private and encrypted</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-sm text-gray-600">Simple one-click authentication process</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Debug info - dapat dihapus di production */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>Environment: {isPlayground ? 'Playground/Production' : 'Local Development'}</p>
        <p>Identity Provider: {isPlayground ? 'https://identity.ic0.app' : 'http://localhost:4943/...'}</p>
        <p>Current URL: {window.location.href}</p>
        <p>&copy; {new Date().getFullYear()} Mental Health Companion</p>
        <p className="mt-1">Current date: {new Date().toLocaleDateString()} | User: mamatqurtifa</p>
      </div>
    </div>
  );
}

export default Login;