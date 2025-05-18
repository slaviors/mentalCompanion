import Principal "mo:base/Principal";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Nat "mo:base/Nat";
import Types "types";
import Utils "utils";

module {
  // State type - perhatikan bahwa field-field mutable ditandai dengan var
  public type State = {
    var nextChatId : Nat;
    var nextMessageId : Nat;
    chatSessions : HashMap.HashMap<Principal, [Types.ChatSession]>;
  };
  
  // Initialize state - saat mengakses field var, tidak perlu menambahkan var lagi
  public func init() : State {
    {
      var nextChatId = 0;
      var nextMessageId = 0;
      chatSessions = HashMap.HashMap<Principal, [Types.ChatSession]>(10, Principal.equal, Principal.hash);
    }
  };

  // Exportable API
  public func createChatSession(state : State, caller : Principal, title : Text) : Result.Result<Types.ChatSession, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };

    let slug = Utils.generateSlug();

    let newChat : Types.ChatSession = {
      id = state.nextChatId;
      slug = slug;
      title = title;
      messages = [];
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    state.nextChatId += 1;

    let userChats = switch (state.chatSessions.get(caller)) {
      case (null) { [newChat] };
      case (?chats) { Array.append(chats, [newChat]) };
    };

    state.chatSessions.put(caller, userChats);
    return #ok(newChat);
  };

  public func getChatSessions(state : State, caller : Principal) : [Types.ChatSession] {
    switch (state.chatSessions.get(caller)) {
      case (null) { [] };
      case (?chats) { chats };
    };
  };

  public func getChatSession(state : State, caller : Principal, chatId : Nat) : Result.Result<Types.ChatSession, Text> {
    switch (state.chatSessions.get(caller)) {
      case (null) { #err("No chat sessions found") };
      case (?chats) {
        let chatOpt = Array.find<Types.ChatSession>(chats, func(chat) { chat.id == chatId });

        switch (chatOpt) {
          case (null) { #err("Chat session not found") };
          case (?chat) { #ok(chat) };
        };
      };
    };
  };

  public func getChatSessionBySlug(state : State, caller : Principal, slug : Text) : Result.Result<Types.ChatSession, Text> {
    switch (state.chatSessions.get(caller)) {
      case (null) { #err("No chat sessions found") };
      case (?chats) {
        let chatOpt = Array.find<Types.ChatSession>(chats, func(chat) { chat.slug == slug });

        switch (chatOpt) {
          case (null) { #err("Chat session not found") };
          case (?chat) { #ok(chat) };
        };
      };
    };
  };

  public func sendMessage(state : State, caller : Principal, chatId : Nat, content : Text) : Result.Result<Types.ChatSession, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };

    switch (state.chatSessions.get(caller)) {
      case (null) { #err("No chat sessions found") };
      case (?chats) {
        var updatedChats = Buffer.Buffer<Types.ChatSession>(chats.size());
        var chatFound = false;
        var updatedChat : ?Types.ChatSession = null;

        for (chat in chats.vals()) {
          if (chat.id == chatId) {
            chatFound := true;

            // Add user message
            let userMessage : Types.Message = {
              id = state.nextMessageId;
              content = content;
              isUser = true;
              timestamp = Time.now();
            };
            state.nextMessageId += 1;

            // Generate bot response
            let botResponse = Utils.generateSimpleBotResponse(content, chat.messages);

            let botMessage : Types.Message = {
              id = state.nextMessageId;
              content = botResponse;
              isUser = false;
              timestamp = Time.now();
            };
            state.nextMessageId += 1;

            let updatedMessages = Array.append(chat.messages, [userMessage, botMessage]);

            let updated : Types.ChatSession = {
              id = chat.id;
              slug = chat.slug;
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

        state.chatSessions.put(caller, Buffer.toArray<Types.ChatSession>(updatedChats));

        switch (updatedChat) {
          case (null) { #err("Failed to update chat") };
          case (?chat) { #ok(chat) };
        };
      };
    };
  };
}