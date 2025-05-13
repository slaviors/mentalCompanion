import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Fungsi helper untuk format tanggal dari BigInt
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    // Jika timestamp adalah BigInt, konversi dengan aman
    let timestampMs;
    if (typeof timestamp === 'bigint') {
      // Konversi BigInt ke string terlebih dahulu, lalu ke number
      timestampMs = Number(timestamp.toString()) / 1_000_000;
    } else {
      timestampMs = Number(timestamp) / 1_000_000;
    }
    
    const date = new Date(timestampMs);
    
    // Validasi date
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Format date
    const today = new Date();
    const isToday = date.getDate() === today.getDate() &&
                   date.getMonth() === today.getMonth() &&
                   date.getFullYear() === today.getFullYear();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Unknown date';
  }
};

export default function Layout({ children }) {
  const { isAuthenticated, logout, userProfile, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsDropdownOpen(false);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Determines if the navigation item is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Get the first name from the user profile
  const getFirstName = () => {
    if (!userProfile || !userProfile.name) return 'User';
    return userProfile.name.split(' ')[0];
  };

  // Navigation items
  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Chats', path: '/chats', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { name: 'Journal', path: '/journal', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { name: 'Resources', path: '/resources', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Settings', path: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  // Menghapus inline style yang menyebabkan CSP error
  const fadeInAnimation = {
    animation: 'fadeIn 0.2s ease-out forwards',
  };

  // Render date safely
  const renderCreatedAt = () => {
    if (!userProfile?.createdAt) return 'Unknown';
    return formatTimestamp(userProfile.createdAt);
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Top Navigation Bar */}
      <header 
        className={`
          sticky top-0 z-40 transition-all duration-300 backdrop-blur-sm
          ${scrolled 
            ? 'bg-white/90 shadow-md' 
            : 'bg-white'}
        `}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="h-8 w-8 mr-2 transition-transform duration-300 group-hover:scale-110">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#logoGradient)" strokeWidth="8" />
                    <path 
                      d="M50,30 C35,10 10,20 10,40 C10,60 30,70 50,90 C70,70 90,60 90,40 C90,20 65,10 50,30 Z" 
                      fill="url(#logoGradient)" 
                      className="origin-center transform scale-75"
                    />
                    <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4FD1C5" />
                        <stop offset="100%" stopColor="#9F7AEA" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent">
                  Mental Companion
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - centered for better balance */}
            <div className="hidden md:flex md:items-center md:justify-center md:flex-1 mx-4">
              {isAuthenticated && (
                <nav className="flex space-x-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3 py-2 text-sm font-medium rounded-md flex items-center transition-all duration-200
                        ${isActive(item.path) 
                          ? 'bg-gradient-to-r from-teal-500/10 to-purple-500/10 text-teal-600 shadow-sm' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-teal-600'}`}
                    >
                      <svg 
                        className={`mr-1.5 h-5 w-5 transition-colors ${isActive(item.path) ? 'text-teal-500' : 'text-gray-400 group-hover:text-teal-500'}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                      </svg>
                      {item.name}
                    </Link>
                  ))}
                </nav>
              )}
            </div>

            {/* Right section - User Profile or Auth buttons */}
            <div className="flex items-center">
              {/* Profile dropdown - Available on all screen sizes */}
              {isAuthenticated && userProfile ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 p-1"
                    aria-expanded={isDropdownOpen}
                  >
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {getFirstName()}
                    </span>
                    {/* Dropdown indicator */}
                    <svg 
                      className={`hidden sm:block h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    {/* Profile avatar */}
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white font-semibold shadow-sm">
                      {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
                    </div>
                  </button>

                  {/* Dropdown menu with animation */}
                  {isDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50" 
                      style={fadeInAnimation}
                    >
                      <div className="px-4 py-3 text-sm text-gray-700 border-b">
                        <p className="font-medium text-gray-900">{userProfile.name}</p>
                        <p className="truncate text-gray-500 text-xs mt-1">Member since {renderCreatedAt()}</p>
                      </div>
                      
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Your Profile
                      </Link>
                      
                      <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={navItems[4].icon} />
                        </svg>
                        Settings
                      </Link>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={handleLogoutClick}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="mr-2 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : !isLoading && !isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-teal-500 to-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-teal-600 hover:to-purple-600 transition-all shadow-sm hover:shadow"
                  >
                    Sign up
                  </Link>
                </div>
              ) : null}

              {/* Mobile menu button */}
              <div className="ml-3 md:hidden">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 transition-colors"
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu with animation */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-1 pb-3 pt-2 px-2">
            {isAuthenticated && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-md py-2 pl-3 pr-4 text-base font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-teal-500/10 to-purple-500/10 text-teal-700 border-l-4 border-teal-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300'
                }`}
              >
                <svg 
                  className={`mr-3 h-5 w-5 ${isActive(item.path) ? 'text-teal-500' : 'text-gray-400'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                {item.name}
              </Link>
            ))}
          </div>

          {isAuthenticated && userProfile ? (
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white font-semibold shadow-sm">
                    {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{userProfile.name}</div>
                  <div className="text-xs text-gray-500">Member since {renderCreatedAt()}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Link
                  to="/profile"
                  className="flex items-center rounded-md px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                >
                  <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center rounded-md px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                >
                  <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={navItems[4].icon} />
                  </svg>
                  Settings
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="flex w-full items-center rounded-md px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="mr-3 h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          ) : !isLoading && !isAuthenticated ? (
            <div className="border-t border-gray-200 py-4 px-4 flex flex-col space-y-3">
              <Link
                to="/login"
                className="flex justify-center items-center w-full px-4 py-2 text-base font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
              >
                <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Log in
              </Link>
              <Link
                to="/signup"
                className="flex justify-center items-center w-full px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 rounded-md shadow-sm transition-all hover:shadow"
              >
                <svg className="mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Sign up
              </Link>
            </div>
          ) : null}
        </div>
      </header>

      {/* Main Content Area with improved loading state */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 relative">
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-teal-200 opacity-20"></div>
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-teal-500 animate-spin"></div>
                <svg className="w-full h-full text-teal-500 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8z" opacity="0.5" />
                </svg>
              </div>
              <p className="mt-4 text-sm text-teal-600 animate-pulse">Loading your experience...</p>
            </div>
          </div>
        ) : (
          <div className="min-h-full">{children}</div>
        )}
      </main>

      {/* Footer - Responsive and only visible on specific pages */}
      {(location.pathname === '/' || location.pathname === '/resources') && (
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500 text-center sm:text-left mb-3 sm:mb-0">
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.17 2a1 1 0 00-.83.45L10.38 5H5a2 2 0 00-2 2v10c0 1.1.9 2 2 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-5.38l-1.96-2.55A1 1 0 0013.17 2H6"></path>
                </svg>
                <span>© {new Date().getFullYear()} Mental Health Companion</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Current User: mamatqurtifa</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4">
              <a href="#" className="text-gray-400 hover:text-teal-500 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-teal-500 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-teal-500 transition-colors text-sm">Contact</a>
            </div>
          </div>
        </footer>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" style={fadeInAnimation}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-purple-500 px-6 py-4">
              <h3 className="text-lg font-medium text-white">Confirm Sign Out</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Are you sure you want to sign out? Your session will end and you'll need to log in again to continue.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancelLogout}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
                >
                  Yes, Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyframes in CSS file instead of inline style tags */}
      {/* 
        Add this to your CSS file:
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      */}
    </div>
  );
}