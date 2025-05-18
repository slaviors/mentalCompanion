import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module {
  // HTTP Types (untuk referensi)
  public module HTTP {
    public type HTTPRequest = {
      url : Text;
      method : HTTPMethod;
      headers : [HeaderField];
      body : ?Blob;
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
  };

  // User Profile Types
  public type UserProfile = {
    id : Principal;
    name : Text;
    bio : ?Text;
    email : ?Text;
    createdAt : Time.Time;
    preferences : ?UserPreferences;
  };

  public type UserPreferences = {
    notifications : Bool;
    theme : Text;
    language : Text;
  };

  // Chat Types
  public type Message = {
    id : Nat;
    content : Text;
    isUser : Bool;
    timestamp : Time.Time;
  };

  public type ChatSession = {
    id : Nat;
    slug : Text;
    title : Text;
    messages : [Message];
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  // Journal Types
  public type JournalEntry = {
    id : Nat;
    title : Text;
    content : Text;
    mood : Text;
    createdAt : Time.Time;
    userId : Principal;
  };

  // Mood Tracking Types
  public type MoodRecord = {
    id : Nat;
    date : Time.Time;
    happiness : Nat; // 0-10
    anxiety : Nat; // 0-10
    energy : Nat; // 0-10
    focus : Nat; // 0-10
    notes : ?Text;
    userId : Principal;
  };

  // Goal Types
  public type Goal = {
    id : Nat;
    title : Text;
    completed : Bool;
    createdAt : Time.Time;
    completedAt : ?Time.Time;
    userId : Principal;
  };
}