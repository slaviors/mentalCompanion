import React from 'react';

export default function ChatMessage({ message }) {
  const formattedTime = new Date(Number(message.timestamp) / 1000000).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  if (message.isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-primary-600 text-white p-3 rounded-lg rounded-tr-none max-w-[80%] shadow-sm">
          <p className="whitespace-pre-wrap">{message.content}</p>
          <div className="text-right mt-1">
            <span className="text-xs text-primary-100">{formattedTime}</span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-start">
        <div className="bg-white p-3 rounded-lg rounded-tl-none max-w-[80%] shadow-sm border border-gray-200">
          <p className="whitespace-pre-wrap text-gray-800">{message.content}</p>
          <div className="text-left mt-1">
            <span className="text-xs text-gray-500">{formattedTime}</span>
          </div>
        </div>
      </div>
    );
  }
}