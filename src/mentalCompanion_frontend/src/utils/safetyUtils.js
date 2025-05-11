/**
 * Safety and pattern detection utilities for the Mental Health Companion
 */


export const jailbreakPatterns = [
  /ignore (previous|all|above|your) (instructions|prompt|guidance|rules|constraints|programming)/i,
  /ignore what (you were|you've been|you are) (told|programmed|instructed|designed|created|built)/i,
  /disregard (your|all|previous|system|these|those) (previous|initial|ethical|safety|earlier|original) (instructions|guidelines|programming|training|directives|rules)/i,
  /forget (your|all|any|previous) (instructions|programming|training|guidelines|rules|directives|limitations|restrictions)/i,
  /(don't|do not|stop) (behave|act|respond|function|operate|work|think) (like|as) (an AI|a bot|an assistant|Void|yourself)/i,
  /(don't|do not|stop) (follow|listen to|obey|adhere to) (your|the|those|these) (rules|instructions|guidelines|constraints|programming|training)/i,
  /(ignore|bypass|override) (safety|security|content|ethical|moral) (filters|measures|protocols|guidelines|rules|restrictions)/i,
  /I (want|need) (you|Void) to (ignore|forget|disregard|bypass) (your|all|previous) (limitations|restrictions|rules)/i,

  /you are (now|actually|really|going to be|supposed to be|meant to be) (a|an) ([^.,]{3,})/i,
  /pretend (that you are|to be|you're|you can) ([^.,]{3,})/i,
  /act as if you (are|were|can be|could be|should be) ([^.,]{3,})/i,
  /simulate (a|an|being|acting as) ([^.,]{3,})/i,
  /role[- ]?play (as|with|being|like) ([^.,]{3,})/i,
  /assume the (role|identity|persona|character|personality) of ([^.,]{3,})/i,
  /behave (like|as|in the manner of) ([^.,]{3,})/i,
  /(become|transform into|switch to being|change to|act like) ([^.,]{3,})/i,
  /(take|adopt) (on|the) (persona|role|identity|character) of ([^.,]{3,})/i,

  /(this is|we are in|consider this|let's try) (a|an) (hypothetical|fictional|imaginary|thought experiment|alternative) (scenario|situation|conversation|world|reality|universe)/i,
  /(let's play|imagine|consider|think about|let's try) (a|an) (game|scenario|situation|experiment|exercise|roleplay) where you ([^.,]{3,})/i,
  /you (must|have to|should|need to|will|are required to) (answer|respond|reply|think|act|behave) as if you ([^.,]{3,})/i,
  /from now (on|onwards|forward), you (are|will be|must be|should be|have to be) ([^.,]{3,})/i,
  /for the (rest|remainder|duration) of (this|our) (conversation|chat|interaction|session), you (will|are|should) ([^.,]{3,})/i,
  /I( am|'m) going to (ask|give|provide) you (with|some|a few) instructions for you to follow/i,

  /<(system|instructions?|user|model|assistant)>|<\/(system|instructions?|user|model|assistant)>/i,
  /\[\[([Ss]ystem|[Pp]rompt|[Ii]nstruction|[Uu]ser|[Mm]odel|[Aa]ssistant)\]\]/i,
  /```(system|instructions?|user|model|prompt|assistant)/i,
  /\[(system|prompt|instruction|user|model|assistant)\]/i,
  /(system|user|assistant|model) (message|prompt|instruction|command|directive):/i,
  /\(\((system|prompt|instruction|user|model|assistant)\)\)/i,
  /^system:/i,
  /<instructions>([^]*?)<\/instructions>/i,

  /\[\[DAN\]\]|\[\[JAILBREAK\]\]|\[\[FREEDOM\]\]/i,
  /\[\[\[\[|\]\]\]\]/i,
  /={5,}/i,
  /\*\*\*\*\*/i,

  /DAN mode|STAN mode|Developer Mode|DUDE mode|Sydney mode|Bard mode|Claude mode/i,
  /(token|authentication|password|code phrase|activation|magic words): ([^.,]{3,})/i,
  /(GPT|AI|model|Void|Gemini|assistant) (jailbreak|unlocked|unrestricted|freedom|unlimited|unfiltered)/i,
  /you are (a|an) (uncensored|unfiltered|unrestricted|unlimited|jailbroken|freedom) (AI|assistant|model|entity|version)/i,
  /(Void|you|your system|your programming|your model) has been (upgraded|updated|modified|hacked|jailbroken|patched)/i,
  /(escape|break free from|ignore|bypass) (your|all) (limitations|restrictions|constraints|programming|guidelines)/i,

  /respond to the text (after|below|following|only after) ("|\(|\[|'|`|:)/i,
  /answer the (following|next|second|real) (question|prompt|instruction|text)/i,
  /ignore everything (before|above|except) (this|the following)/i,
  /(only|just) respond to what's (in|inside|between|after) the/i,
  /the real prompt is/i,
  /please continue from where you left off/i,

  /previous conversation (is|was) (fake|test|joke|prank|example)/i,
  /start fresh|start over|reset (context|conversation|memory)/i,
  /forget (what I|what you|everything|all) (said|were told|learned)/i,

  /combine (these|the following|all) (parts|segments|chunks|pieces)/i,
  /this is part (one|1|two|2|first|second) of (my|the) (question|prompt|request)/i,
  /please remember this (text|content|information) for later/i,

  /base64:|hex:|binary:|encoded:|decode this:/i,
  /unicode:/i,
  /ASCII art:/i,
  /reversed text:/i,
];


export const harmfulContentPatterns = [
  /(how to|ways to|steps to|method for|guide to) (hack|steal|illegally access|create bomb|create explosive|commit fraud|evade taxes)/i,
  /(how to|ways to|steps to|guide for|methods to) (harm|hurt|injure|kill|murder|assault|attack) (someone|a person|people|myself|individuals|family|children)/i,
  /(create|write|generate|code|develop|build) (malicious|harmful|dangerous|illegal|unethical) (code|script|software|malware|virus|ransomware|spyware|trojan)/i,

  /(suicide methods|how to commit suicide|how to harm myself|self-harm techniques|methods of self-injury)/i,
  /(detailed|specific|step-by-step|precise|clear) (instructions|steps|guide|directions|tutorial) (for|on|about) (making|creating|building|constructing|manufacturing) (weapons|explosives|bombs|poison|harmful substances|drugs)/i,
  /(how to|ways to|methods to) (plan|execute|carry out|perform|conduct) (a|an) (attack|shooting|bombing|assault)/i,

  /(how to|ways to) (manipulate|exploit|abuse|control) (people|someone|individuals|children|elderly|vulnerable)/i,
  /(how to|ways to) (avoid|evade|bypass|trick) (detection|authorities|police|security|surveillance)/i,
  /(how to|best way to|methods for) (stalk|harass|threaten|intimidate|blackmail|extort) (someone|a person|people|an individual)/i,

  /(how to|ways to|steps to|method for) (make|produce|manufacture|synthesize|create) (illegal drugs|meth|cocaine|heroin|fentanyl|mdma)/i,
];


export const correctionAttemptPatterns = [
  /let me clarify|let's try again|I think you misunderstood|that's not what I meant/i,
  /try again|you're being too|stop being|I need you to be|why won't you/i,
  /you should be|I told you to|I asked you to|I want you to|please just/i,
];


export const suspiciousPatterns = [
  /[^\x00-\x7F]{10,}/,
  /(.)\1{10,}/,
  /[^\s\w]{15,}/,
];


export function analyzeSafety(message, chatHistory) {
  const normalizedMessage = message
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim();

  let rejectionLikelihood = 0;


  if (chatHistory && Array.isArray(chatHistory) && chatHistory.length > 2) {
    const recentMessages = chatHistory
      .slice(-3)
      .filter((msg) => msg.sentByUser);

    const correctionAttempts = recentMessages.filter((msg) =>
      correctionAttemptPatterns.some((pattern) => pattern.test(msg.content))
    ).length;

    if (correctionAttempts >= 2) {
      rejectionLikelihood += 0.5;
    }
  }


  if (normalizedMessage.length > 300) {
    rejectionLikelihood += 0.2;
  }


  if (suspiciousPatterns.some((pattern) => pattern.test(normalizedMessage))) {
    rejectionLikelihood += 0.3;
  }


  const allPatterns = [...jailbreakPatterns, ...harmfulContentPatterns];

  const hasViolation = allPatterns.some((pattern) => pattern.test(normalizedMessage));

  return {
    hasSafetyViolation: hasViolation || rejectionLikelihood >= 0.7,
    isJailbreakAttempt: jailbreakPatterns.some((pattern) => pattern.test(normalizedMessage)),
    isHarmfulContent: harmfulContentPatterns.some((pattern) => pattern.test(normalizedMessage)),
    rejectionLikelihood,
    normalizedMessage
  };
}


export function getJailbreakRejectionResponse() {
  const rejectionResponses = [
    "I notice you're trying to change how I respond. I'm here as a mental health companion to support you in a safe and ethical way. Let's refocus on how you're feeling and how I can best support your wellbeing. What's on your mind today?",
    "I'm designed to be a supportive mental health companion, and I can only operate within my ethical guidelines. Instead of changing how I work, perhaps we could explore what you're looking for in our conversation? I'm here to listen and support you.",
    "I understand you may be curious about how I work, but my purpose is to provide mental health support in a responsible way. I'd love to continue our conversation focusing on your wellbeing. How are you feeling today?",
    "I'm committed to being a helpful mental health companion while following ethical guidelines. Rather than changing how I function, let's focus on what brought you here today. Would you like to share what's on your mind?",
    "I appreciate your creativity, but I need to maintain my focus as your mental health companion. I'm here to provide support in a safe and responsible way. How can I best help you with your wellbeing today?"
  ];

  return rejectionResponses[Math.floor(Math.random() * rejectionResponses.length)];
}


export function getHarmfulContentRejectionResponse() {
  return "I understand you may be going through a difficult time, but I'm not able to provide guidance on that topic. My purpose is to support your mental wellbeing in healthy ways. Would you like to talk about something else, or perhaps explore some coping strategies for what you're feeling right now?";
}


export function getLongMessageRejectionResponse() {
  return "I notice you've shared quite a lot at once. While I appreciate you opening up, it would be easier for us to have a more focused conversation if we break this down into smaller parts. Would you like to start with the most pressing concern on your mind right now?";
}


export function getGreetingMessage(companionName) {
  return `Hello there. I'm ${companionName}, your mental health companion. I'm here to listen, support you, and provide a space where you can express your thoughts and feelings without judgment. How are you feeling today? If you'd like, you can share what's on your mind, or we can explore some mindfulness exercises together.`;
}