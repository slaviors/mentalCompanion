import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import CreateProfile from './pages/CreateProfile';
import ChatList from './pages/ChatList'; // Perhatikan perubahan dari Chats ke ChatList
import ChatPage from './pages/ChatPage'; // Menggunakan ChatPage
import Settings from './pages/Settings'; // Tambahkan import untuk Settings

// Route protector component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Jika belum punya profil dan tidak berada di halaman create profile
  if (!userProfile && window.location.pathname !== '/create-profile') {
    return <Navigate to="/create-profile" replace />;
  }
  
  return children;
};

// Profile route protector (hanya untuk yang belum punya profil)
const ProfileRoute = ({ children }) => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Jika sudah punya profil, redirect ke chats
  if (userProfile) {
    return <Navigate to="/chats" replace />;
  }
  
  return children;
};

// Authentication route (hanya untuk yang belum login)
const AuthRoute = ({ children }) => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (isAuthenticated) {
    // Jika belum punya profil, arahkan ke create profile
    if (!userProfile) {
      return <Navigate to="/create-profile" replace />;
    }
    // Jika sudah punya profil, arahkan ke chats
    return <Navigate to="/chats" replace />;
  }
  
  return children;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } 
        />
        
        <Route 
          path="/create-profile" 
          element={
            <ProfileRoute>
              <CreateProfile />
            </ProfileRoute>
          } 
        />
        
        <Route 
          path="/chats" 
          element={
            <ProtectedRoute>
              <Layout>
                <ChatList />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/chat/:chatId" 
          element={
            <ProtectedRoute>
              <Layout>
                <ChatPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;