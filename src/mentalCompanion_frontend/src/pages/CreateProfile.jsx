import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CreateProfile() {
  const [name, setName] = useState('');
  const [mood, setMood] = useState('neutral');
  const [goals, setGoals] = useState([]);
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [animationStep, setAnimationStep] = useState(0);
  const [floatingElements, setFloatingElements] = useState([]);
  
  const { isAuthenticated, createProfile, isPlayground } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Generate floating elements for background animation
  useEffect(() => {
    const elements = [];
    const shapes = ['circle', 'triangle', 'square', 'hexagon'];
    const colors = ['#9F7AEA', '#4FD1C5', '#F6AD55', '#68D391'];
    
    for (let i = 0; i < 15; i++) {
      elements.push({
        id: i,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 40 + 10,
        positionX: Math.random() * 100,
        positionY: Math.random() * 100,
        duration: Math.random() * 20 + 20,
        delay: Math.random() * 5
      });
    }
    
    setFloatingElements(elements);
  }, []);

  // Animation step controller
  useEffect(() => {
    const timer = setTimeout(() => {
      if (animationStep < 3) {
        setAnimationStep(animationStep + 1);
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [animationStep]);

  const handleGoalToggle = (goal) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter(g => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Creating a comprehensive profile object
      const profileData = {
        name: name.trim(),
        mood,
        goals,
        bio: bio.trim(),
        createdAt: new Date().toISOString()
      };
      
      // Using the createProfile function from AuthContext
      const result = await createProfile(name);
      
      if (result) {
        navigate('/chats');
      } else {
        setError('Failed to create profile. Please try again.');
      }
    } catch (err) {
      console.error('Profile creation error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render shapes for floating elements
  const renderShape = (element) => {
    const baseStyle = {
      width: `${element.size}px`,
      height: `${element.size}px`,
      backgroundColor: element.color,
      opacity: 0.2,
      position: 'absolute',
      left: `${element.positionX}%`,
      top: `${element.positionY}%`,
      animation: `float ${element.duration}s ease-in-out infinite`,
      animationDelay: `${element.delay}s`,
    };

    switch (element.shape) {
      case 'circle':
        return <div style={{...baseStyle, borderRadius: '50%'}} key={element.id} />;
      case 'triangle':
        return (
          <div 
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${element.size/2}px solid transparent`,
              borderRight: `${element.size/2}px solid transparent`,
              borderBottom: `${element.size}px solid ${element.color}`,
              opacity: 0.2,
            }} 
            key={element.id}
          />
        );
      case 'square':
        return <div style={{...baseStyle, borderRadius: '4px'}} key={element.id} />;
      case 'hexagon':
        return (
          <div style={{
            ...baseStyle,
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          }} key={element.id} />
        );
      default:
        return <div style={baseStyle} key={element.id} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(5deg);
            }
          }
        `}</style>
        {floatingElements.map(renderShape)}
      </div>
      
      <div className="relative z-10 max-w-md mx-auto">
        <div className="text-center mb-10">
          <div className="mx-auto h-24 w-24 relative mb-4">
            {/* SVG Tree Animation */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Tree trunk */}
              <path 
                d="M50,100 L50,60" 
                stroke="#A0845C" 
                strokeWidth="5" 
                strokeLinecap="round"
                className={`transition-all duration-700 ${animationStep >= 0 ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  strokeDasharray: 40, 
                  strokeDashoffset: animationStep >= 0 ? 0 : 40 
                }}
              />
              
              {/* Main branches */}
              <path 
                d="M50,70 L30,55 M50,70 L70,55 M50,80 L30,65 M50,80 L70,65" 
                stroke="#A0845C" 
                strokeWidth="3" 
                strokeLinecap="round"
                className={`transition-all duration-700 delay-300 ${animationStep >= 1 ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  strokeDasharray: 100, 
                  strokeDashoffset: animationStep >= 1 ? 0 : 100 
                }}
              />
              
              {/* Leaves */}
              <circle 
                cx="30" 
                cy="55" 
                r="8" 
                fill="#68D391" 
                className={`transition-all duration-500 delay-500 ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                transform="translate(0,0)"
              />
              <circle 
                cx="70" 
                cy="55" 
                r="8" 
                fill="#68D391" 
                className={`transition-all duration-500 delay-600 ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                transform="translate(0,0)"
              />
              <circle 
                cx="30" 
                cy="65" 
                r="8" 
                fill="#68D391" 
                className={`transition-all duration-500 delay-700 ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                transform="translate(0,0)"
              />
              <circle 
                cx="70" 
                cy="65" 
                r="8" 
                fill="#68D391" 
                className={`transition-all duration-500 delay-800 ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                transform="translate(0,0)"
              />
              <circle 
                cx="50" 
                cy="45" 
                r="12" 
                fill="#9F7AEA" 
                className={`transition-all duration-500 delay-900 ${animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                transform="translate(0,0)"
              />
              
              {/* Flowering effect */}
              <circle 
                cx="50" 
                cy="45" 
                r="16" 
                fill="none" 
                stroke="#9F7AEA" 
                strokeWidth="0.5" 
                strokeDasharray="3,2"
                className={`transition-all duration-1000 delay-1000 ${animationStep >= 3 ? 'opacity-30' : 'opacity-0'}`}
              />
              <circle 
                cx="50" 
                cy="45" 
                r="20" 
                fill="none" 
                stroke="#9F7AEA" 
                strokeWidth="0.5" 
                strokeDasharray="2,2"
                className={`transition-all duration-1000 delay-1100 ${animationStep >= 3 ? 'opacity-20' : 'opacity-0'}`}
              />
            </svg>
          </div>
          
          <h2 className="text-3xl font-extrabold text-teal-800 tracking-tight">
            Create Your Profile
          </h2>
          <p className="mt-2 text-base text-gray-600">
            Let's personalize your mental wellness journey
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden border border-purple-100">
          {error && (
            <div className="bg-red-50 p-4 rounded-t-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-8">
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  What should we call you?
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-300"
                    placeholder="Your name or nickname"
                  />
                </div>
              </div>

              {/* Current Mood Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling today?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['great', 'good', 'neutral', 'down', 'stressed'].map((moodOption) => (
                    <div 
                      key={moodOption}
                      onClick={() => setMood(moodOption)}
                      className={`
                        flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all duration-300
                        ${mood === moodOption 
                          ? 'bg-teal-100 ring-2 ring-teal-500 ring-offset-2 transform scale-105' 
                          : 'bg-gray-50 hover:bg-gray-100'}
                      `}
                    >
                      <div className="text-2xl mb-1">
                        {moodOption === 'great' && '😄'}
                        {moodOption === 'good' && '🙂'}
                        {moodOption === 'neutral' && '😐'}
                        {moodOption === 'down' && '😔'}
                        {moodOption === 'stressed' && '😖'}
                      </div>
                      <span className="text-xs capitalize">{moodOption}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wellness Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What are your wellness goals? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'reduce-stress', label: 'Reduce Stress', icon: '🧘‍♀️' },
                    { id: 'improve-sleep', label: 'Better Sleep', icon: '😴' },
                    { id: 'anxiety-management', label: 'Manage Anxiety', icon: '🌱' },
                    { id: 'daily-mindfulness', label: 'Daily Mindfulness', icon: '🌈' },
                    { id: 'build-confidence', label: 'Build Confidence', icon: '💪' },
                    { id: 'explore-feelings', label: 'Explore Feelings', icon: '❤️' }
                  ].map((goal) => (
                    <div 
                      key={goal.id}
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`
                        flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300
                        ${goals.includes(goal.id) 
                          ? 'bg-purple-100 ring-2 ring-purple-500 ring-offset-1' 
                          : 'bg-gray-50 hover:bg-gray-100'}
                      `}
                    >
                      <span className="text-xl mr-2">{goal.icon}</span>
                      <span className="text-sm">{goal.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Short Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Tell us a bit about yourself (optional)
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-300"
                    placeholder="What brings you here? What are you hoping to achieve?"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  This helps us personalize your experience (max 200 characters)
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating your profile...
                    </span>
                  ) : (
                    "Complete Profile and Continue"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Debug info - dapat dihapus di production */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Environment: {isPlayground ? 'Playground/Production' : 'Local Development'}</p>
          <p>&copy; {new Date().getFullYear()} Mental Health Companion</p>
          <p className="mt-1">Current date: {new Date().toLocaleDateString()} | User: mamatqurtifa</p>
        </div>
      </div>
    </div>
  );
}

export default CreateProfile;