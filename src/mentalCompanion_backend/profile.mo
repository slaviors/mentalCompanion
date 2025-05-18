import Principal "mo:base/Principal";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Types "types";
import _Buffer "mo:base/Buffer";

module {
  // Karena kita tidak bisa menginisialisasi variabel di modul
  // kita akan membuat function untuk menginisialisasi state
  public type State = {
    userProfiles : HashMap.HashMap<Principal, Types.UserProfile>;
  };
  
  public func init() : State {
    return {
      userProfiles = HashMap.HashMap<Principal, Types.UserProfile>(10, Principal.equal, Principal.hash);
    };
  };
  
  // Exportable API
  public func createProfile(state : State, caller : Principal, name : Text) : Result.Result<Types.UserProfile, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals cannot create profiles");
    };

    let defaultPreferences : Types.UserPreferences = {
      notifications = false;
      theme = "light";
      language = "en";
    };

    let profile : Types.UserProfile = {
      id = caller;
      name = name;
      bio = null;
      email = null;
      createdAt = Time.now();
      preferences = ?defaultPreferences;
    };

    state.userProfiles.put(caller, profile);
    return #ok(profile);
  };

  public func getProfile(state : State, caller : Principal) : Result.Result<Types.UserProfile, Text> {
    switch (state.userProfiles.get(caller)) {
      case (null) { #err("Profile not found") };
      case (?profile) { #ok(profile) };
    };
  };

  public func updateProfile(
    state : State,
    caller : Principal, 
    name : ?Text, 
    bio : ?Text, 
    email : ?Text,
    preferences : ?Types.UserPreferences
  ) : Result.Result<Types.UserProfile, Text> {
    
    switch (state.userProfiles.get(caller)) {
      case (null) { #err("Profile not found") };
      case (?profile) {
        // Update fields if provided, otherwise keep existing values
        let updatedName = switch (name) {
          case (null) { profile.name };
          case (?val) { val };
        };
        
        let updatedBio = switch (bio) {
          case (null) { profile.bio };
          case (?val) { ?val };
        };
        
        let updatedEmail = switch (email) {
          case (null) { profile.email };
          case (?val) { ?val };
        };
        
        let updatedPreferences = switch (preferences) {
          case (null) { profile.preferences };
          case (?val) { ?val };
        };
        
        let updatedProfile : Types.UserProfile = {
          id = profile.id;
          name = updatedName;
          bio = updatedBio;
          email = updatedEmail;
          createdAt = profile.createdAt;
          preferences = updatedPreferences;
        };
        
        state.userProfiles.put(caller, updatedProfile);
        return #ok(updatedProfile);
      };
    };
  };
}