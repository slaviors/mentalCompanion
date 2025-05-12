import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ChatList from './pages/ChatList';
import ChatPage from './pages/ChatPage';
import CreateProfile from './pages/CreateProfile';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, userProfile } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated && !userProfile) {
    return <Navigate to="/create-profile" />;
  }

  return children;
}

function App() {
  const { isAuthenticated, isLoading, userProfile } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated && userProfile ? <Navigate to="/chats" /> : <Login />
        } />
        
        <Route path="/create-profile" element={
          !isAuthenticated ? <Navigate to="/login" /> :
          userProfile ? <Navigate to="/chats" /> :
          <CreateProfile />
        } />
        
        <Route path="/" element={
          isAuthenticated && userProfile ? <Navigate to="/chats" /> : <Welcome />
        } />
        
        <Route path="/chats" element={
          <ProtectedRoute>
            <Layout>
              <ChatList />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/chat/:chatId" element={
          <ProtectedRoute>
            <Layout>
              <ChatPage />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;