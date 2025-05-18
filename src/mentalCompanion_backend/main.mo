import Text "mo:base/Text";
import Result "mo:base/Result";

// Import modules
import Types "types";
import ProfileModule "profile";
import ChatModule "chat";
import JournalModule "journal";

// Mental Health Companion Actor
actor MentalCompanion {
  // Initialize module states
  private let profileState = ProfileModule.init();
  private let chatState = ChatModule.init();
  private let journalState = JournalModule.init();
  
  // ===== API ENDPOINTS =====

  // ===== USER PROFILE ENDPOINTS =====
  
  public shared (msg) func createProfile(name : Text) : async Result.Result<Types.UserProfile, Text> {
    return ProfileModule.createProfile(profileState, msg.caller, name);
  };

  public shared (msg) func getProfile() : async Result.Result<Types.UserProfile, Text> {
    return ProfileModule.getProfile(profileState, msg.caller);
  };
  
  public shared (msg) func updateProfile(name : Text, bio : ?Text, email : ?Text, preferences : ?Types.UserPreferences) : async Result.Result<Types.UserProfile, Text> {
    return ProfileModule.updateProfile(profileState, msg.caller, ?name, bio, email, preferences);
  };

  // ===== CHAT ENDPOINTS =====
  
  public shared (msg) func createChatSession(title : Text) : async Result.Result<Types.ChatSession, Text> {
    return ChatModule.createChatSession(chatState, msg.caller, title);
  };

  public shared (msg) func getChatSessions() : async [Types.ChatSession] {
    return ChatModule.getChatSessions(chatState, msg.caller);
  };

  public shared (msg) func getChatSession(chatId : Nat) : async Result.Result<Types.ChatSession, Text> {
    return ChatModule.getChatSession(chatState, msg.caller, chatId);
  };

  public shared (msg) func getChatSessionBySlug(slug : Text) : async Result.Result<Types.ChatSession, Text> {
    return ChatModule.getChatSessionBySlug(chatState, msg.caller, slug);
  };

  public shared (msg) func sendMessage(chatId : Nat, content : Text) : async Result.Result<Types.ChatSession, Text> {
    return ChatModule.sendMessage(chatState, msg.caller, chatId, content);
  };

  // ===== JOURNAL ENDPOINTS =====
  
  public shared (msg) func createJournalEntry(title : Text, content : Text, mood : Text) : async Result.Result<Types.JournalEntry, Text> {
    return JournalModule.createJournalEntry(journalState, msg.caller, title, content, mood);
  };

  public shared (msg) func getJournalEntries() : async Result.Result<[Types.JournalEntry], Text> {
    return JournalModule.getJournalEntries(journalState, msg.caller);
  };

  public shared (msg) func updateJournalEntry(entryId : Nat, title : Text, content : Text, mood : Text) : async Result.Result<Types.JournalEntry, Text> {
    return JournalModule.updateJournalEntry(journalState, msg.caller, entryId, title, content, mood);
  };

  public shared (msg) func deleteJournalEntry(entryId : Nat) : async Result.Result<(), Text> {
    return JournalModule.deleteJournalEntry(journalState, msg.caller, entryId);
  };
  
  // ===== MOOD TRACKING ENDPOINTS =====
  
  public shared (msg) func recordMood(happiness : Nat, anxiety : Nat, energy : Nat, focus : Nat, notes : ?Text) : async Result.Result<Types.MoodRecord, Text> {
    return JournalModule.recordMood(journalState, msg.caller, happiness, anxiety, energy, focus, notes);
  };
  
  public shared (msg) func getMoodRecords() : async Result.Result<[Types.MoodRecord], Text> {
    return JournalModule.getMoodRecords(journalState, msg.caller);
  };
  
  // ===== GOALS ENDPOINTS =====
  
  public shared (msg) func createGoal(title : Text) : async Result.Result<Types.Goal, Text> {
    return JournalModule.createGoal(journalState, msg.caller, title);
  };
  
  public shared (msg) func getGoals() : async Result.Result<[Types.Goal], Text> {
    return JournalModule.getGoals(journalState, msg.caller);
  };
  
  public shared (msg) func updateGoalStatus(goalId : Nat, completed : Bool) : async Result.Result<Types.Goal, Text> {
    return JournalModule.updateGoalStatus(journalState, msg.caller, goalId, completed);
  };
  
  // Additional frontend-specific endpoints
  public shared query (_msg) func getWellnessScore() : async Nat {
    // Simulate a wellness score calculation (would be more sophisticated in reality)
    // In a real app, this would analyze mood records and other data to compute a score
    return 85; // Example fixed score (0-100)
  };
};