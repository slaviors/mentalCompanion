import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ChatList() {
  const { actor, userProfile } = useAuth();
  const [chatSessions, setChatSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (actor) {
      fetchChatSessions();
    }
  }, [actor]);

  const fetchChatSessions = async () => {
    setIsLoading(true);
    try {
      const sessions = await actor.getChatSessions();
      setChatSessions(sessions);
    } catch (err) {
      console.error('Failed to fetch chat sessions:', err);
      setError('Could not load your conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewChat = async () => {
    setCreateLoading(true);
    try {
      const currentDate = new Date().toLocaleDateString();
      const result = await actor.createChatSession(`Chat on ${currentDate}`);
      
      if ('ok' in result) {
        // Navigasi ke chat baru
        navigate(`/chat/${result.ok.id}`);
      } else if ('err' in result) {
        setError(result.err);
      }
    } catch (err) {
      console.error('Failed to create chat session:', err);
      setError('Could not create a new conversation');
    } finally {
      setCreateLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  const getLastMessage = (messages) => {
    if (messages.length === 0) return 'No messages yet';
    const lastMessage = messages[messages.length - 1];
    const content = lastMessage.content;
    // Truncate message if too long
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow-sm py-4 px-6 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Conversations</h1>
          <button
            onClick={handleCreateNewChat}
            disabled={createLoading}
            className="bg-primary-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-primary-700 transition duration-200 disabled:bg-primary-400"
          >
            {createLoading ? (
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>New Conversation</span>
              </>
            )}
          </button>
        </div>
        {userProfile && (
          <p className="text-gray-600 mt-1">Welcome back, {userProfile.name}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {chatSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-lg font-medium">No conversations yet</p>
            <p className="mt-1 max-w-md">Start a new conversation to get support from your mental health companion.</p>
            <button
              onClick={handleCreateNewChat}
              className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition duration-200"
            >
              Start Your First Conversation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {chatSessions.map((chat) => (
              <Link
                key={chat.id}
                to={`/chat/${chat.id}`}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-primary-300 hover:shadow-md transition duration-200"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-gray-800">{chat.title}</h2>
                  <span className="text-xs text-gray-500">{formatTimestamp(chat.updatedAt)}</span>
                </div>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {getLastMessage(chat.messages)}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">{chat.messages.length} messages</span>
                  <div className="text-primary-600 text-sm font-medium">View →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-4 border-t text-center text-sm text-gray-500">
        <p>Mental Health Companion © {new Date().getFullYear()}</p>
        <p className="mt-1">Current user: mamatqurtifa | {new Date('2025-05-12').toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default ChatList;