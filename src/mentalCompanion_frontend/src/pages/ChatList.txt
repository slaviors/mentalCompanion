import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ChatList() {
  const navigate = useNavigate();
  const { actor } = useAuth();
  
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch chat sessions
  useEffect(() => {
    const fetchChats = async () => {
      if (!actor) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const result = await actor.getChatSessions();
        console.log("Fetched chats:", result);
        
        // Sort chats by updatedAt timestamp (most recent first)
        const sortedChats = [...result].sort((a, b) => {
          const timeA = Number(a.updatedAt) || 0;
          const timeB = Number(b.updatedAt) || 0;
          return timeB - timeA;
        });
        
        setChats(sortedChats);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
        setError("Could not load your conversations");
      } finally {
        setLoading(false);
      }
    };
    
    fetchChats();
  }, [actor]);
  
  const handleCreateChat = async () => {
    try {
      setCreating(true);
      setError(null);
      
      const result = await actor.createChatSession("New Conversation");
      
      if ('ok' in result) {
        const newChat = result.ok;
        console.log("Created new chat:", newChat);
        
        // Add to local state and navigate to new chat
        setChats(prevChats => [newChat, ...prevChats]);
        // PERBAIKAN: Menggunakan slug alih-alih id
        navigate(`/chat/${newChat.slug}`);
      } else {
        setError(`Failed to create chat: ${result.err}`);
      }
    } catch (err) {
      console.error("Exception creating chat:", err);
      setError("An unexpected error occurred while creating a new conversation");
    } finally {
      setCreating(false);
    }
  };
  
  const navigateToChat = (chat) => {
    // PERBAIKAN: Menggunakan slug alih-alih id
    navigate(`/chat/${chat.slug}`);
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      // Convert nanoseconds to milliseconds
      const timestampMs = Number(timestamp) / 1_000_000;
      const date = new Date(timestampMs);
      
      // For today, show time only
      const today = new Date();
      const isToday = date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();
      
      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // For this year, show month and day
      const isThisYear = date.getFullYear() === today.getFullYear();
      if (isThisYear) {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
      
      // For older dates, show full date
      return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };
  
  const getLastMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return "No messages yet";
    }
    
    const lastMessage = chat.messages[chat.messages.length - 1];
    let prefix = lastMessage.isUser ? "You: " : "Assistant: ";
    let content = lastMessage.content;
    
    // Truncate message if too long
    if (content.length > 60) {
      content = content.substring(0, 57) + "...";
    }
    
    return prefix + content;
  };
  
  // Filter chats based on search query
  const filteredChats = searchQuery.trim() 
    ? chats.filter(chat => 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chat.messages && chat.messages.some(msg => 
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      )
    : chats;

  return (
    <div className="h-full bg-gray-50 overflow-hidden flex flex-col">
      {/* Header with search and new chat button */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Conversations</h1>
          <button
            onClick={handleCreateChat}
            disabled={creating}
            className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white px-4 py-2 rounded-md transition-colors shadow-sm flex items-center space-x-2 disabled:opacity-70"
          >
            {creating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating...</span>
              </>
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
        
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="m-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-12 h-12 relative">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-teal-200 animate-pulse"></div>
              <svg className="animate-spin w-full h-full text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center p-4">
            {searchQuery ? (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No matching conversations</h3>
                <p className="text-gray-500">Try a different search term or clear your search</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations yet</h3>
                <p className="text-gray-500 mb-4">Start a new conversation to get helpful support</p>
                <button
                  onClick={handleCreateChat}
                  disabled={creating}
                  className="bg-gradient-to-r from-teal-500 to-purple-500 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
                >
                  Start Conversation
                </button>
              </>
            )}
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigateToChat(chat)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-teal-300 hover:shadow transition-all cursor-pointer overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{chat.title}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatDate(chat.updatedAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {getLastMessage(chat)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}