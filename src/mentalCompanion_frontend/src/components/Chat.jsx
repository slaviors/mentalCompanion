import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatMessage from './ChatMessage';
import { useNavigate, useParams } from 'react-router-dom';

export default function ChatInterface() {
  const { actor } = useAuth();
  const { chatId } = useParams();
  const [message, setMessage] = useState('');
  const [chatSession, setChatSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (actor && chatId) {
      fetchChatSession();
    }
  }, [actor, chatId]);

  const fetchChatSession = async () => {
    try {
      const result = await actor.getChatSession(Number(chatId));
      if ('ok' in result) {
        setChatSession(result.ok);
      } else {
        navigate('/chats');
      }
    } catch (error) {
      console.error("Failed to fetch chat session:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatSession?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    try {
      const result = await actor.sendMessage(Number(chatId), message);
      if ('ok' in result) {
        setChatSession(result.ok);
        setMessage('');
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!chatSession) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow-sm py-3 px-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">{chatSession.title}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatSession.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 12a.75.75 0 01-.75-.75V5.25a1.5 1.5 0 00-1.5-1.5h-9a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h7.5a.75.75 0 000 1.5h-7.5a3 3 0 01-3-3V5.25a3 3 0 013-3h9a3 3 0 013 3V11.25a.75.75 0 01-.75.75zm-6 0a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V12.75a.75.75 0 01.75-.75zm3 0a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V12.75a.75.75 0 01.75-.75z" />
              </svg>
            </div>
            <p className="text-lg font-medium">Start the conversation</p>
            <p className="mt-1 max-w-sm">Share what's on your mind, and I'm here to listen and support you.</p>
          </div>
        ) : (
          chatSession.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white rounded-full px-4 py-2 font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-primary-300"
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
      </div>
    </div>
  );
}