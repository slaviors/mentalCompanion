import Principal "mo:base/Principal";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Nat "mo:base/Nat";
import Types "types";

module {
  // State type - dengan var pada field mutable
  public type State = {
    var nextJournalId : Nat;
    var nextMoodRecordId : Nat;
    var nextGoalId : Nat;
    journalEntries : HashMap.HashMap<Principal, [Types.JournalEntry]>;
    moodRecords : HashMap.HashMap<Principal, [Types.MoodRecord]>;
    goals : HashMap.HashMap<Principal, [Types.Goal]>;
  };
  
  // Initialize state - hanya inisialisasi nilai, tanpa var lagi
  public func init() : State {
    {
      var nextJournalId = 0;
      var nextMoodRecordId = 0;
      var nextGoalId = 0;
      journalEntries = HashMap.HashMap<Principal, [Types.JournalEntry]>(10, Principal.equal, Principal.hash);
      moodRecords = HashMap.HashMap<Principal, [Types.MoodRecord]>(10, Principal.equal, Principal.hash);
      goals = HashMap.HashMap<Principal, [Types.Goal]>(10, Principal.equal, Principal.hash);
    }
  };

  // Journal API
  public func createJournalEntry(state : State, caller : Principal, title : Text, content : Text, mood : Text) : Result.Result<Types.JournalEntry, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };

    let entry : Types.JournalEntry = {
      id = state.nextJournalId;
      title = title;
      content = content;
      mood = mood;
      createdAt = Time.now();
      userId = caller;
    };

    state.nextJournalId += 1;

    let userEntries = switch (state.journalEntries.get(caller)) {
      case (null) { [entry] };
      case (?entries) { Array.append([entry], entries) }; // New entries at the beginning
    };

    state.journalEntries.put(caller, userEntries);
    return #ok(entry);
  };

  public func getJournalEntries(state : State, caller : Principal) : Result.Result<[Types.JournalEntry], Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };

    switch (state.journalEntries.get(caller)) {
      case (null) { #ok([]) };
      case (?entries) { #ok(entries) };
    };
  };

  public func updateJournalEntry(state : State, caller : Principal, entryId : Nat, title : Text, content : Text, mood : Text) : Result.Result<Types.JournalEntry, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };

    switch (state.journalEntries.get(caller)) {
      case (null) { #err("No journal entries found") };
      case (?entries) {
        var updatedEntries = Buffer.Buffer<Types.JournalEntry>(entries.size());
        var entryFound = false;
        var updatedEntry : ?Types.JournalEntry = null;

        for (entry in entries.vals()) {
          if (entry.id == entryId) {
            entryFound := true;

            let updated : Types.JournalEntry = {
              id = entry.id;
              title = title;
              content = content;
              mood = mood;
              createdAt = entry.createdAt; // Keep original timestamp
              userId = caller;
            };

            updatedEntry := ?updated;
            updatedEntries.add(updated);
          } else {
            updatedEntries.add(entry);
          };
        };

        if (not entryFound) {
          return #err("Journal entry not found");
        };

        state.journalEntries.put(caller, Buffer.toArray<Types.JournalEntry>(updatedEntries));

        switch (updatedEntry) {
          case (null) { #err("Failed to update journal entry") };
          case (?entry) { #ok(entry) };
        };
      };
    };
  };

  public func deleteJournalEntry(state : State, caller : Principal, entryId : Nat) : Result.Result<(), Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };

    switch (state.journalEntries.get(caller)) {
      case (null) { #err("No journal entries found") };
      case (?entries) {
        let updatedEntries = Array.filter<Types.JournalEntry>(entries, func(entry) { entry.id != entryId });

        if (updatedEntries.size() == entries.size()) {
          return #err("Journal entry not found");
        };

        state.journalEntries.put(caller, updatedEntries);
        return #ok(());
      };
    };
  };
  
  // Mood Tracking API
  public func recordMood(state : State, caller : Principal, happiness : Nat, anxiety : Nat, energy : Nat, focus : Nat, notes : ?Text) : Result.Result<Types.MoodRecord, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };

    // Validate input ranges (0-10)
    if (happiness > 10 or anxiety > 10 or energy > 10 or focus > 10) {
      return #err("Mood values must be between 0 and 10");
    };

    let record : Types.MoodRecord = {
      id = state.nextMoodRecordId;
      date = Time.now();
      happiness = happiness;
      anxiety = anxiety;
      energy = energy;
      focus = focus;
      notes = notes;
      userId = caller;
    };

    state.nextMoodRecordId += 1;

    let userRecords = switch (state.moodRecords.get(caller)) {
      case (null) { [record] };
      case (?records) { Array.append([record], records) };
    };

    state.moodRecords.put(caller, userRecords);
    return #ok(record);
  };

  public func getMoodRecords(state : State, caller : Principal) : Result.Result<[Types.MoodRecord], Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };

    switch (state.moodRecords.get(caller)) {
      case (null) { #ok([]) };
      case (?records) { #ok(records) };
    };
  };

  // Goals API
  public func createGoal(state : State, caller : Principal, title : Text) : Result.Result<Types.Goal, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };

    let goal : Types.Goal = {
      id = state.nextGoalId;
      title = title;
      completed = false;
      createdAt = Time.now();
      completedAt = null;
      userId = caller;
    };

    state.nextGoalId += 1;

    let userGoals = switch (state.goals.get(caller)) {
      case (null) { [goal] };
      case (?existingGoals) { Array.append([goal], existingGoals) };
    };

    state.goals.put(caller, userGoals);
    return #ok(goal);
  };

  public func getGoals(state : State, caller : Principal) : Result.Result<[Types.Goal], Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };

    switch (state.goals.get(caller)) {
      case (null) { #ok([]) };
      case (?userGoals) { #ok(userGoals) };
    };
  };

  public func updateGoalStatus(state : State, caller : Principal, goalId : Nat, completed : Bool) : Result.Result<Types.Goal, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };

    switch (state.goals.get(caller)) {
      case (null) { #err("No goals found") };
      case (?userGoals) {
        var updatedGoals = Buffer.Buffer<Types.Goal>(userGoals.size());
        var goalFound = false;
        var updatedGoal : ?Types.Goal = null;

        for (goal in userGoals.vals()) {
          if (goal.id == goalId) {
            goalFound := true;

            let updated : Types.Goal = {
              id = goal.id;
              title = goal.title;
              completed = completed;
              createdAt = goal.createdAt;
              completedAt = if (completed) ?Time.now() else null;
              userId = caller;
            };

            updatedGoal := ?updated;
            updatedGoals.add(updated);
          } else {
            updatedGoals.add(goal);
          };
        };

        if (not goalFound) {
          return #err("Goal not found");
        };

        state.goals.put(caller, Buffer.toArray<Types.Goal>(updatedGoals));

        switch (updatedGoal) {
          case (null) { #err("Failed to update goal") };
          case (?goal) { #ok(goal) };
        };
      };
    };
  };
}