import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import CreateProfile from "./pages/CreateProfile";
import ChatPage from "./pages/ChatPage";
import Settings from "./pages/Settings";
import JournalPage from "./pages/JournalPage";
import Resources from "./pages/Resources";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/Dashboard";
import MoodTrackingPage from "./pages/MoodTrackingPage";
import GoalsPage from "./pages/GoalsPage";

// Konstanta untuk tanggal dan user saat ini
const APP_INFO = {
  CURRENT_USER: 'mamatqurtifa',
  CURRENT_DATE: '2025-05-18 02:34:54',
  VERSION: '1.0.0'
};

// Komponen loading yang lebih menarik secara visual
const LoadingScreen = () => (
  <div className="flex justify-center items-center h-screen bg-gray-50">
    <div className="w-16 h-16 relative">
      <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-teal-200 animate-pulse"></div>
      <svg
        className="animate-spin w-full h-full text-teal-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <div className="mt-4 text-sm text-center text-teal-600">
      <p>Loading Mental Health Companion</p>
      <p className="text-xs text-gray-500 mt-1">{APP_INFO.CURRENT_DATE}</p>
    </div>
  </div>
);

// Route protector component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika belum punya profil dan tidak berada di halaman create profile
  if (!userProfile && window.location.pathname !== "/create-profile") {
    return <Navigate to="/create-profile" replace />;
  }

  return children;
};

// Profile route protector (hanya untuk yang belum punya profil)
const ProfileRoute = ({ children }) => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah punya profil, redirect ke dashboard
  if (userProfile) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Authentication route (hanya untuk yang belum login)
const AuthRoute = ({ children }) => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    // Jika belum punya profil, arahkan ke create profile
    if (!userProfile) {
      return <Navigate to="/create-profile" replace />;
    }
    // Jika sudah punya profil, arahkan ke dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Welcome Page - Accessible to everyone */}
        <Route path="/" element={<Welcome />} />

        {/* Authentication Routes */}
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

        {/* Main Application Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Chat Routes - Updated */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Layout>
                <ChatPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ChatPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Settings Route */}
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

        {/* Journal Routes */}
        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <Layout>
                <JournalPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Mood Tracking Route */}
        <Route
          path="/mood"
          element={
            <ProtectedRoute>
              <Layout>
                <MoodTrackingPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Goals Route */}
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <Layout>
                <GoalsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Resources Route */}
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Layout>
                <Resources />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Legacy Routes - Redirect to new paths */}
        <Route
          path="/chats"
          element={<Navigate to="/chat" replace />}
        />

        <Route
          path="/chat/:chatSlug"
          element={
            <ProtectedRoute>
              <Layout>
                <ChatPage />
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