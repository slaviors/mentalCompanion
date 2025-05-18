import Text "mo:base/Text";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Types "types";

module {
  // Generate a unique slug based on the current timestamp
  public func generateSlug() : Text {
    let now = Int.abs(Time.now());
    let timestampText = Int.toText(now);
    return "chat" # timestampText;
  };

  // Simple stateless bot response generator - no API calls for now
  public func generateSimpleBotResponse(userMessage : Text, _chatHistory : [Types.Message]) : Text {
    // Keywords to look for in user messages
    let anxietyKeywords = ["anxious", "anxiety", "worried", "stress", "stressed", "panic"];
    let depressionKeywords = ["sad", "depressed", "depression", "hopeless", "meaningless"];
    let sleepKeywords = ["tired", "exhausted", "sleep", "insomnia", "rest"];
    let positiveKeywords = ["happy", "joy", "grateful", "thankful", "good", "better"];
    
    // Check for matching keywords
    var lowerMessage = Text.toLowercase(userMessage);
    
    // Check for questions
    if (Text.contains(lowerMessage, #text "?")) {
      return "That's a good question. I think it's important to explore that further. What do you think would help you best understand the situation?";
    };
    
    // Check for anxiety indicators
    for (keyword in anxietyKeywords.vals()) {
      if (Text.contains(lowerMessage, #text keyword)) {
        return "I notice you're feeling some anxiety. Remember that these feelings are temporary, and there are techniques that can help. Would you like to try a brief breathing exercise to feel more grounded?";
      };
    };
    
    // Check for depression indicators
    for (keyword in depressionKeywords.vals()) {
      if (Text.contains(lowerMessage, #text keyword)) {
        return "I hear that you're feeling down right now. These feelings can be really challenging. What's one small thing that brought you a moment of peace recently?";
      };
    };
    
    // Check for sleep issues
    for (keyword in sleepKeywords.vals()) {
      if (Text.contains(lowerMessage, #text keyword)) {
        return "Sleep is so important for our mental well-being. Have you tried establishing a calming bedtime routine? Even small changes can make a big difference in sleep quality.";
      };
    };
    
    // Check for positive indicators
    for (keyword in positiveKeywords.vals()) {
      if (Text.contains(lowerMessage, #text keyword)) {
        return "It's wonderful to hear something positive! Taking note of these good moments, however small, can help build resilience over time. What do you think contributed to this positive feeling?";
      };
    };
    
    // Default responses based on message length
    if (Text.size(userMessage) < 20) {
      return "I'd like to understand more about what you're experiencing. Could you tell me a bit more about that?";
    } else {
      return "Thank you for sharing that with me. It takes courage to open up. How have you been coping with these feelings in your day-to-day life?";
    };
  };
}