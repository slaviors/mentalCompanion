import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CreateProfile() {
  const [name, setName] = useState("");
  const [mood, setMood] = useState("neutral");
  const [goals, setGoals] = useState([]);
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showDebug, setShowDebug] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [particleElements, setParticleElements] = useState([]);

  const containerRef = useRef(null);
  const { isAuthenticated, createProfile, isPlayground } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Generate particles for background effect
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        id: i,
        size: Math.random() * 8 + 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
        color:
          i % 5 === 0
            ? "#9F7AEA"
            : i % 4 === 0
            ? "#4FD1C5"
            : i % 3 === 0
            ? "#F6AD55"
            : i % 2 === 0
            ? "#68D391"
            : "#FC8181",
      });
    }
    setParticleElements(particles);

    // Start animation progress
    const animationTimer = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(animationTimer);
          return 100;
        }
        return prev + 0.5;
      });
    }, 30);

    return () => clearInterval(animationTimer);
  }, []);

  // Ripple effect for water-like animation in container background
  useEffect(() => {
    if (!containerRef.current) return;

    const createRipple = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const size = Math.floor(Math.random() * 100) + 50;
      const ripple = document.createElement("div");

      ripple.style.position = "absolute";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.borderRadius = "50%";
      ripple.style.border = "1px solid rgba(159, 122, 234, 0.2)";
      ripple.style.left = `${Math.floor(Math.random() * rect.width)}px`;
      ripple.style.top = `${Math.floor(Math.random() * rect.height)}px`;
      ripple.style.transform = "scale(0)";
      ripple.style.opacity = "0.8";
      ripple.style.transition = `transform ${
        Math.random() * 3 + 4
      }s ease-out, opacity ${Math.random() * 3 + 4}s ease-out`;
      ripple.style.zIndex = "0";

      container.appendChild(ripple);

      // Animate ripple
      setTimeout(() => {
        ripple.style.transform = "scale(3)";
        ripple.style.opacity = "0";
      }, 100);

      // Remove ripple after animation
      setTimeout(() => {
        if (container.contains(ripple)) {
          container.removeChild(ripple);
        }
      }, 7000);
    };

    // Create ripples periodically
    const rippleInterval = setInterval(createRipple, 3000);

    // Create initial ripples
    for (let i = 0; i < 3; i++) {
      setTimeout(createRipple, i * 500);
    }

    return () => clearInterval(rippleInterval);
  }, [containerRef.current]);

  const handleGoalToggle = (goal) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  // Di dalam fungsi handleSubmit di CreateProfile.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Creating a comprehensive profile object
      const profileData = {
        name: name.trim(),
        mood,
        goals,
        bio: bio.trim(),
        createdAt: new Date().toISOString(),
      };

      console.log("Creating profile with data:", profileData);

      // Using the createProfile function from AuthContext
      const result = await createProfile(name);

      if (result) {
        navigate("/chats");
      } else {
        setError("Failed to create profile. Please try again.");
      }
    } catch (err) {
      console.error("Profile creation error:", err);

      // Tampilkan error yang lebih detail
      if (err.message.includes("no wasm module")) {
        setError(
          "The backend service is not yet available. Please try again later or contact support."
        );
      } else if (err.message.includes("IC0503")) {
        setError("Service not found. Please verify the deployment status.");
      } else {
        setError(`An error occurred: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !name.trim()) {
      setError("Please enter your name to continue");
      return;
    }

    setError("");
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #f0fdfa 100%)",
      }}
    >
      {/* Floating particles */}
      {particleElements.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            opacity: 0.5,
            filter: "blur(1px)",
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Abstract shapes */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-teal-200 to-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div
        className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Progress indicator */}
      <div className="w-full max-w-xl mb-8 px-4">
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-white/40 backdrop-blur-sm">
            <div
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-teal-500 to-purple-600 transition-all duration-500 ease-out"
              style={{
                width: `${
                  currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100
                }%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between">
            <div className="text-xs text-gray-600">Basic info</div>
            <div className="text-xs text-gray-600">Preferences</div>
            <div className="text-xs text-gray-600">Complete</div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xl">
        {/* Card with multi-step form */}
        <div
          className="backdrop-blur-xl bg-white/70 rounded-3xl overflow-hidden shadow-xl border border-white/50 dark:border-gray-800/30"
          style={{
            boxShadow:
              "0 10px 40px -15px rgba(0, 0, 0, 0.1), 0 5px 20px -5px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Card header */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white">
                {currentStep === 1 ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                ) : currentStep === 2 ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentStep === 1
                    ? "Personal Details"
                    : currentStep === 2
                    ? "Preferences & Goals"
                    : "Ready to Begin"}
                </h2>
                <p className="text-sm text-gray-500">
                  {currentStep === 1
                    ? "Tell us a bit about yourself"
                    : currentStep === 2
                    ? "Customize your experience"
                    : "Let's get started on your wellness journey"}
                </p>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="px-6 pt-6 animate-in fade-in duration-300">
              <div className="rounded-2xl bg-red-50/80 backdrop-blur-sm p-4 border border-red-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    What should we call you?
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
                    placeholder="Your name or nickname"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How are you feeling today?
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { value: "great", emoji: "😄", label: "Great" },
                      { value: "good", emoji: "🙂", label: "Good" },
                      { value: "neutral", emoji: "😐", label: "Neutral" },
                      { value: "down", emoji: "😔", label: "Down" },
                      { value: "stressed", emoji: "😖", label: "Stressed" },
                    ].map((moodOption) => (
                      <div
                        key={moodOption.value}
                        onClick={() => setMood(moodOption.value)}
                        className={`
                          flex flex-col items-center p-3 rounded-2xl cursor-pointer transition-all duration-300
                          ${
                            mood === moodOption.value
                              ? "bg-gradient-to-br from-teal-100/80 to-purple-100/80 ring-2 ring-purple-400/50 ring-offset-2 transform scale-105"
                              : "bg-white/50 hover:bg-white/80"
                          }
                        `}
                      >
                        <div className="text-2xl mb-2">{moodOption.emoji}</div>
                        <span className="text-xs font-medium">
                          {moodOption.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Preferences and Goals */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What are your wellness goals? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        id: "reduce-stress",
                        label: "Reduce Stress",
                        icon: "🧘‍♀️",
                        color: "from-teal-100/50 to-teal-200/50",
                      },
                      {
                        id: "improve-sleep",
                        label: "Better Sleep",
                        icon: "😴",
                        color: "from-blue-100/50 to-blue-200/50",
                      },
                      {
                        id: "anxiety-management",
                        label: "Manage Anxiety",
                        icon: "🌱",
                        color: "from-green-100/50 to-green-200/50",
                      },
                      {
                        id: "daily-mindfulness",
                        label: "Daily Mindfulness",
                        icon: "🌈",
                        color: "from-yellow-100/50 to-yellow-200/50",
                      },
                      {
                        id: "build-confidence",
                        label: "Build Confidence",
                        icon: "💪",
                        color: "from-orange-100/50 to-orange-200/50",
                      },
                      {
                        id: "explore-feelings",
                        label: "Explore Feelings",
                        icon: "❤️",
                        color: "from-red-100/50 to-red-200/50",
                      },
                    ].map((goal) => (
                      <div
                        key={goal.id}
                        onClick={() => handleGoalToggle(goal.id)}
                        className={`
                          flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300
                          ${
                            goals.includes(goal.id)
                              ? `bg-gradient-to-br ${goal.color} ring-2 ring-purple-400/30 transform scale-[1.02]`
                              : "bg-white/50 hover:bg-white/70"
                          }
                        `}
                      >
                        <span className="text-xl mr-3">{goal.icon}</span>
                        <span className="text-sm font-medium">
                          {goal.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tell us a bit about yourself (optional)
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
                    placeholder="What brings you here? What are you hoping to achieve?"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    This helps us personalize your experience (max 200
                    characters)
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-teal-50/70 rounded-2xl p-6 border border-teal-100/50">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 flex items-center justify-center">
                      <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-center text-teal-800 mb-2">
                    Profile Summary
                  </h3>

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between px-3 py-2 bg-white/70 rounded-xl">
                      <span className="text-sm text-gray-500">Name</span>
                      <span className="text-sm font-medium text-gray-800">
                        {name}
                      </span>
                    </div>

                    <div className="flex justify-between px-3 py-2 bg-white/70 rounded-xl">
                      <span className="text-sm text-gray-500">
                        Current Mood
                      </span>
                      <span className="text-sm font-medium text-gray-800 flex items-center">
                        {mood === "great" && "😄 Great"}
                        {mood === "good" && "🙂 Good"}
                        {mood === "neutral" && "😐 Neutral"}
                        {mood === "down" && "😔 Down"}
                        {mood === "stressed" && "😖 Stressed"}
                      </span>
                    </div>

                    <div className="flex justify-between px-3 py-2 bg-white/70 rounded-xl">
                      <span className="text-sm text-gray-500">
                        Selected Goals
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {goals.length} goals
                      </span>
                    </div>

                    {goals.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {goals.map((goal) => (
                          <span
                            key={goal}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {goal}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white/80 hover:bg-white transition-colors"
                >
                  Back
                </button>
              ) : (
                <Link
                  to="/"
                  className="px-5 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white/80 hover:bg-white transition-colors"
                >
                  Cancel
                </Link>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 border border-transparent rounded-xl text-sm font-medium text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  style={{
                    background:
                      "linear-gradient(135deg, #4FD1C5 0%, #9F7AEA 100%)",
                    boxShadow:
                      "0 10px 20px -10px rgba(79, 209, 197, 0.5), 0 10px 20px -10px rgba(159, 122, 234, 0.5)",
                  }}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-transparent rounded-xl text-sm font-medium text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    background:
                      "linear-gradient(135deg, #4FD1C5 0%, #9F7AEA 100%)",
                    boxShadow:
                      "0 10px 20px -10px rgba(79, 209, 197, 0.5), 0 10px 20px -10px rgba(159, 122, 234, 0.5)",
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Profile...
                    </div>
                  ) : (
                    "Complete Profile"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer with debug info toggle */}
        <div className="mt-8 text-center">
          <button
            onClick={toggleDebug}
            className="text-xs text-gray-400 hover:text-gray-600 mb-2 transition-colors"
          >
            {showDebug ? "Hide Debug Info" : "Show Debug Info"}
          </button>

          {showDebug && (
            <div className="text-xs text-gray-500 bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50">
              <p>
                Environment:{" "}
                {isPlayground ? "Playground/Production" : "Local Development"}
              </p>
              <p>Current Step: {currentStep}/3</p>
              <p>Selected Goals: {goals.join(", ")}</p>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-2">
            &copy; {new Date().getFullYear()} Mental Health Companion
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Current date: 2025-05-12 13:58:36 | User: mamatqurtifa
          </p>
        </div>
      </div>

      {/* Add the keyframes for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-15px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}

export default CreateProfile;
