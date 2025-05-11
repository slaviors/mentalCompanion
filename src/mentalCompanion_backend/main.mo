import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Char "mo:base/Char";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Int "mo:base/Int";
import Error "mo:base/Error";
import JSON "mo:json/JSON";

actor MentalCompanion {

  type UserProfile = {
    id : Principal;
    name : Text;
    createdAt : Time.Time;
  };

  type Message = {
    id : Nat;
    content : Text;
    sentByUser : Bool;
    timestamp : Time.Time;
  };

  type ChatSession = {
    messages : [Message];
    lastUpdated : Time.Time;
  };

  type HttpHeader = {
    name : Text;
    value : Text;
  };

  type HttpMethod = {
    #get;
    #post;
    #head;
  };

  type HttpRequestArgs = {
    url : Text;
    max_response_bytes : ?Nat64;
    headers : [HttpHeader];
    body : ?[Nat8];
    method : HttpMethod;
    transform : ?{
      function : shared ({ response : HttpResponsePayload; context : [Nat8] }) -> async HttpResponsePayload;
      context : [Nat8];
    };
  };

  type HttpResponsePayload = {
    status : Nat;
    headers : [HttpHeader];
    body : [Nat8];
  };

  let ic : actor {
    http_request : HttpRequestArgs -> async HttpResponsePayload;
  } = actor "aaaaa-aa";

  private let GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
  private let GEMINI_MODEL = "gemini-2.0-flash";
  private let GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/" # GEMINI_MODEL # ":generateContent";

  private stable var messageIdCounter : Nat = 0;
  private stable var userProfilesEntries : [(Principal, UserProfile)] = [];
  private stable var userChatsEntries : [(Principal, ChatSession)] = [];

  private let userProfiles = HashMap.fromIter<Principal, UserProfile>(
    userProfilesEntries.vals(),
    0,
    Principal.equal,
    Principal.hash,
  );

  private let userChats = HashMap.fromIter<Principal, ChatSession>(
    userChatsEntries.vals(),
    0,
    Principal.equal,
    Principal.hash,
  );

  public shared (msg) func createProfile(name : Text) : async () {
    let caller = msg.caller;

    if (Principal.isAnonymous(caller)) {
      Debug.trap("Cannot create profile for anonymous user");
    };

    let newProfile : UserProfile = {
      id = caller;
      name = name;
      createdAt = Time.now();
    };

    userProfiles.put(caller, newProfile);

    if (userProfiles.get(caller) == null) {
      userChats.put(
        caller,
        {
          messages = [];
          lastUpdated = Time.now();
        },
      );
    };
  };

  public shared query (msg) func getProfile() : async ?UserProfile {
    let caller = msg.caller;
    return userProfiles.get(caller);
  };

  public shared (msg) func sendMessage(content : Text) : async ?Message {
    let caller = msg.caller;

    if (Principal.isAnonymous(caller)) {
      return null;
    };

    switch (userProfiles.get(caller)) {
      case null {
        let defaultProfile : UserProfile = {
          id = caller;
          name = "Anonymous";
          createdAt = Time.now();
        };

        userProfiles.put(caller, defaultProfile);
      };
      case (?_) {};
    };

    var chatSession = switch (userChats.get(caller)) {
      case null {
        {
          messages = [];
          lastUpdated = Time.now();
        };
      };
      case (?chat) { chat };
    };

    messageIdCounter += 1;
    let userMessage : Message = {
      id = messageIdCounter;
      content = content;
      sentByUser = true;
      timestamp = Time.now();
    };

    let messagesBuffer = Buffer.fromArray<Message>(chatSession.messages);
    messagesBuffer.add(userMessage);

    let history = convertMessagesToHistory(Buffer.toArray(messagesBuffer));

    let botResponse = await generateBotResponse(content, history);

    messageIdCounter += 1;
    let botMessage : Message = {
      id = messageIdCounter;
      content = botResponse;
      sentByUser = false;
      timestamp = Time.now();
    };

    messagesBuffer.add(botMessage);

    let updatedChatSession : ChatSession = {
      messages = Buffer.toArray(messagesBuffer);
      lastUpdated = Time.now();
    };
    userChats.put(caller, updatedChatSession);

    return ?botMessage;
  };

  public shared query (msg) func getMessages() : async [Message] {
    let caller = msg.caller;

    switch (userChats.get(caller)) {
      case null { return [] };
      case (?chatSession) { return chatSession.messages };
    };
  };

  private func convertMessagesToHistory(messages : [Message]) : Text {
    var historyText = "";

    let systemPrompt = "You are a compassionate mental health companion providing support and guidance. Respond with empathy and care.";
    historyText := "{ \"role\": \"system\", \"parts\": [{ \"text\": \"" # systemPrompt # "\" }] }";

    let maxHistoryMessages = Nat.min(10, messages.size());
    let startIndex = if (messages.size() > maxHistoryMessages) {
      messages.size() - maxHistoryMessages;
    } else {
      0;
    };

    for (i in Iter.range(startIndex, messages.size() - 1)) {
      let message = messages[i];
      let role = if (message.sentByUser) { "user" } else { "model" };

      let safeContent = escapeJsonString(message.content);

      historyText := historyText # ", { \"role\": \"" # role # "\", \"parts\": [{ \"text\": \"" # safeContent # "\" }] }";
    };

    return historyText;
  };

  private func escapeJsonString(input : Text) : Text {
    var output = "";

    for (char in input.chars()) {
      switch (char) {
        case '\\' { output := output # "\\\\" };
        case '\"' { output := output # "\\\"" };
        case '\'' { output := output # "\\'" };
        case '\n' { output := output # "\\n" };
        case '\r' { output := output # "\\r" };
        case '\t' { output := output # "\\t" };
        case _ { output := output # Char.toText(char) };
      };
    };

    return output;
  };

  private func generateBotResponse(userMessage : Text, history : Text) : async Text {
    try {
      if (GEMINI_API_KEY == "YOUR_GEMINI_API_KEY") {
        let noApiMessage = "I'm here to support you, but I'm having some technical difficulties accessing my knowledge. This is temporary, and I'll be fully operational soon. In the meantime, is there something specific you'd like to talk about, or perhaps we could focus on how you're feeling right now?";
        return noApiMessage;
      };

      let requestBody = "{ \"contents\": [" # history # "], \"generationConfig\": { \"temperature\": 0.7, \"topP\": 0.95, \"topK\": 40, \"maxOutputTokens\": 1000 } }";

      let requestBodyAsBytes = Text.encodeUtf8(requestBody);
      let requestBodyAsNat8 = Blob.toArray(requestBodyAsBytes);

      let request : HttpRequestArgs = {
        url = GEMINI_API_URL;
        max_response_bytes = ?8_000_000; 
        headers = [
          { name = "Content-Type"; value = "application/json" },
          { name = "Authorization"; value = "Bearer " # GEMINI_API_KEY },
        ];
        body = ?requestBodyAsNat8;
        method = #post;
        transform = null;
      };

      let response = await ic.http_request(request);

      if (response.status == 200) {
        let responseBytes = Blob.fromArray(response.body);
        switch (Text.decodeUtf8(responseBytes)) {
          case (?responseText) {
            if (Text.contains(responseText, #text "\"text\":")) {
              var textStart = 0;
              var textEnd = 0;
              var found = false;

              let searchString = "\"text\":\"";
              for (i in Iter.range(0, responseText.size() - searchString.size())) {
                let slice = switch (Text.subtext(responseText, i, searchString.size())) {
                  case null { "" };
                  case (?s) { s };
                };

                if (slice == searchString) {
                  textStart := i + searchString.size();
                  found := true;
                  break;
                };
              };

              if (found) {
                var inEscape = false;
                for (i in Iter.range(textStart, responseText.size() - 1)) {
                  let char = switch (Text.subtext(responseText, i, 1)) {
                    case null { "" };
                    case (?s) { s };
                  };

                  if (char == "\\") {
                    inEscape := not inEscape;
                  } else if (char == "\"" and not inEscape) {
                    textEnd := i;
                    break;
                  } else {
                    inEscape := false;
                  };
                };

                if (textEnd > textStart) {
                  let content = switch (Text.subtext(responseText, textStart, textEnd - textStart)) {
                    case null { "Could not extract response text" };
                    case (?s) { s };
                  };

                  return content;
                };
              };
            };

            return "I'm listening and want to respond thoughtfully, but I'm having a bit of trouble organizing my thoughts. Could you share a little more about how you're feeling right now?";
          };
          case null {
            return "I'm having trouble processing your message right now, but I'm here for you. Could you perhaps rephrase what you've shared, or tell me more about what's on your mind today?";
          };
        };
      } else {
        return "I want to be fully present with you, but I'm experiencing some technical difficulties at the moment. This is temporary. While we wait for things to resolve, would you like to try a quick mindfulness exercise together?";
      };
    } catch (e) {
      Debug.print("API Error: " # Error.message(e));

      let responses = [
        "I'm here to listen and support you, though I'm having trouble accessing my full capabilities right now. Would you like to tell me more about how you're feeling today?",
        "Thank you for sharing with me. I'm experiencing a brief technical issue, but that doesn't mean your feelings aren't important. Would it help to talk more about what's on your mind while we wait for the connection to improve?",
        "I value our conversation and want to give you my full attention. I'm having a temporary connection issue, but I'm still here. How are you feeling in this moment?",
        "Connection issues can be frustrating, and I apologize for that. While we wait for things to improve, perhaps we could focus on a simple grounding exercise? Try noticing five things you can see around you right now.",
        "I appreciate your patience. While my systems are reconnecting, would you like to share what brought you here today or what you hope to gain from our conversation?",
      ];

      let hash = Text.hash(userMessage);
      let index = Nat32.toNat(hash % Nat32.fromNat(responses.size()));

      return responses[index];
    };
  };

  system func preupgrade() {
    userProfilesEntries := Iter.toArray(userProfiles.entries());
    userChatsEntries := Iter.toArray(userChats.entries());
  };

  system func postupgrade() {
    userProfilesEntries := [];
    userChatsEntries := [];
  };
}