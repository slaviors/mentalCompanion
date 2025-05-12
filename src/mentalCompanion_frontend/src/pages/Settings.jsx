import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { userProfile, actor } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: false,
    dailyReminders: false,
    weeklyReports: true,
  });
  const [privacySettings, setPrivacySettings] = useState({
    shareAnonymousData: true,
    allowAIImprovements: true,
  });
  const [themeSettings, setThemeSettings] = useState({
    colorTheme: 'teal-purple',
    fontSize: 'medium',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Helper function untuk format tanggal dari BigInt
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    try {
      // Konversi BigInt ke number dengan membagi dengan 1_000_000 (konversi dari nanosekon ke milisekon)
      // Bigint tidak bisa langsung dikonversi ke number, jadi kita perlu menanganinya dengan string
      const timestampMs = Number(timestamp.toString()) / 1_000_000;
      return new Date(timestampMs).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Simulasi penyimpanan pengaturan
  const handleSaveSettings = async () => {
    setIsUpdating(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      // Simulasi delay network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Disini Anda bisa menambahkan kode untuk memanggil actor untuk menyimpan pengaturan ke backend
      // contoh: await actor.saveUserSettings({ notifications: notificationSettings, privacy: privacySettings, theme: themeSettings });
      
      // Tampilkan notifikasi sukses
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveError('Failed to save your settings. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your preferences and account settings</p>
        </div>

        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">Your settings have been saved successfully.</p>
              </div>
            </div>
          </div>
        )}

        {saveError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{saveError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
            <div className="mt-4 flex items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                {userProfile?.name ? userProfile.name[0].toUpperCase() : 'U'}
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-900">{userProfile?.name || "Your Name"}</h3>
                <p className="text-sm text-gray-500">
                  Member since {userProfile?.createdAt ? formatDate(userProfile.createdAt) : new Date().toLocaleDateString()}
                </p>
                <button className="mt-2 text-sm text-teal-600 hover:text-teal-700 inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
            <p className="mt-1 text-sm text-gray-500">Manage how and when you receive notifications</p>
            
            <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="emailNotifications"
                    name="emailNotifications"
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="emailNotifications" className="font-medium text-gray-700">Email Notifications</label>
                  <p className="text-gray-500">Receive email notifications about chat responses and important updates</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="dailyReminders"
                    name="dailyReminders"
                    type="checkbox"
                    checked={notificationSettings.dailyReminders}
                    onChange={(e) => setNotificationSettings({...notificationSettings, dailyReminders: e.target.checked})}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="dailyReminders" className="font-medium text-gray-700">Daily Check-in Reminders</label>
                  <p className="text-gray-500">Get reminders to check in with your mental health companion</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="weeklyReports"
                    name="weeklyReports"
                    type="checkbox"
                    checked={notificationSettings.weeklyReports}
                    onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReports: e.target.checked})}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="weeklyReports" className="font-medium text-gray-700">Weekly Progress Reports</label>
                  <p className="text-gray-500">Receive a summary of your interactions and progress each week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Privacy</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your data and privacy preferences</p>
            
            <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="shareAnonymousData"
                    name="shareAnonymousData"
                    type="checkbox"
                    checked={privacySettings.shareAnonymousData}
                    onChange={(e) => setPrivacySettings({...privacySettings, shareAnonymousData: e.target.checked})}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="shareAnonymousData" className="font-medium text-gray-700">Share Anonymous Data</label>
                  <p className="text-gray-500">Allow anonymous usage data to be collected to improve our services</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="allowAIImprovements"
                    name="allowAIImprovements"
                    type="checkbox"
                    checked={privacySettings.allowAIImprovements}
                    onChange={(e) => setPrivacySettings({...privacySettings, allowAIImprovements: e.target.checked})}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="allowAIImprovements" className="font-medium text-gray-700">AI Model Improvements</label>
                  <p className="text-gray-500">Allow your conversations to be used for improving our AI models (all data is anonymized)</p>
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  Download My Data
                </button>
                <button 
                  className="ml-4 px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Appearance</h2>
            <p className="mt-1 text-sm text-gray-500">Customize how Mental Health Companion looks</p>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Color Theme</label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                <div 
                  onClick={() => setThemeSettings({...themeSettings, colorTheme: 'teal-purple'})}
                  className={`h-8 rounded-md bg-gradient-to-r from-teal-500 to-purple-500 cursor-pointer ${themeSettings.colorTheme === 'teal-purple' ? 'ring-2 ring-offset-2 ring-teal-500' : ''}`}
                ></div>
                <div 
                  onClick={() => setThemeSettings({...themeSettings, colorTheme: 'blue-indigo'})}
                  className={`h-8 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 cursor-pointer ${themeSettings.colorTheme === 'blue-indigo' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                ></div>
                <div 
                  onClick={() => setThemeSettings({...themeSettings, colorTheme: 'rose-orange'})}
                  className={`h-8 rounded-md bg-gradient-to-r from-rose-500 to-orange-500 cursor-pointer ${themeSettings.colorTheme === 'rose-orange' ? 'ring-2 ring-offset-2 ring-rose-500' : ''}`}
                ></div>
                <div 
                  onClick={() => setThemeSettings({...themeSettings, colorTheme: 'gray-slate'})}
                  className={`h-8 rounded-md bg-gradient-to-r from-gray-700 to-slate-800 cursor-pointer ${themeSettings.colorTheme === 'gray-slate' ? 'ring-2 ring-offset-2 ring-gray-700' : ''}`}
                ></div>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Font Size</label>
              <div className="mt-2">
                <select 
                  value={themeSettings.fontSize}
                  onChange={(e) => setThemeSettings({...themeSettings, fontSize: e.target.value})}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="p-6 bg-gray-50 flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isUpdating}
              className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white px-5 py-2 rounded-md transition-colors shadow-sm flex items-center space-x-2 disabled:opacity-70"
            >
              {isUpdating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}