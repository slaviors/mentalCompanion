import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Welcome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Refs for interactive elements
  const heroRef = useRef(null);
  const tooltipRef = useRef(null);

  // Track scroll position for effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle tooltip display
  const handleShowTooltip = (content, e) => {
    setTooltipContent(content);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  // Calculate parallax effect for hero section based on scroll position
  const parallaxOffset = scrollPosition * 0.4;

  // Features data with tooltip information
  const features = [
    {
      id: "chat",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 12H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 8H12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 16H14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: "AI Conversation",
      description:
        "Natural conversations with an AI that understands mental health nuances",
      tooltip:
        "Our AI is trained specifically to provide empathetic responses and mental health support",
      color: "from-blue-400 to-indigo-500",
      glassColor: "border-blue-200/40 group-hover:border-blue-300/50",
      iconBg: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    },
    {
      id: "journal",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 12H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 16H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M9 12H9.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M9 16H9.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 3V7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 7H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Mood Journal",
      description:
        "Track your moods and emotions over time with visual insights",
      tooltip:
        "Journaling helps identify patterns and triggers in your emotional well-being",
      color: "from-pink-400 to-rose-500",
      glassColor: "border-pink-200/40 group-hover:border-pink-300/50",
      iconBg: "bg-pink-50 text-pink-600 group-hover:bg-pink-100",
    },
    {
      id: "privacy",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 16V12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8H12.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Complete Privacy",
      description:
        "End-to-end encryption and decentralized storage on Internet Computer",
      tooltip:
        "Your data is secure, anonymous, and never shared with third parties",
      color: "from-emerald-400 to-teal-500",
      glassColor: "border-emerald-200/40 group-hover:border-emerald-300/50",
      iconBg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
    },
    {
      id: "resources",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 19.5V4.5C4 3.4 4.9 2.5 6 2.5H18C19.1 2.5 20 3.4 20 4.5V19.5C20 20.6 19.1 21.5 18 21.5H6C4.9 21.5 4 20.6 4 19.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 7.5H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 11.5H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 15.5H12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Wellness Resources",
      description:
        "Curated articles, exercises, and meditations for mental wellness",
      tooltip:
        "Access evidence-based tools and techniques whenever you need them",
      color: "from-amber-400 to-orange-500",
      glassColor: "border-amber-200/40 group-hover:border-amber-300/50",
      iconBg: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      quote:
        "This app has been my companion through a really difficult period. The AI conversations feel incredibly supportive and human-like.",
      author: "Alex K.",
      role: "Student",
      avatar: "👨‍🎓",
    },
    {
      id: 2,
      quote:
        "I love the privacy features. Knowing my personal thoughts are secure helps me be more honest and get better support.",
      author: "Sarah M.",
      role: "Healthcare Worker",
      avatar: "👩‍⚕️",
    },
    {
      id: 3,
      quote:
        "The mood tracking feature has helped me identify patterns I never noticed before. It's changed how I approach my mental health.",
      author: "Jordan T.",
      role: "Software Developer",
      avatar: "👨‍💻",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-teal-50 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        {/* Large animated orbs */}
        <div
          className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-300/20 to-teal-300/20 blur-3xl opacity-60"
          style={{
            transform: `translate(${-150 + cursorPosition.x * 0.02}px, ${
              -200 + cursorPosition.y * 0.02
            }px)`,
            transition: "transform 4s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-300/20 to-pink-300/20 blur-3xl opacity-60"
          style={{
            transform: `translate(${150 - cursorPosition.x * 0.02}px, ${
              200 - cursorPosition.y * 0.02
            }px)`,
            transition: "transform 4s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-yellow-300/20 to-rose-300/20 blur-3xl opacity-50"
          style={{
            transform: `translate(${-cursorPosition.x * 0.01}px, ${
              -cursorPosition.y * 0.01
            }px)`,
            transition: "transform 3s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        ></div>
      </div>

      {/* Tooltip that follows cursor */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-4 py-2 text-sm text-white bg-black/80 rounded-lg backdrop-blur-sm pointer-events-none transition-opacity duration-200"
          style={{
            left: `${tooltipPosition.x + 15}px`,
            top: `${tooltipPosition.y + 15}px`,
            maxWidth: "250px",
          }}
        >
          {tooltipContent}
        </div>
      )}

      {/* Header with Glassmorphism */}
      <header
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrollPosition > 50
            ? "py-3 bg-white/80 backdrop-blur-xl shadow-lg"
            : "py-5 bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center group">
            <div className="relative h-10 w-10 rounded-2xl overflow-hidden border-2 border-white/80 shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-teal-500"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                MH
              </span>
            </div>
            <div className="ml-3">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-600 group-hover:to-pink-600">
                MindfulTalk
              </span>
              <span className="hidden sm:inline-block text-xs text-purple-500 ml-1 group-hover:text-indigo-500 transition-colors">
                by Mental Health Companion
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {["Features", "How It Works", "Testimonials", "About"].map(
              (item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`relative px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                    activeSection === item.toLowerCase().replace(/\s+/g, "-")
                      ? "text-white font-medium"
                      : "text-gray-700 hover:text-gray-900 hover:bg-white/50 backdrop-blur-sm"
                  }`}
                  onMouseEnter={(e) =>
                    handleShowTooltip(`Jump to ${item} section`, e)
                  }
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  {activeSection ===
                    item.toLowerCase().replace(/\s+/g, "-") && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 -z-10"></span>
                  )}
                  {item}
                </a>
              )
            )}
          </div>

          {/* Login and Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="hidden sm:flex items-center px-5 py-2 text-sm font-medium rounded-full border border-purple-200 text-purple-700 bg-white/70 backdrop-blur-sm hover:bg-white hover:text-purple-800 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow"
              onMouseEnter={(e) =>
                handleShowTooltip(
                  "Sign in to your account or create a new one",
                  e
                )
              }
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span>Log in</span>
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm border border-purple-100 text-purple-700 hover:bg-white hover:text-purple-800 hover:border-purple-300 transition-all md:hidden shadow-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu with iOS-style bottom sheet */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl overflow-hidden max-h-[80vh] transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: mobileMenuOpen
                  ? "translateY(0)"
                  : "translateY(100%)",
              }}
            >
              {/* Handle Bar for Sheet */}
              <div className="w-full flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 rounded-full bg-gray-300"></div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="px-6 py-4 divide-y divide-gray-100">
                <div className="py-2">
                  {["Features", "How It Works", "Testimonials", "About"].map(
                    (item, index) => (
                      <a
                        key={index}
                        href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="flex items-center py-3.5 px-3 rounded-2xl text-gray-800 hover:bg-purple-50 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="font-medium">{item}</span>
                        <svg
                          className="ml-auto w-5 h-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    )
                  )}
                </div>

                <div className="py-4">
                  <Link
                    to="/login"
                    className="flex items-center justify-center w-full py-3.5 px-3 rounded-2xl bg-gradient-to-r from-purple-500 to-teal-500 text-white font-medium hover:from-purple-600 hover:to-teal-600 transition-all shadow-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Log in or Sign up</span>
                    <svg
                      className="ml-2 w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with Parallax Effect */}
      <section
        ref={heroRef}
        className="relative min-h-screen pt-32 md:pt-40 flex flex-col items-center justify-center text-center overflow-hidden"
        id="home"
      >
        {/* Floating Elements */}
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-purple-300/40 to-pink-300/40 blur-2xl"
          style={{
            transform: `translate(-${parallaxOffset / 2}px, ${
              parallaxOffset / 3
            }px)`,
          }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-36 h-36 rounded-full bg-gradient-to-tr from-teal-300/40 to-blue-300/40 blur-2xl"
          style={{
            transform: `translate(${parallaxOffset / 2}px, -${
              parallaxOffset / 3
            }px)`,
          }}
        ></div>

        {/* Content Container */}
        <div className="container mx-auto px-6 relative z-10">
          {/* Animated Pill Indicator */}
          <div className="inline-flex backdrop-blur-md bg-white/30 rounded-full p-1.5 border border-white/40 shadow-sm mb-6 animate-pulse">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/90 to-teal-500/90 text-white text-xs font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-white"></span>
              <span>AI-Powered Mental Support</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
            <span className="block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-900">
              Your Personal
            </span>
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-teal-500 to-blue-600">
              Mental Wellness
              <svg
                className="absolute -bottom-3 left-0 w-full h-3 text-purple-500/30"
                viewBox="0 0 400 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 6C100 -2 300 -2 400 6"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-900">
              Companion
            </span>
          </h1>

          <p className="mt-8 text-xl leading-relaxed text-gray-700 max-w-2xl mx-auto">
            A safe, supportive space where AI technology meets mental health
            expertise to help you navigate life's challenges with confidence and
            clarity.
          </p>

          {/* CTA Buttons with iOS-style design */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center sm:space-x-4 space-y-4 sm:space-y-0">
            <Link
              to="/login"
              className="group relative flex items-center justify-center px-8 py-4 w-64 sm:w-auto overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-teal-500 text-white font-medium text-lg shadow-xl transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-2xl"
              onMouseEnter={(e) =>
                handleShowTooltip("Start your mental wellness journey", e)
              }
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span className="relative z-10">Begin Your Journey</span>
              {/* Animated background */}
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              {/* Shine effect */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000"></span>
            </Link>

            <a
              href="#how-it-works"
              className="group flex items-center px-7 py-4 rounded-2xl bg-white/80 backdrop-blur-md border border-purple-100 text-gray-700 font-medium hover:bg-white hover:border-purple-200 transition-all duration-300 shadow-md hover:shadow-xl"
              onMouseEnter={(e) =>
                handleShowTooltip(
                  "See how our platform helps your mental wellbeing",
                  e
                )
              }
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span>How It Works</span>
              <div className="ml-2 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </a>
          </div>

          {/* 3D Device Mockup with Chat Interface */}
          <div className="mt-16 relative max-w-3xl mx-auto">
            {/* Shadow */}
            <div className="absolute inset-0 -bottom-6 blur-xl rounded-[2.5rem] bg-gradient-to-r from-purple-500/20 to-teal-500/20 transform scale-95 z-0"></div>

            {/* Device Frame */}
            <div className="relative z-10 bg-white rounded-[2rem] p-3 shadow-2xl transform perspective-1200 rotateX-3 transition-transform duration-700 hover:rotateX-0 border border-gray-100">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-6 bg-black rounded-full"></div>

              {/* Chat Interface */}
              <div className="flex flex-col h-[50vh] max-h-[500px] bg-gray-50 rounded-[1.75rem] overflow-hidden">
                {/* Chat Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-purple-500 to-teal-500 text-white flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Your Mental Companion</h3>
                    <div className="text-xs opacity-80 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-300 mr-1.5"></span>
                      <span>Online and ready to help</span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {/* Bot message */}
                  <div className="flex mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 flex-shrink-0 mr-2"></div>
                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-[80%] text-left">
                      <p className="text-sm text-gray-700">
                        Hi there! I'm your mental wellness companion. How are
                        you feeling today?
                      </p>
                      <span className="text-xs text-gray-400 mt-1 inline-block">
                        9:32 AM
                      </span>
                    </div>
                  </div>

                  {/* User message */}
                  <div className="flex justify-end mb-4">
                    <div className="bg-gradient-to-r from-purple-500 to-teal-500 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-sm max-w-[80%] text-left">
                      <p className="text-sm">
                        I've been feeling anxious about a presentation I have to
                        give tomorrow. I can't seem to calm my thoughts.
                      </p>
                      <span className="text-xs text-white/70 mt-1 inline-block">
                        9:34 AM
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 ml-2"></div>
                  </div>

                  {/* Bot message */}
                  <div className="flex mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 flex-shrink-0 mr-2"></div>
                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-[80%] text-left">
                      <p className="text-sm text-gray-700">
                        I understand how presentations can trigger anxiety.
                        Let's work through this together. Would you like to try
                        a quick breathing exercise that can help calm your mind?
                      </p>
                      <span className="text-xs text-gray-400 mt-1 inline-block">
                        9:35 AM
                      </span>
                    </div>
                  </div>

                  {/* Typing indicator */}
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 flex-shrink-0 mr-2"></div>
                    <div className="bg-white rounded-2xl rounded-tl-none px-5 py-4 shadow-sm inline-flex items-center">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="ml-2 w-11 h-11 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 flex items-center justify-center text-white rotate-90">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Suggestion Pills */}
                  <div className="flex mt-3 space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                    <button className="flex-shrink-0 px-4 py-2 bg-white rounded-full border border-purple-200 text-sm text-gray-700 hover:bg-purple-50 transition-colors">
                      Yes, I'd like to try
                    </button>
                    <button className="flex-shrink-0 px-4 py-2 bg-white rounded-full border border-purple-200 text-sm text-gray-700 hover:bg-purple-50 transition-colors">
                      Tell me more
                    </button>
                    <button className="flex-shrink-0 px-4 py-2 bg-white rounded-full border border-purple-200 text-sm text-gray-700 hover:bg-purple-50 transition-colors">
                      Other techniques?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - iOS/One UI 7 style cards */}
      <section id="features" className="py-20 mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Modern Mental Wellness Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Designed with the latest understanding of mental health and
              cutting-edge technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="group relative backdrop-blur-md bg-white/70 rounded-3xl p-6 transition-all duration-500 hover:bg-white/90 border border-white/80 shadow-xl hover:shadow-2xl overflow-hidden"
                onMouseEnter={(e) => handleShowTooltip(feature.tooltip, e)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                {/* Background gradient blur */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}
                ></div>

                {/* Content */}
                <div className="relative z-10 flex items-start">
                  <div
                    className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center transition-colors duration-300 mr-5`}
                  >
                    {feature.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>

                    {/* Interactive "Learn more" element */}
                    <button className="mt-5 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 group">
                      <span>Learn more</span>
                      <svg
                        className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Corner decoration */}
                <div
                  className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - One UI 7 style steps */}
      <section id="how-it-works" className="py-20 mx-auto px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple Steps to Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started with MindfulTalk is easy, secure, and designed
              with your privacy in mind.
            </p>
          </div>

          {/* Steps with connecting lines */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-200 via-teal-200 to-blue-200 hidden md:block"></div>

            <div className="space-y-24 relative">
              {/* Step 1 */}
              <div className="md:flex items-center">
                <div className="md:w-1/2 pr-10 mb-10 md:mb-0 text-right">
                  <span className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
                    STEP 1
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Create Your Secure Account
                  </h3>
                  <p className="text-gray-600">
                    Sign up with Internet Identity for enhanced privacy and
                    security. Your data is end-to-end encrypted and accessible
                    only to you.
                  </p>
                </div>

                <div className="md:w-20 flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-xl border-4 border-white z-10">
                    1
                  </div>
                </div>

                <div className="md:w-1/2 pl-10">
                  <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-xl">
                    <img
                      src="/internet-identity-hero.webp"
                      alt="Secure login screen"
                      className="w-full h-48 object-cover rounded-2xl mb-3"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        End-to-end encryption
                      </span>
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                        <span className="text-sm text-green-700">Secure</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="md:flex items-center">
                <div className="md:w-1/2 pr-10 mb-10 md:mb-0 md:order-2 text-left md:text-left">
                  <span className="inline-block px-4 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold mb-3">
                    STEP 2
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Start a Conversation
                  </h3>
                  <p className="text-gray-600">
                    Begin talking to your AI companion about anything on your
                    mind. Share your thoughts, feelings, or challenges in a
                    judgment-free environment.
                  </p>
                </div>

                <div className="md:w-20 flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-xl border-4 border-white z-10">
                    2
                  </div>
                </div>

                <div className="md:w-1/2 pl-10 md:order-1">
                  <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-xl">
                    <div className="flex mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex-shrink-0 mr-2"></div>
                      <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-[80%]">
                        <p className="text-sm text-gray-700">
                          What's been on your mind lately?
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end mb-4">
                      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-sm max-w-[80%]">
                        <p className="text-sm">
                          I've been feeling overwhelmed with work lately...
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 ml-2"></div>
                    </div>

                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex-shrink-0 mr-2"></div>
                      <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-[80%]">
                        <p className="text-sm text-gray-700">
                          I'm here to help. Let's break down what's causing the
                          overwhelm...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="md:flex items-center">
                <div className="md:w-1/2 pr-10 mb-10 md:mb-0 text-right">
                  <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-3">
                    STEP 3
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Track Your Progress
                  </h3>
                  <p className="text-gray-600">
                    Use the mood journal and tracking tools to monitor your
                    mental wellness journey over time, identifying patterns and
                    improvements.
                  </p>
                </div>

                <div className="md:w-20 flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-xl border-4 border-white z-10">
                    3
                  </div>
                </div>

                <div className="md:w-1/2 pl-10">
                  <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-xl">
                    <div className="h-48 bg-gray-100 rounded-2xl p-4 mb-3">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-800">
                          Mood Trends
                        </h4>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Last 30 days
                        </span>
                      </div>

                      {/* Simple chart visualization */}
                      <div className="h-24 flex items-end space-x-1">
                        {[30, 45, 25, 60, 70, 45, 80, 65, 55, 90, 75, 60].map(
                          (height, index) => (
                            <div
                              key={index}
                              className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-indigo-500"
                              style={{ height: `${height}%` }}
                            ></div>
                          )
                        )}
                      </div>

                      <div className="mt-2 text-center text-xs text-gray-500">
                        Your mood has improved by 23% in the last month
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Daily tracking
                      </span>
                      <div className="flex space-x-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel - iOS-style */}
      <section id="testimonials" className="py-20 mx-auto px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
              User Experiences
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from people whose mental wellness journey has been
              supported by MindfulTalk.
            </p>
          </div>

          {/* Testimonial Cards with One UI 7 style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="group relative backdrop-blur-md bg-white/60 rounded-3xl p-6 transition-all duration-500 hover:bg-white/90 border border-white/80 shadow-xl hover:shadow-2xl"
              >
                {/* Quote icon */}
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                  </svg>
                </div>

                {/* Content */}
                <div className="mb-6 text-gray-700">"{testimonial.quote}"</div>

                {/* Author info */}
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-200 to-teal-200 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.author}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>

                {/* Corner decoration */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-purple-400/10 to-teal-400/10 group-hover:from-purple-400/20 group-hover:to-teal-400/20 transition-colors duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 mx-auto px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-gradient-to-r from-teal-500 to-purple-600 rounded-3xl overflow-hidden shadow-xl">
            <div className="relative px-6 py-10 sm:px-12 sm:py-16 md:py-20 md:px-16 lg:px-20">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 opacity-20">
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="white"
                    strokeWidth="8"
                  />
                  <path
                    d="M50,30 C35,10 10,20 10,40 C10,60 30,70 50,90 C70,70 90,60 90,40 C90,20 65,10 50,30 Z"
                    fill="white"
                    strokeWidth="0"
                  />
                </svg>
              </div>

              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 opacity-20 transform rotate-180">
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="white"
                    strokeWidth="8"
                  />
                </svg>
              </div>

              <div className="relative flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-7/12 mb-8 md:mb-0 md:pr-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    Begin Your Wellness Journey Today
                  </h2>
                  <p className="mt-4 text-lg text-white/80 max-w-2xl">
                    Take the first step toward better mental health. Our AI
                    companion is available 24/7 to provide support, guidance,
                    and evidence-based techniques for your well-being.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <a
                      href="/signup"
                      className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center"
                    >
                      Get Started
                      <svg
                        className="ml-2 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </a>
                    <a
                      href="/resources"
                      className="px-6 py-3 bg-transparent border-2 border-white/70 text-white rounded-lg font-medium hover:bg-white/10 transition-all duration-300"
                    >
                      Explore Resources
                    </a>
                  </div>
                </div>

                <div className="md:w-5/12 flex justify-center">
                  <div className="w-full max-w-sm p-6 bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4">
                        <svg
                          className="w-7 h-7 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          Create Account
                        </h3>
                        <p className="text-white/70 text-sm">
                          Quick & secure setup
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4">
                        <svg
                          className="w-7 h-7 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          Start Chatting
                        </h3>
                        <p className="text-white/70 text-sm">
                          AI-powered mental support
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4">
                        <svg
                          className="w-7 h-7 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          Track Progress
                        </h3>
                        <p className="text-white/70 text-sm">
                          Monitor your wellness journey
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/20">
                      <a
                        href="/login"
                        className="w-full flex items-center justify-center px-6 py-3 bg-white text-purple-600 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                      >
                        <svg
                          className="mr-2 w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign In Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-20 grid gap-8 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transform transition-transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-lg dark:text-white">
                    Maria S.
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Student, 24
                  </p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "During my final exams, anxiety was overwhelming. This app
                helped me implement breathing techniques and cognitive
                strategies that made a real difference."
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transform transition-transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  J
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-lg dark:text-white">
                    James K.
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    IT Professional, 36
                  </p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "I've tried several mental health apps, but this one stands out
                with its personalized approach. The AI seems to remember our
                conversations and adapts to my needs."
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transform transition-transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-lg dark:text-white">
                    Sarah L.
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Healthcare Worker, 41
                  </p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(4)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <svg
                    className="w-5 h-5 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "After long shifts, I needed something to help me decompress.
                The guided meditation and journaling features have become an
                essential part of my self-care routine."
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h3 className="text-4xl font-bold text-gradient-mental">50K+</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Active Users
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h3 className="text-4xl font-bold text-gradient-mental">1.2M+</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Conversations
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h3 className="text-4xl font-bold text-gradient-mental">92%</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Satisfaction Rate
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h3 className="text-4xl font-bold text-gradient-mental">24/7</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Available Support
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Is my data private and secure?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Absolutely. We use end-to-end encryption and never share your
                  conversations with third parties. Your mental health journey
                  is completely private.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Can this replace professional therapy?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  While our AI companion provides valuable support, it's not a
                  replacement for professional mental health care. We encourage
                  seeking professional help when needed.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  How does the AI companion learn?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI is trained on evidence-based mental health practices
                  and adapts to your specific needs over time, providing
                  increasingly personalized support.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Is there a cost to use the service?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We offer a free basic plan with core features. Premium plans
                  with advanced tools and unlimited sessions are available
                  through subscription.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div
          className="absolute top-1/3 right-0 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/2 left-1/4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </section>
    </div>
  );
}
export default Welcome;
// Note: The above code is a complete React component that includes various sections such as features, how it works, testimonials, and a call to action.
// It uses Tailwind CSS for styling and includes interactive elements like buttons and hover effects. The component is designed to be responsive and visually appealing, with a focus on mental health and wellness.
