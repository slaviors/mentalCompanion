import React from 'react';

export default function ChatMessage({ message }) {
  const isUser = message.isUser;
  const timestamp = new Date(Number(message.timestamp) / 1000000);
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Detect URLs in text to make them clickable
  const formatMessageContent = (content) => {
    // Regular expression untuk mendeteksi URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${isUser ? 'text-teal-100 underline hover:text-white' : 'text-teal-600 hover:text-teal-800 hover:underline'} transition-colors`}
          >
            {part}
          </a>
        );
      }
      
      // Process text for emoji emphasis and markdown-like formatting
      return part.split(/(\:\)|\:\(|\:\D|\:\||\<3|❤️|✨|🌈|🌱|💪|\*\*.*?\*\*|\_\_.*?\_\_)/g).map((textPart, i) => {
        // Emoji emphasis
        if ([':]', ':(', ':D', ':|', '<3', '❤️', '✨', '🌈', '🌱', '💪'].includes(textPart)) {
          return <span key={i} className="text-lg">{textPart}</span>;
        }
        
        // Bold text (**text**)
        if (textPart.startsWith('**') && textPart.endsWith('**')) {
          return <strong key={i} className="font-bold">{textPart.slice(2, -2)}</strong>;
        }
        
        // Underlined text (__text__)
        if (textPart.startsWith('__') && textPart.endsWith('__')) {
          return <span key={i} className="underline">{textPart.slice(2, -2)}</span>;
        }
        
        return textPart;
      });
    });
  };
  
  // Function to get message status icon
  const getStatusIcon = () => {
    if (message.status === 'sending') {
      return (
        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-3 h-3 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
      );
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* Avatar for assistant messages */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex-shrink-0 mr-2 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      )}
      
      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div 
          className={`
            p-3.5 rounded-2xl shadow-sm
            ${isUser 
              ? `bg-gradient-to-br from-teal-500 to-purple-500 text-white rounded-br-none
                 ${message.status === 'sending' ? 'opacity-70' : ''}` 
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}
          `}
        >
          <div className="text-base whitespace-pre-wrap leading-relaxed">
            {formatMessageContent(message.content)}
          </div>
        </div>
        
        <div className={`flex items-center mt-1.5 text-xs ${isUser ? 'text-gray-500' : 'text-gray-500'}`}>
          <span>{formattedTime}</span>
          
          {isUser && (
            <div className="ml-2 flex items-center">
              {getStatusIcon()}
            </div>
          )}
        </div>
      </div>
      
      {/* Avatar for user messages */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0 ml-2 flex items-center justify-center text-sm font-medium text-gray-700">
          {/* You can replace this with the user's initial or profile picture */}
          U
        </div>
      )}
    </div>
  );
}