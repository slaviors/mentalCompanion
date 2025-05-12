import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Blob "mo:base/Blob";
import HashMap "mo:base/HashMap";

// Mental Health Companion Actor
actor MentalCompanion {
  // Define HTTP request/response types (now with _ prefix to indicate it's unused)
  module _Types {
    public type IC = actor {
      http_request : shared HTTP.HTTPRequest -> async HTTP.HTTPResponse;
    };

    public module HTTP {
      public type HTTPRequest = {
        url : Text;
        method : HTTPMethod;
        headers : [HeaderField];
        body : ?Blob;
        transform : ?Transform;
      };

      public type HTTPMethod = {
        #get;
        #post;
        #head;
      };

      public type HeaderField = {
        name : Text;
        value : Text;
      };

      public type HTTPResponse = {
        status : Nat;
        headers : [HeaderField];
        body : Blob;
      };

      public type Transform = {
        function : shared query TransformArgs -> async HTTPResponse;
        context : Blob;
      };

      public type TransformArgs = {
        response : HTTPResponse;
        context : Blob;
      };
    };
  };

  // Data structures
  type UserProfile = {
    id: Principal;
    name: Text;
    createdAt: Time.Time;
  };

  type Message = {
    id: Nat;
    content: Text;
    isUser: Bool;
    timestamp: Time.Time;
  };

  type ChatSession = {
    id: Nat;
    title: Text;
    messages: [Message];
    createdAt: Time.Time;
    updatedAt: Time.Time;
  };

  // State variables
  private stable var nextChatId: Nat = 0;
  private stable var nextMessageId: Nat = 0;
  
  private let userProfiles = HashMap.HashMap<Principal, UserProfile>(10, Principal.equal, Principal.hash);
  private let chatSessions = HashMap.HashMap<Principal, [ChatSession]>(10, Principal.equal, Principal.hash);

  // API configuration - renamed with underscore prefix to mark as unused
  private let _GEMMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  private let _API_KEY = "AIzaSyBzXluDHWiN4-vJp6Tmo97csWdm5HkgeQg"; // Replace with your actual API key

  // User Authentication and Profile Management
  public shared(msg) func createProfile(name: Text) : async Result.Result<UserProfile, Text> {
    let caller = msg.caller;
    
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals cannot create profiles");
    };
    
    let profile: UserProfile = {
      id = caller;
      name = name;
      createdAt = Time.now();
    };
    
    userProfiles.put(caller, profile);
    return #ok(profile);
  };

  public shared(msg) func getProfile() : async Result.Result<UserProfile, Text> {
    let caller = msg.caller;
    
    switch (userProfiles.get(caller)) {
      case (null) { #err("Profile not found") };
      case (?profile) { #ok(profile) };
    };
  };

  // Chat Session Management
  public shared(msg) func createChatSession(title: Text) : async Result.Result<ChatSession, Text> {
    let caller = msg.caller;
    
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };
    
    let newChat: ChatSession = {
      id = nextChatId;
      title = title;
      messages = [];
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    
    nextChatId += 1;
    
    let userChats = switch (chatSessions.get(caller)) {
      case (null) { [newChat] };
      case (?chats) { Array.append(chats, [newChat]) };
    };
    
    chatSessions.put(caller, userChats);
    return #ok(newChat);
  };

  public shared(msg) func getChatSessions() : async [ChatSession] {
    let caller = msg.caller;
    
    switch (chatSessions.get(caller)) {
      case (null) { [] };
      case (?chats) { chats };
    };
  };

  public shared(msg) func getChatSession(chatId: Nat) : async Result.Result<ChatSession, Text> {
    let caller = msg.caller;
    
    switch (chatSessions.get(caller)) {
      case (null) { #err("No chat sessions found") };
      case (?chats) {
        let chatOpt = Array.find<ChatSession>(chats, func(chat) { chat.id == chatId });
        
        switch (chatOpt) {
          case (null) { #err("Chat session not found") };
          case (?chat) { #ok(chat) };
        };
      };
    };
  };

  // Chat Interaction
  public shared(msg) func sendMessage(chatId: Nat, content: Text) : async Result.Result<ChatSession, Text> {
    let caller = msg.caller;
    
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };
    
    switch (chatSessions.get(caller)) {
      case (null) { #err("No chat sessions found") };
      case (?chats) {
        var updatedChats = Buffer.Buffer<ChatSession>(chats.size());
        var chatFound = false;
        var updatedChat: ?ChatSession = null;
        
        for (chat in chats.vals()) {
          if (chat.id == chatId) {
            chatFound := true;
            
            // Add user message
            let userMessage: Message = {
              id = nextMessageId;
              content = content;
              isUser = true;
              timestamp = Time.now();
            };
            nextMessageId += 1;
            
            // Call to Gemmini API would happen here
            let botResponse = await generateBotResponse(content, chat.messages);
            
            let botMessage: Message = {
              id = nextMessageId;
              content = botResponse;
              isUser = false;
              timestamp = Time.now();
            };
            nextMessageId += 1;
            
            let updatedMessages = Array.append(chat.messages, [userMessage, botMessage]);
            
            let updated: ChatSession = {
              id = chat.id;
              title = chat.title;
              messages = updatedMessages;
              createdAt = chat.createdAt;
              updatedAt = Time.now();
            };
            
            updatedChat := ?updated;
            updatedChats.add(updated);
          } else {
            updatedChats.add(chat);
          };
        };
        
        if (not chatFound) {
          return #err("Chat session not found");
        };
        
        // Menggunakan static library function Buffer.toArray() daripada method .toArray()
        chatSessions.put(caller, Buffer.toArray<ChatSession>(updatedChats));
        
        switch (updatedChat) {
          case (null) { #err("Failed to update chat") };
          case (?chat) { #ok(chat) };
        };
      };
    };
  };

  // Helper function to generate bot response
  private func generateBotResponse(userMessage: Text, chatHistory: [Message]) : async Text {
    // Format the chat history for context
    var contextPrompt = "";
    for (msg in chatHistory.vals()) {
      let role = if (msg.isUser) "User: " else "Assistant: ";
      contextPrompt := contextPrompt # role # msg.content # "\n";
    };

    // The actual prompt to send to Gemmini (renamed with underscore as unused)
    let _prompt = contextPrompt # "User: " # userMessage # "\nAssistant:";
    
    // For development/testing, return a static response
    // This is a simulated caring mental health response
    return "I'm here to support you. Remember that you're not alone in what you're feeling, and it's completely okay to seek help. What specific aspects of your situation are most challenging right now?";
    
    /* 
    // HTTP outcall implementation using IC management canister would go here
    // This part would be implemented when ready to connect to the actual API
    */
  };
}