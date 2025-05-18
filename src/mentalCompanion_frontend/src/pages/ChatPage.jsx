import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat'; // Impor komponen Chat yang diperbarui

export default function ChatPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated, isLoading, actor } = useAuth();
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [error, setError] = useState(null);
  const [showNewChatForm, setShowNewChatForm] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Ditambahkan dari ChatList.jsx
  
  // Redirect jika tidak terotentikasi
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/chat' } });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Fetch chat sessions
  useEffect(() => {
    if (actor && isAuthenticated) {
      fetchChatSessions();
    }
  }, [actor, isAuthenticated]);
  
  // Fetch specific chat if ID provided in route
  useEffect(() => {
    if (actor && isAuthenticated && id) {
      // Jika id valid, akan diatur oleh Chat component melalui onMessageSent
      setCurrentChat(null);
    }
  }, [actor, isAuthenticated, id]);
  
  // Function to fetch all chat sessions
  const fetchChatSessions = async () => {
    setIsLoadingChats(true);
    setError(null);
    
    try {
      const result = await actor.getChatSessions();
      console.log("Fetched chats:", result);
      
      // Transform timestamps to Date objects
      const formattedSessions = result.map(session => ({
        ...session,
        createdAt: formatTimestamp(session.createdAt),
        updatedAt: formatTimestamp(session.updatedAt),
        messages: session.messages.map(msg => ({
          ...msg,
          timestamp: formatTimestamp(msg.timestamp)
        }))
      }));
      
      // Sort chats by updatedAt timestamp (most recent first)
      const sortedSessions = formattedSessions.sort((a, b) => b.updatedAt - a.updatedAt);
      
      setChatSessions(sortedSessions);
      
      // If no chat is currently selected and there are sessions, select the first one
      if (!id && sortedSessions.length > 0) {
        navigate(`/chat/${sortedSessions[0].id}`);
      }
    } catch (err) {
      console.error('Failed to fetch chat sessions:', err);
      setError('Failed to load chat sessions. Please try again.');
    } finally {
      setIsLoadingChats(false);
    }
  };
  
  // Function to create a new chat session
  const createChatSession = async (e) => {
    e.preventDefault();
    
    if (!newChatTitle.trim()) {
      setError('Please enter a title for your chat.');
      return;
    }
    
    setIsLoadingChats(true);
    setError(null);
    
    try {
      const result = await actor.createChatSession(newChatTitle.trim());
      
      if ('ok' in result) {
        // Format the new chat
        const formattedChat = {
          ...result.ok,
          createdAt: formatTimestamp(result.ok.createdAt),
          updatedAt: formatTimestamp(result.ok.updatedAt),
          messages: result.ok.messages.map(msg => ({
            ...msg,
            timestamp: formatTimestamp(msg.timestamp)
          }))
        };
        
        // Update chat sessions and set current chat
        await fetchChatSessions();
        setShowNewChatForm(false);
        setNewChatTitle('');
        
        // Navigate to the new chat
        navigate(`/chat/${formattedChat.id}`);
      } else {
        setError(result.err || 'Failed to create new chat. Please try again.');
      }
    } catch (err) {
      console.error('Failed to create chat session:', err);
      setError('Failed to create new chat. Please try again.');
    } finally {
      setIsLoadingChats(false);
    }
  };
  
  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return new Date();
    
    try {
      // Convert BigInt to number (nanoseconds to milliseconds)
      let timestampMs;
      if (typeof timestamp === 'bigint') {
        timestampMs = Number(timestamp) / 1_000_000;
      } else {
        timestampMs = Number(timestamp) / 1_000_000;
      }
      
      return new Date(timestampMs);
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return new Date();
    }
  };
  
  // Helper to format message time
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      
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
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  // Function to handle when a message is sent and we get updated chat data
  const handleMessageSent = (updatedChat) => {
    // Format the timestamps
    const formattedChat = {
      ...updatedChat,
      createdAt: formatTimestamp(updatedChat.createdAt),
      updatedAt: formatTimestamp(updatedChat.updatedAt),
      messages: updatedChat.messages.map(msg => ({
        ...msg,
        timestamp: formatTimestamp(msg.timestamp)
      }))
    };
    
    setCurrentChat(formattedChat);
    
    // Update the chat in the chats list
    setChatSessions(prev => 
      prev.map(chat => 
        chat.id === formattedChat.id ? formattedChat : chat
      ).sort((a, b) => b.updatedAt - a.updatedAt) // Re-sort by most recent
    );
  };
  
  // Switch to a specific chat
  const switchChat = (chatId) => {
    navigate(`/chat/${chatId}`);
  };
  
  // Get the last message from a chat
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
    ? chatSessions.filter(chat => 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chat.messages && chat.messages.some(msg => 
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      )
    : chatSessions;
  
  // Jika loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0 md:px-4 py-4 h-[calc(100vh-4rem)]">
      <div className="flex h-full rounded-lg overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white border-r border-gray-200 flex flex-col h-full">
          {/* Header with search */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Conversations</h2>
              <button
                onClick={() => setShowNewChatForm(true)}
                className="p-2 rounded-full text-teal-500 hover:bg-teal-50"
                aria-label="New chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            {/* Search input - taken from ChatList.jsx */}
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
          
          {/* New Chat Form */}
          {showNewChatForm && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <form onSubmit={createChatSession}>
                <input
                  type="text"
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                  placeholder="Enter conversation title..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  autoFocus
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewChatForm(false);
                      setNewChatTitle('');
                    }}
                    className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-teal-500 text-white rounded hover:bg-teal-600"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          )}
          
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
          
          {/* Chat List */}
          {isLoadingChats ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-12 h-12 relative">
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-teal-200 animate-pulse"></div>
                <svg className="animate-spin w-full h-full text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          ) : filteredChats.length > 0 ? (
            <div className="overflow-y-auto flex-1">
              <ul className="divide-y divide-gray-200">
                {filteredChats.map(chat => (
                  <li 
                    key={chat.id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      id === chat.id.toString() ? 'bg-teal-50' : ''
                    }`}
                    onClick={() => switchChat(chat.id)}
                  >
                    <div className="px-4 py-3">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{chat.title}</h3>
                        <p className="text-xs text-gray-500">{formatDate(chat.updatedAt)}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 truncate">
                        {getLastMessage(chat)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-6">
                {searchQuery ? (
                  <>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No matching conversations</h3>
                    <p className="text-gray-500">Try a different search term or clear your search</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations yet</h3>
                    <p className="text-gray-500 mb-4">Start a new conversation to get helpful support</p>
                    <button
                      onClick={() => setShowNewChatForm(true)}
                      className="bg-gradient-to-r from-teal-500 to-purple-500 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
                    >
                      Start Conversation
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Chat Area - use updated Chat component */}
        <div className="hidden md:flex w-3/4 bg-gray-50 flex-col h-full">
          {id ? (
            <Chat 
              chatId={id} 
              chatData={currentChat} 
              onMessageSent={handleMessageSent}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Welcome to Chat</h3>
                <p className="text-gray-500 mb-6">Select a conversation or create a new one to get started</p>
                <button
                  onClick={() => setShowNewChatForm(true)}
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                >
                  Start a New Chat
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile view - show either selected chat or list */}
        <div className="md:hidden w-full bg-gray-50 flex-col h-full flex">
          {id ? (
            <Chat 
              chatId={id} 
              chatData={currentChat} 
              onMessageSent={handleMessageSent}
              showBack={true}
              onBack={() => navigate('/chat')}
            />
          ) : (
            <>
              {/* Mobile chat list header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                <h2 className="text-lg font-medium text-gray-900">Conversations</h2>
                <button
                  onClick={() => setShowNewChatForm(true)}
                  className="p-2 rounded-full text-teal-500 hover:bg-teal-50"
                  aria-label="New chat"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              {/* Mobile search */}
              <div className="p-4 border-b border-gray-200 bg-white">
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
              
              {/* New Chat Form */}
              {showNewChatForm && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <form onSubmit={createChatSession}>
                    <input
                      type="text"
                      value={newChatTitle}
                      onChange={(e) => setNewChatTitle(e.target.value)}
                      placeholder="Enter conversation title..."
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      autoFocus
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewChatForm(false);
                          setNewChatTitle('');
                        }}
                        className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 text-sm bg-teal-500 text-white rounded hover:bg-teal-600"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
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
              
              {/* Mobile Chat List */}
              {isLoadingChats ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
                </div>
              ) : filteredChats.length > 0 ? (
                <div className="overflow-y-auto flex-1">
                  <ul className="divide-y divide-gray-200">
                    {filteredChats.map(chat => (
                      <li 
                        key={chat.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => switchChat(chat.id)}
                      >
                        <div className="px-4 py-3">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{chat.title}</h3>
                            <p className="text-xs text-gray-500">{formatDate(chat.updatedAt)}</p>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 truncate">
                            {getLastMessage(chat)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center p-6">
                    {searchQuery ? (
                      <>
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No matching conversations</h3>
                        <p className="text-gray-500">Try a different search term or clear your search</p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations yet</h3>
                        <p className="text-gray-500 mb-4">Start a new conversation to get helpful support</p>
                        <button
                          onClick={() => setShowNewChatForm(true)}
                          className="bg-gradient-to-r from-teal-500 to-purple-500 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
                        >
                          Start Conversation
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}