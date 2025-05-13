import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatMessage from './ChatMessage';
import { useNavigate, useParams } from 'react-router-dom';

export default function ChatInterface() {
  const { actor } = useAuth();
  const { chatSlug } = useParams();
  const [message, setMessage] = useState('');
  const [chatSession, setChatSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const navigate = useNavigate();

  // Suggested responses based on context
  const [suggestions, setSuggestions] = useState([
    "How can I manage anxiety?",
    "I'm feeling overwhelmed today",
    "Tell me a calming technique",
    "Help me focus on positives"
  ]);

  // Load chat history when component mounts or chatSlug changes
  useEffect(() => {
    if (actor && chatSlug) {
      fetchChatSession();
    }
  }, [actor, chatSlug]);

  const fetchChatSession = async () => {
    setIsFetchingHistory(true);
    try {
      const result = await actor.getChatSessionBySlug(chatSlug);
      if ('ok' in result) {
        setChatSession(result.ok);
        
        // Generate contextual suggestions based on chat history
        if (result.ok.messages.length > 0) {
          generateSuggestions(result.ok.messages);
        }
      } else {
        navigate('/chats');
        setErrorMsg('Chat session not found');
      }
    } catch (error) {
      console.error("Failed to fetch chat session:", error);
      setErrorMsg('Failed to load conversation');
    } finally {
      setIsFetchingHistory(false);
    }
  };

  // Generate contextual suggestions based on conversation history
  const generateSuggestions = (messages) => {
    if (messages.length < 2) return; // Not enough context yet
    
    // This would be more sophisticated in a real implementation
    // Here we're just providing examples based on latest AI message
    const lastAiMessage = [...messages].reverse().find(m => !m.isUser);
    
    if (lastAiMessage) {
      if (lastAiMessage.content.toLowerCase().includes('anxiety')) {
        setSuggestions([
          "How can I practice deep breathing?",
          "What are grounding techniques?",
          "Can you suggest a quick meditation?",
          "How do I recognize anxiety triggers?"
        ]);
      } else if (lastAiMessage.content.toLowerCase().includes('sleep')) {
        setSuggestions([
          "What's a good bedtime routine?",
          "How can I calm racing thoughts at night?",
          "Are there foods that help with sleep?",
          "Tell me about sleep hygiene"
        ]);
      } else if (lastAiMessage.content.toLowerCase().includes('stress')) {
        setSuggestions([
          "What are quick stress relievers?",
          "How can I manage work stress?",
          "Tell me about mindfulness for stress",
          "Physical exercises for stress relief"
        ]);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isFetchingHistory) {
      scrollToBottom();
    }
  }, [chatSession?.messages, isFetchingHistory]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!message.trim() || loading) return;

    const messageToSend = message.trim();
    setMessage('');
    setLoading(true);
    
    // Optimistically add user message to UI
    if (chatSession) {
      const tempMessage = {
        id: Date.now(),
        content: messageToSend,
        timestamp: new Date().toISOString(),
        isUser: true,
        status: 'sending'
      };
      
      setChatSession({
        ...chatSession,
        messages: [...chatSession.messages, tempMessage]
      });
    }
    
    // Show typing indicator after sending message
    setTimeout(() => setTypingIndicator(true), 500);

    try {
      const result = await actor.sendMessageBySlug(chatSlug, messageToSend);
      if ('ok' in result) {
        setChatSession(result.ok);
        generateSuggestions(result.ok.messages);
      } else {
        setErrorMsg('Failed to send message');
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
      setTypingIndicator(false);
      // Focus input field after sending
      messageInputRef.current?.focus();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    messageInputRef.current?.focus();
    // Optional: immediately send the suggestion
    // setTimeout(() => handleSendMessage(), 100);
  };

  // Popular emojis for mental health context
  const emojis = ['😊', '😌', '🙂', '😔', '😢', '😤', '😪', '🤔', '🧘‍♀️', '❤️', '✨', '🌈', '🌱', '💪', '🙏', '🌻', '🍃', '🌊', '☀️', '🌙'];

  const handleEmojiClick = (emoji) => {
    setMessage(message + emoji);
    setShowEmoji(false);
    messageInputRef.current?.focus();
  };

  // Loading animation
  if (isFetchingHistory) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-purple-50 to-teal-50 p-8">
        <div className="w-24 h-24 relative mb-5">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-teal-200 animate-pulse"></div>
          <svg className="animate-spin w-full h-full text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-teal-700 animate-pulse">Loading your conversation...</h3>
        <p className="text-gray-500 text-sm mt-2 text-center">This helps us keep track of your mental wellness journey</p>
      </div>
    );
  }

  if (errorMsg && !chatSession) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-purple-50 to-teal-50 p-8">
        <div className="bg-red-50 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="ml-3 text-lg font-medium text-red-800">Something went wrong</h3>
          </div>
          <p className="text-red-700 mb-4">{errorMsg}</p>
          <button 
            onClick={() => navigate('/chats')}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Return to Chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 to-teal-50">
      {/* Chat Header */}
      <div className="bg-white shadow-sm py-3 px-4 border-b flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/chats')}
            className="mr-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              {chatSession?.title}
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              {new Date(chatSession?.createdAt).toLocaleDateString()} • {chatSession?.messages.length} messages
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatSession?.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center pt-8">
            <div className="w-24 h-24 mb-6 relative">
              {/* SVG Animation - Breathing Circle */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#E2E8F0" 
                  strokeWidth="2"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="url(#chatGradient)" 
                  strokeWidth="2"
                  className="animate-pulse-slow"
                />
                <defs>
                  <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4FD1C5" />
                    <stop offset="100%" stopColor="#9F7AEA" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Inner SVG - Chat bubbles */}
              <svg 
                viewBox="0 0 24 24" 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-teal-500"
                fill="currentColor"
              >
                <path d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8z" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-teal-800 mb-2">Begin Your Wellness Journey</p>
            <p className="text-gray-600 max-w-sm">
              Share what's on your mind, ask questions, or just talk about your day. I'm here to listen and support your mental wellness.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 max-w-md">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left px-4 py-2 bg-white rounded-lg shadow-sm border border-purple-100 text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 hover:shadow-md"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Day separator */}
            <div className="flex justify-center my-4">
              <div className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
                {new Date(chatSession?.messages[0]?.timestamp).toLocaleDateString()}
              </div>
            </div>
            
            {/* Messages */}
            {chatSession?.messages.map((msg, index) => (
              <React.Fragment key={msg.id}>
                {/* Add date separator when day changes */}
                {index > 0 && new Date(msg.timestamp).toDateString() !== 
                  new Date(chatSession.messages[index-1].timestamp).toDateString() && (
                  <div className="flex justify-center my-4">
                    <div className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                )}
                <ChatMessage message={msg} />
              </React.Fragment>
            ))}
            
            {/* Typing indicator */}
            {typingIndicator && (
              <div className="flex items-center space-x-2 text-gray-500 p-4 max-w-[80%] bg-white rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm">Mental companion is typing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} className="pt-2" />
          </>
        )}
      </div>
      
      {/* Suggestion chips */}
      {chatSession?.messages.length > 0 && (
        <div className="px-4 py-2 bg-white/70 backdrop-blur-sm overflow-x-auto">
          <div className="flex space-x-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex-shrink-0 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm whitespace-nowrap hover:bg-teal-100 border border-teal-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Message Input Area */}
      <div className="p-3 border-t bg-white/90 backdrop-blur-sm relative">
        {errorMsg && (
          <div className="absolute bottom-full left-0 right-0 p-2 bg-red-50 text-red-700 text-sm text-center">
            {errorMsg}
            <button 
              onClick={() => setErrorMsg('')}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          {/* Emoji selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-gray-500 hover:text-teal-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            {showEmoji && (
              <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-xl p-2 border border-gray-200 w-64 grid grid-cols-5 gap-2 z-10">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="text-2xl hover:bg-gray-100 rounded p-1.5 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Input field */}
          <div className="flex-1 relative">
            <textarea
              ref={messageInputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 w-full rounded-2xl px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none max-h-32"
              disabled={loading}
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <div className="absolute right-3 bottom-2 text-xs text-gray-400">
              Press Enter to send
            </div>
          </div>
          
          {/* Send button */}
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-full p-3 hover:from-teal-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-200 border-t-white"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
        
        {/* Additional features tray - could be expanded */}
        <div className="flex justify-between mt-2 px-2">
          <div className="flex space-x-1 text-xs text-gray-500">
            <span>© {new Date().getFullYear()} Mental Health Companion</span>
            <span>•</span>
            <span>User: mamatqurtifa</span>
          </div>
          <div className="text-xs text-gray-400">
            {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}