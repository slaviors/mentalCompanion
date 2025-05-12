import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { isAuthenticated, logout, userProfile, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            {/* Logo and brand */}
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link to="/" className="flex items-center">
                  <div className="h-8 w-8 mr-2">
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
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
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

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {isAuthenticated && navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md flex items-center transition-colors
                    ${isActive(item.path) 
                      ? 'bg-gradient-to-r from-teal-500/10 to-purple-500/10 text-teal-600' 
                      : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <svg 
                    className={`mr-1.5 h-5 w-5 ${isActive(item.path) ? 'text-teal-500' : 'text-gray-400'}`} 
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

              {/* Profile dropdown */}
              {isAuthenticated && userProfile ? (
                <div className="relative ml-3">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Open user menu</span>
                    {/* Profile avatar */}
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
                    </div>
                  </button>

                  {/* Dropdown menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium text-gray-900">{userProfile.name}</p>
                        <p className="truncate text-gray-500 text-xs mt-0.5">Member since {new Date(userProfile.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                      <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : !isLoading && !isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-teal-500 to-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-teal-600 hover:to-purple-600 transition-colors shadow-sm"
                  >
                    Sign up
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {isAuthenticated && navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                    isActive(item.path)
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
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
                  </div>
                </Link>
              ))}
            </div>

            {isAuthenticated && userProfile ? (
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{userProfile.name}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : !isLoading && !isAuthenticated ? (
              <div className="border-t border-gray-200 py-3 px-4 flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="block text-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-md"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="block text-center w-full px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 rounded-md shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 relative">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-teal-200 animate-pulse"></div>
              <svg className="animate-spin w-full h-full text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        ) : (
          <div className="h-full">{children}</div>
        )}
      </main>

      {/* Footer - Only visible on larger screens or specific pages */}
      {(location.pathname === '/' || location.pathname === '/resources') && (
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>© {new Date().getFullYear()} Mental Health Companion</span>
              <span>•</span>
              <span>Current User: mamatqurtifa</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="mt-3 sm:mt-0 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-teal-500 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-teal-500 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-teal-500 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}