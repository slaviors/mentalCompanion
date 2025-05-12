import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ChatList() {
  const { actor, userProfile } = useAuth();
  const [chatSessions, setChatSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
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
      console.error("Failed to fetch chat sessions:", err);
      setError("Could not load your conversations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewChat = async () => {
    setCreateLoading(true);
    try {
      const currentDate = new Date().toLocaleDateString();
      const result = await actor.createChatSession(`Chat on ${currentDate}`);

      if ("ok" in result) {
        // Navigasi ke chat baru
        navigate(`/chat/${result.ok.id}`);
      } else if ("err" in result) {
        setError(result.err);
      }
    } catch (err) {
      console.error("Failed to create chat session:", err);
      setError("Could not create a new conversation");
    } finally {
      setCreateLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    try {
      // Konversi BigInt ke number dengan membagi dengan 1_000_000 (nanosekon ke milisekon)
      const timestampMs = Number(timestamp.toString()) / 1_000_000;
      return new Date(timestampMs).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const getLastMessage = (messages) => {
    if (messages.length === 0) return "No messages yet";
    const lastMessage = messages[messages.length - 1];
    const content = lastMessage.content;
    // Truncate message if too long
    return content.length > 50 ? content.substring(0, 50) + "..." : content;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
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

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white shadow-sm py-6 px-8 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Your Conversations
              </h1>
              {userProfile && (
                <p className="text-gray-600 mt-1">
                  Welcome back, {userProfile.name}
                </p>
              )}
            </div>
            <button
              onClick={handleCreateNewChat}
              disabled={createLoading}
              className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white px-5 py-2.5 rounded-md flex items-center space-x-2 transition duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {createLoading ? (
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>New Conversation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-8 mt-4 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {chatSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="mb-6">
                <div className="h-24 w-24 bg-gradient-to-r from-teal-400/20 to-purple-400/20 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                No conversations yet
              </h2>
              <p className="mt-2 max-w-md text-gray-600">
                Start a new conversation to get support from your Mental Health
                Companion.
              </p>
              <button
                onClick={handleCreateNewChat}
                className="mt-6 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white px-6 py-3 rounded-md transition duration-200 shadow-sm"
              >
                Start Your First Conversation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chatSessions.map((chat) => (
                <Link
                  key={chat.id}
                  to={`/chat/${chat.id}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-teal-300 hover:shadow-md transition duration-200 overflow-hidden group"
                >
                  <div className="h-2 bg-gradient-to-r from-teal-400 to-purple-500"></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
                        {chat.title}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {formatTimestamp(chat.updatedAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-3 line-clamp-2 text-sm">
                      {getLastMessage(chat.messages)}
                    </p>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                      <span className="text-xs px-2 py-1 bg-teal-50 text-teal-600 rounded-full font-medium">
                        {chat.messages.length} messages
                      </span>
                      <div className="text-teal-500 text-sm font-medium group-hover:text-purple-500 transition-colors flex items-center">
                        View Chat
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-4 border-t text-center text-sm text-gray-500">
        <p>Mental Health Companion © {new Date().getFullYear()}</p>
        <p className="mt-1">
          Current user: mamatqurtifa | {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default ChatList;
