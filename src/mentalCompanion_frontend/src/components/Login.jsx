import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { isAuthenticated, loading, login, logout, userProfile, createProfile } = useAuth();
  const [name, setName] = useState('');
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsCreatingProfile(true);
    try {
      await createProfile(name);
      setName('');
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setIsCreatingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome to Mental Companion</h2>
        <p className="text-gray-600 mb-6 text-center">
          Login with Internet Identity to start your mental health journey.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          Login with Internet Identity
        </button>
      </div>
    );
  }

  if (isAuthenticated && !userProfile) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h2>
        <form onSubmit={handleCreateProfile}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isCreatingProfile}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {isCreatingProfile ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4">
      <div>
        <p className="font-medium">Welcome, {userProfile?.name}</p>
        <p className="text-sm text-gray-500">Logged in with Internet Identity</p>
      </div>
      <button
        onClick={handleLogout}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-4 rounded-lg text-sm transition duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default Login;