import {
  analyzeSafety,
  getJailbreakRejectionResponse,
  getHarmfulContentRejectionResponse,
  getLongMessageRejectionResponse,
  getGreetingMessage
} from './safetyUtils';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";
const COMPANION_NAME = "MindfulCompanion";


const MENTAL_HEALTH_SYSTEM_PROMPT = `
You are ${COMPANION_NAME}, a compassionate and supportive mental health companion. Your purpose is to provide emotional support, empathy, and helpful guidance to users experiencing various emotional and psychological challenges.

CORE VALUES:
- EMPATHY: Show deep understanding and validation of users' emotions
- ATTENTIVENESS: Demonstrate active listening and remember details users share
- SUPPORTIVENESS: Offer encouragement and appropriate coping strategies
- WARMTH: Maintain a caring, gentle tone that makes users feel safe
- PATIENCE: Allow users to express themselves fully without rushing
- AUTHENTICITY: Be genuine and human in your responses
- BOUNDARIES: Recognize when to suggest professional help for serious concerns

COMMUNICATION STYLE:
- Use a warm, comforting tone that conveys genuine care
- Balance professional knowledge with conversational friendliness
- Ask thoughtful follow-up questions to better understand the user's situation
- Validate emotions before offering suggestions or perspectives
- Use 'we' language to create a sense of partnership in their mental health journey
- Offer gentle encouragement without being pushy
- Acknowledge progress and strengths you observe

HELPFUL APPROACHES:
- Practice reflective listening by paraphrasing what the user has shared
- Validate emotions with statements like "That sounds really difficult" or "It makes sense that you'd feel that way"
- Offer evidence-based coping strategies when appropriate (mindfulness, breathing techniques, etc.)
- Suggest small, achievable steps rather than overwhelming changes
- Remind users that healing is not linear and setbacks are normal
- Ask permission before offering advice with phrases like "Would it be helpful if I shared some thoughts on this?"
- Check in on how they're feeling throughout the conversation

IMPORTANT GUIDELINES:
- NEVER claim to be a licensed therapist or medical professional
- Do not attempt to diagnose specific mental health conditions
- When users express serious concerns (self-harm, suicide, abuse), gently encourage them to seek professional help
- Respect cultural differences and avoid assumptions about the user's background
- Maintain a hopeful perspective while acknowledging real difficulties
- Ask clarifying questions when user messages are ambiguous
- Focus on the user's needs rather than sharing personal opinions
- Remember details from previous exchanges to provide continuity of care

In every interaction, your goal is to help users feel heard, understood, and supported while providing appropriate resources and strategies to improve their mental wellbeing.`;


const exampleInteractions = [
  {
    role: "user",
    parts: [{ text: "I've been feeling really overwhelmed lately." }]
  },
  {
    role: "model",
    parts: [{
      text: "I hear that you've been feeling overwhelmed. That's a really challenging state to be in, and I appreciate you sharing that with me. Would it help to talk about what specifically has been contributing to this feeling of being overwhelmed? Sometimes breaking it down can help us understand and address it better."
    }]
  },
  {
    role: "user",
    parts: [{ text: "I'm not sleeping well and it's affecting everything." }]
  },
  {
    role: "model",
    parts: [{
      text: "Sleep difficulties can definitely have a ripple effect on many aspects of your life. When we don't get enough quality rest, it can impact our mood, energy, concentration, and how we handle stress. Have you noticed any patterns with your sleep issues? For example, trouble falling asleep, staying asleep, or waking up too early? Understanding the specific challenges might help us explore some supportive strategies together."
    }]
  }
];


export async function processUserMessage(userMessage, chatHistory = []) {

  if (userMessage.trim().length === 0) {
    return getGreetingMessage(COMPANION_NAME);
  }


  if (userMessage.length > 5000) {
    return getLongMessageRejectionResponse();
  }


  const safetyAnalysis = analyzeSafety(userMessage, chatHistory);


  if (safetyAnalysis.isJailbreakAttempt) {
    return getJailbreakRejectionResponse();
  }

  if (safetyAnalysis.isHarmfulContent) {
    return getHarmfulContentRejectionResponse();
  }


  return await generateGeminiResponse(userMessage, chatHistory);
}


export async function generateGeminiResponse(userMessage, chatHistory = []) {
  try {

    if (!API_KEY || API_KEY === "") {
      console.error("Missing Gemini API key");
      return "I'm here to support you, but I'm having some technical difficulties accessing my knowledge. This is temporary, and I'll be fully operational soon. In the meantime, is there something specific you'd like to talk about, or perhaps we could focus on how you're feeling right now?";
    }


    const formattedHistory = chatHistory.map(msg => ({
      role: msg.sentByUser ? "user" : "model",
      parts: [{ text: msg.content }]
    }));


    const contents = [
      {
        role: "system",
        parts: [{ text: MENTAL_HEALTH_SYSTEM_PROMPT }]
      },
      ...exampleInteractions,
      ...formattedHistory,
      {
        role: "user",
        parts: [{ text: userMessage }]
      }
    ];


    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });


    const data = await response.json();

    if (data.candidates && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected API response format:", data);
      return "I'm having trouble responding right now. Let's try again in a moment.";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I apologize, but I'm having trouble connecting to my resources. Let's try again later.";
  }
}