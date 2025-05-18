import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Fungsi helper untuk format tanggal dari Date
const formatDate = (date) => {
  if (!date) return 'Unknown date';
  
  try {
    // Format date
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Unknown date';
  }
};

export default function ProfilePage() {
  const { isAuthenticated, userProfile, updateUserProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    email: '',
    preferences: {
      notifications: false,
      theme: 'light',
      language: 'en'
    }
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Redirect jika tidak terotentikasi
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Inisialisasi form data dari user profile
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        bio: userProfile.bio || '',
        email: userProfile.email || '',
        preferences: {
          notifications: userProfile.preferences?.notifications || false,
          theme: userProfile.preferences?.theme || 'light',
          language: userProfile.preferences?.language || 'en'
        }
      });
    }
  }, [userProfile]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle preference changes
  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: newValue
      }
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      // Call the actual update function from AuthContext
      if (updateUserProfile) {
        await updateUserProfile(formData);
      }
      
      setEditMode(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    // Reset form data to original user profile data
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        bio: userProfile.bio || '',
        email: userProfile.email || '',
        preferences: {
          notifications: userProfile.preferences?.notifications || false,
          theme: userProfile.preferences?.theme || 'light',
          language: userProfile.preferences?.language || 'en'
        }
      });
    }
    setEditMode(false);
    setError(null);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-teal-200 opacity-20"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-teal-500 animate-spin"></div>
            <svg className="w-full h-full text-teal-500 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8z" opacity="0.5" />
            </svg>
          </div>
          <p className="mt-4 text-sm text-teal-600 animate-pulse">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">
            Manage your personal information and preferences.
          </p>
        </div>
        
        {/* Success message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Profile header */}
          <div className="bg-gradient-to-r from-teal-500 to-purple-500 h-32 sm:h-40"></div>
          
          {/* Profile content */}
          <div className="px-4 sm:px-6 -mt-16">
            <div className="flex flex-col sm:flex-row items-center sm:items-end sm:space-x-5">
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white p-2 shadow-md flex-shrink-0">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
                  {userProfile?.name ? userProfile.name[0].toUpperCase() : 'U'}
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 text-center sm:text-left flex-1">
                <h2 className="text-xl font-bold text-gray-900">{userProfile?.name || 'User'}</h2>
                <p className="text-sm text-gray-500">Member since {userProfile?.createdAt ? formatDate(userProfile.createdAt) : 'Unknown'}</p>
              </div>
              
              {!editMode && (
                <div className="mt-4 sm:mt-0 flex-shrink-0">
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-md shadow-sm hover:from-teal-600 hover:to-purple-600 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
            
            {/* Profile form */}
            <div className="mt-6 pb-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Personal information section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Personal Information</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                            disabled={saving}
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{userProfile?.name || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        {editMode ? (
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                            disabled={saving}
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{userProfile?.email || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        {editMode ? (
                          <textarea
                            name="bio"
                            id="bio"
                            rows={3}
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                            disabled={saving}
                          />
                        ) : (
                          <p className="mt-1 text-gray-900 whitespace-pre-line">
                            {userProfile?.bio || 'No bio provided.'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Preferences section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Preferences</h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        {editMode ? (
                          <div className="flex items-center h-5">
                            <input
                              id="notifications"
                              name="notifications"
                              type="checkbox"
                              checked={formData.preferences.notifications}
                              onChange={handlePreferenceChange}
                              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                              disabled={saving}
                            />
                          </div>
                        ) : (
                          <div className={`w-4 h-4 rounded-full ${formData.preferences.notifications ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
                        )}
                        <div className="ml-3 text-sm">
                          <label htmlFor="notifications" className="font-medium text-gray-700">
                            Enable notifications
                          </label>
                          <p className="text-gray-500">Receive updates about your conversations and journal entries.</p>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                          Theme
                        </label>
                        {editMode ? (
                          <select
                            id="theme"
                            name="theme"
                            value={formData.preferences.theme}
                            onChange={handlePreferenceChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                            disabled={saving}
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System default</option>
                          </select>
                        ) : (
                          <p className="mt-1 capitalize text-gray-900">
                            {formData.preferences.theme}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                          Language
                        </label>
                        {editMode ? (
                          <select
                            id="language"
                            name="language"
                            value={formData.preferences.language}
                            onChange={handlePreferenceChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                            disabled={saving}
                          >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="id">Bahasa Indonesia</option>
                            <option value="fr">Français</option>
                          </select>
                        ) : (
                          <p className="mt-1 text-gray-900">
                            {formData.preferences.language === 'en' && 'English'}
                            {formData.preferences.language === 'es' && 'Español'}
                            {formData.preferences.language === 'id' && 'Bahasa Indonesia'}
                            {formData.preferences.language === 'fr' && 'Français'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Session information (read-only) */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Session Information</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Current user:</p>
                        <p className="mt-1 text-gray-900">{principal?.toString() || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last login:</p>
                        <p className="mt-1 text-gray-900">{new Date().toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Account status:</p>
                        <div className="mt-1 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <p className="text-gray-900">Active</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Form actions */}
                  {editMode && (
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-teal-500 to-purple-500 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:from-teal-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        disabled={saving}
                      >
                        {saving ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Activity stats */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-teal-50 text-teal-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">{moodRecords.length || 0}</h4>
                <p className="text-sm text-gray-500">Mood Records</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-50 text-purple-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">{journalEntries.length || 0}</h4>
                <p className="text-sm text-gray-500">Journal Entries</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50 text-blue-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">{wellnessScore}%</h4>
                <p className="text-sm text-gray-500">Wellbeing Score</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account data section */}
        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Account Data</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Options for managing your account data.</p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Download Your Data</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Get a copy of all your conversations, journal entries, and profile information.
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Data
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-red-600">Delete Account</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}