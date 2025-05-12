import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  
  // Refs for animation
  const containerRef = useRef(null);
  const bubbleRefs = useRef([]);
  
  // Animation states
  const [animationPhase, setAnimationPhase] = useState(0);
  const [particleElements, setParticleElements] = useState([]);
  
  const navigate = useNavigate();
  const { login, isAuthenticated, userProfile, isPlayground, loginError } = useAuth();

  // Generate floating particles on component mount
  useEffect(() => {
    // Generate particles with different properties
    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        id: i,
        size: Math.random() * 8 + 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
        color: i % 5 === 0 ? '#9F7AEA' : 
               i % 4 === 0 ? '#4FD1C5' : 
               i % 3 === 0 ? '#F6AD55' : 
               i % 2 === 0 ? '#68D391' : 
               '#FC8181'
      });
    }
    setParticleElements(particles);

    // Start animation sequence
    const animationTimer = setTimeout(() => {
      setAnimationPhase(1);
      
      const phaseTimer = setTimeout(() => {
        setAnimationPhase(2);
        
        const finalTimer = setTimeout(() => {
          setAnimationPhase(3);
        }, 600);
        
        return () => clearTimeout(finalTimer);
      }, 800);
      
      return () => clearTimeout(phaseTimer);
    }, 300);

    return () => clearTimeout(animationTimer);
  }, []);

  // On container load, create bubble animation
  useEffect(() => {
    if (containerRef.current && animationPhase >= 2) {
      const createBubbleEffect = () => {
        const container = containerRef.current;
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        const size = Math.floor(Math.random() * 60) + 10;
        const bubble = document.createElement('div');
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.position = 'absolute';
        bubble.style.borderRadius = '50%';
        bubble.style.bottom = '-20px';
        bubble.style.left = `${Math.floor(Math.random() * rect.width)}px`;
        bubble.style.backgroundColor = [
          'rgba(79, 209, 197, 0.3)', 
          'rgba(159, 122, 234, 0.3)',
          'rgba(104, 211, 145, 0.3)'
        ][Math.floor(Math.random() * 3)];
        bubble.style.transform = 'translateY(0)';
        bubble.style.opacity = '0.6';
        bubble.style.zIndex = '0';
        bubble.style.transition = `transform ${Math.floor(Math.random() * 8) + 6}s ease-out, opacity 6s ease-in`;
        
        container.appendChild(bubble);
        bubbleRefs.current.push(bubble);
        
        // Animate bubbles upward with slight sideways movement
        setTimeout(() => {
          bubble.style.transform = `translateY(-${rect.height + size}px) translateX(${Math.floor(Math.random() * 100) - 50}px)`;
          bubble.style.opacity = '0';
        }, 100);
        
        // Remove bubbles after animation
        setTimeout(() => {
          if (container.contains(bubble)) {
            container.removeChild(bubble);
          }
          bubbleRefs.current = bubbleRefs.current.filter(b => b !== bubble);
        }, 10000);
      };
      
      // Create new bubbles periodically
      const intervalId = setInterval(createBubbleEffect, 1500);
      
      // Initial bubbles
      for (let i = 0; i < 5; i++) {
        setTimeout(createBubbleEffect, i * 300);
      }
      
      return () => {
        clearInterval(intervalId);
        // Clean up existing bubbles on unmount
        bubbleRefs.current.forEach(bubble => {
          if (containerRef.current && containerRef.current.contains(bubble)) {
            containerRef.current.removeChild(bubble);
          }
        });
      };
    }
  }, [containerRef, animationPhase]);

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

  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen overflow-hidden relative flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #f0fdfa 100%)'
      }}
    >
      {/* Floating particles */}
      {particleElements.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            opacity: 0.5,
            filter: 'blur(1px)',
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Abstract shapes */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-teal-200 to-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Main content */}
      <div className={`z-10 max-w-md w-full px-4 sm:px-0 transition-opacity duration-1000 ease-out ${animationPhase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        {/* Logo animation container */}
        <div className="mx-auto w-32 h-32 mb-8 relative">
          <div className={`absolute inset-0 transition-transform duration-1000 ease-out ${animationPhase >= 2 ? 'scale-100' : 'scale-0'}`}>
            {/* Inner circles with scale animation */}
            <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-lg">
              {/* Outer circle with teal gradient */}
              <circle 
                cx="50" 
                cy="50" 
                r="48" 
                fill="none" 
                stroke="url(#outerGradient)" 
                strokeWidth="2" 
                className={`transition-all duration-1000 ease-out ${animationPhase >= 2 ? 'opacity-100 stroke-dashoffset-0' : 'opacity-0 stroke-dashoffset-283'}`}
                strokeDasharray="283" 
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
              
              {/* Inner design - combines heart with mind/brain concept */}
              <g className={`transition-all duration-1000 delay-500 ${animationPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{ transformOrigin: 'center' }}>
                {/* Heart part */}
                <path 
                  d="M50,35 C45,25 25,25 25,40 C25,55 50,70 50,70 C50,70 75,55 75,40 C75,25 55,25 50,35 Z" 
                  fill="url(#heartGradient)"
                  className="animate-pulse" 
                  style={{ animationDuration: '3s' }}
                />
                
                {/* Brain/mind part - stylized lines */}
                <path 
                  d="M40,35 C35,25 45,15 55,22 M60,35 C65,25 55,15 45,22" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  fill="none"
                  className={`transition-all duration-1000 delay-1000 ${animationPhase >= 3 ? 'opacity-70 stroke-dashoffset-0' : 'opacity-0 stroke-dashoffset-283'}`}
                  strokeDasharray="30" 
                  strokeDashoffset="0"
                />
                
                {/* Connection patterns */}
                <circle cx="37" cy="32" r="2" fill="white" className={`transition-all duration-300 delay-1500 ${animationPhase >= 3 ? 'opacity-80' : 'opacity-0'}`} />
                <circle cx="63" cy="32" r="2" fill="white" className={`transition-all duration-300 delay-1600 ${animationPhase >= 3 ? 'opacity-80' : 'opacity-0'}`} />
                <circle cx="50" cy="25" r="2" fill="white" className={`transition-all duration-300 delay-1700 ${animationPhase >= 3 ? 'opacity-80' : 'opacity-0'}`} />
              </g>
              
              {/* Gradients definitions */}
              <defs>
                <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4FD1C5" />
                  <stop offset="100%" stopColor="#9F7AEA" />
                </linearGradient>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9F7AEA" />
                  <stop offset="100%" stopColor="#FC8181" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        
        {/* Brand and welcome text with staggered animation */}
        <div className="text-center mb-8">
          <h1 
            className={`text-3xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent transition-all duration-700 ease-out ${animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Mental Companion
          </h1>
          <p 
            className={`mt-3 text-gray-600 transition-all duration-700 delay-200 ease-out ${animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Welcome back to your wellness journey
          </p>
        </div>

        {/* Card with glassmorphism effect */}
        <div 
          className={`backdrop-blur-xl bg-white/70 rounded-3xl overflow-hidden shadow-xl border border-white/50 dark:border-gray-800/30 transition-all duration-1000 ease-out ${animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
          style={{ boxShadow: '0 10px 40px -15px rgba(0, 0, 0, 0.1), 0 5px 20px -5px rgba(0, 0, 0, 0.05)' }}
        >
          {/* Error message with smooth appearance */}
          {(error || loginError) && (
            <div className="px-6 pt-6 animate-in fade-in duration-300">
              <div className="rounded-2xl bg-red-50/80 backdrop-blur-sm p-4 border border-red-100">
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
            </div>
          )}

          <div className="p-8">
            {/* Authentication button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl text-white text-lg font-medium shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
              style={{
                background: 'linear-gradient(135deg, #4FD1C5 0%, #9F7AEA 100%)',
                boxShadow: '0 10px 20px -10px rgba(79, 209, 197, 0.5), 0 10px 20px -10px rgba(159, 122, 234, 0.5)'
              }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <svg className="mr-3 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign in with Internet Identity
                </>
              )}
            </button>

            {/* Divider with text */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300/50 dark:border-gray-600/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/70 backdrop-blur-sm text-gray-500 dark:text-gray-400 rounded-full">Secure & Private</span>
                </div>
              </div>
            </div>

            {/* Benefits section with nicer UI */}
            <div className="mt-6 grid grid-cols-1 gap-6">
              <div className="flex space-x-3 items-start bg-gradient-to-r from-teal-50/60 to-purple-50/60 p-4 rounded-2xl transition-all hover:bg-gradient-to-r hover:from-teal-50/80 hover:to-purple-50/80">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-700">Password-Free Authentication</h3>
                  <p className="mt-1 text-sm text-gray-500">Secure entry without the need to remember complex passwords</p>
                </div>
              </div>
              
              <div className="flex space-x-3 items-start bg-gradient-to-r from-purple-50/60 to-teal-50/60 p-4 rounded-2xl transition-all hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-teal-50/80">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-700">End-to-End Encryption</h3>
                  <p className="mt-1 text-sm text-gray-500">Your conversations and data remain private and encrypted</p>
                </div>
              </div>
            </div>
            
            {/* Don't have an account section */}
            <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
              <p className="text-sm text-gray-600">
                New to Mental Companion?{' '}
                <Link to="/signup" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer with debug info toggle */}
        <div className="mt-8 text-center">
          <button 
            onClick={toggleDebug} 
            className="text-xs text-gray-400 hover:text-gray-600 mb-2 transition-colors"
          >
            {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
          </button>
          
          {showDebug && (
            <div className="text-xs text-gray-500 bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50">
              <p>Environment: {isPlayground ? 'Playground/Production' : 'Local Development'}</p>
              <p>Identity Provider: {isPlayground ? 'https://identity.ic0.app' : 'http://localhost:4943/...'}</p>
              <p>Current URL: {window.location.href}</p>
            </div>
          )}
          
          <p className="text-xs text-gray-400 mt-2">
            &copy; {new Date().getFullYear()} Mental Health Companion
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Current date: 2025-05-12 13:20:15 | User: mamatqurtifa
          </p>
        </div>
      </div>
      
      {/* Add the keyframes for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-15px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}

export default Login;