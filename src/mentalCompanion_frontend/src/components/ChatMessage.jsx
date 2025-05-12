import React from 'react';

export default function ChatMessage({ message }) {
  const isUser = message.isUser;
  const timestamp = new Date(message.timestamp);
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Detect URLs in text to make them clickable
  const formatMessageContent = (content) => {
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
            className="text-blue-600 hover:underline"
          >
            {part}
          </a>
        );
      }
      // Process text for emoji emphasis
      return part.split(/(\:\)|\:\(|\:\D|\:\||\<3|❤️|✨|🌈|🌱|💪)/g).map((textPart, i) => {
        if ([':]', ':(', ':D', ':|', '<3', '❤️', '✨', '🌈', '🌱', '💪'].includes(textPart)) {
          return <span key={i} className="text-lg">{textPart}</span>;
        }
        return textPart;
      });
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div 
          className={`
            p-3 rounded-2xl shadow-sm
            ${isUser 
              ? `bg-gradient-to-br from-teal-500 to-purple-500 text-white rounded-br-none
                 ${message.status === 'sending' ? 'opacity-70' : ''}` 
              : 'bg-white text-gray-800 rounded-bl-none'}
          `}
        >
          <div className="text-base whitespace-pre-wrap">
            {formatMessageContent(message.content)}
          </div>
        </div>
        
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <span>{formattedTime}</span>
          
          {isUser && (
            <div className="ml-2 flex items-center">
              {message.status === 'sending' ? (
                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}