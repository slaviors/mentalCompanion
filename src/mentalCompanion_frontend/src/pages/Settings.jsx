import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Settings() {
  const { logout, userProfile, isPlayground } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [showConfirm, setShowConfirm] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Handle logout with confirmation
  const handleLogout = async () => {
    if (showConfirm) {
      await logout();
      window.location.href = '/login';
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your account and preferences</p>
      </div>
      
      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile Information
        </h2>
        
        {userProfile ? (
          <div className="space-y-4">
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900 dark:text-white">{userProfile.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Member since {new Date(userProfile.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Profile details could go here */}
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Your profile information is used to personalize your experience in the app.
            </p>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">
            Loading profile information...
          </div>
        )}
      </div>
      
      {/* Appearance Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Appearance
        </h2>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`${
              isDarkMode ? 'bg-teal-500' : 'bg-gray-200'
            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
          >
            <span className="sr-only">Toggle dark mode</span>
            <span 
              className={`${
                isDarkMode ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'
              } inline-block w-4 h-4 transform rounded-full transition-transform`}
            />
          </button>
        </div>
      </div>
      
      {/* Account Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Account
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Environment</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isPlayground ? 'Playground/Production' : 'Local Development'}
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Sign Out</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              This will log you out of your account on this device.
            </p>
            
            <div>
              {showConfirm ? (
                <div>
                  <p className="text-sm text-red-500 mb-3">Are you sure you want to sign out?</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Yes, Sign Out
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>Mental Health Companion &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">Current date: 2025-05-12 14:30:24 | User: mamatqurtifa</p>
      </div>
    </div>
  );
}

export default Settings;