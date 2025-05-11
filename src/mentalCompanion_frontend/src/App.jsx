import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Chat from './components/Chat';

const AppContent = () => {
  const { isAuthenticated, userProfile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Mental Health Companion</h1>
        <p className="text-gray-600">Your AI companion for mental wellness</p>
      </header>

      <Login />
      
      {isAuthenticated && userProfile && (
        <div className="mt-6">
          <Chat />
        </div>
      )}
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© 2024 Mental Health Companion. Powered by Internet Computer.</p>
        <p className="mt-1">This is an AI assistant and not a replacement for professional mental health care.</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;