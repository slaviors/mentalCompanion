import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatMessage from "../components/ChatMessage";

export default function ChatPage() {
  const { chatSlug } = useParams();
  const navigate = useNavigate();
  const { actor } = useAuth();

  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fungsi untuk mem-format timestamps dari backend (BigInt)
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return Date.now();

    try {
      // Konversi BigInt ke number dengan membagi dengan 1_000_000 (nanosekon ke milisekon)
      const timestampMs = Number(timestamp.toString()) / 1_000_000;
      return timestampMs;
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return Date.now();
    }
  };

  // Fetch chat data
  useEffect(() => {
    const fetchChatData = async () => {
      if (!actor) return;

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching chat with slug:", chatSlug);
        const result = await actor.getChatSessionBySlug(chatSlug);

        if ("ok" in result) {
          console.log("Chat session loaded:", result.ok);
          setChat(result.ok);
        } else {
          console.error("Error loading chat:", result.err);
          setError(`Failed to load chat: ${result.err}`);
        }
      } catch (err) {
        console.error("Exception during chat fetch:", err);
        setError("An unexpected error occurred while loading the chat");
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [actor, chatSlug]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  // Focus on input field when page loads
  useEffect(() => {
    if (inputRef.current && !loading && !error) {
      inputRef.current.focus();
    }
  }, [loading, error]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);

      // Optimistically add the message to UI
      const optimisticMessage = {
        id: Date.now(),
        content: newMessage,
        isUser: true,
        timestamp: Date.now() * 1000000,
        status: "sending",
      };

      setChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, optimisticMessage],
      }));

      setNewMessage("");

      // Send to backend using slug
      console.log("Sending message to chat with slug:", chatSlug);
      const result = await actor.sendMessageBySlug(chatSlug, newMessage);

      if ("ok" in result) {
        console.log("Message sent, updated chat:", result.ok);
        setChat(result.ok);
      } else {
        console.error("Failed to send message:", result.err);
        setError(`Failed to send message: ${result.err}`);

        // Revert the optimistic update
        const result = await actor.getChatSessionBySlug(chatSlug);
        if ("ok" in result) {
          setChat(result.ok);
        }
      }
    } catch (err) {
      console.error("Exception during message send:", err);
      setError("An unexpected error occurred while sending your message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Could not load chat
        </h3>
        <p className="text-gray-600 text-center mb-6">{error}</p>
        <button
          onClick={() => navigate("/chats")}
          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-md shadow-sm"
        >
          Return to Chats
        </button>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Chat Not Found
        </h3>
        <p className="text-gray-600 text-center mb-6">
          This conversation may have been deleted or does not exist.
        </p>
        <button
          onClick={() => navigate("/chats")}
          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-md shadow-sm"
        >
          Return to Chats
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat header */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center">
        <h2 className="text-lg font-medium text-gray-900 flex-1">
          {chat.title}
        </h2>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start the conversation
            </h3>
            <p className="text-gray-500 max-w-md">
              I'm your Mental Health Companion. Feel free to share what's on
              your mind, ask questions, or just talk about your day.
            </p>
          </div>
        ) : (
          <>
            {chat.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-full disabled:opacity-50 flex items-center"
          >
            {sending ? (
              <svg
                className="animate-spin h-5 w-5 text-white rotate-90"
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
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
