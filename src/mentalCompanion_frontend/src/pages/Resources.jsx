import React from 'react';

export default function Resources() {
  // Dummy data untuk resource cards
  const resourceCategories = [
    {
      id: 1,
      title: 'Mental Health Articles',
      description: 'Educational articles about various mental health topics.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      resources: [
        {
          id: 101,
          title: 'Understanding Anxiety',
          snippet: 'Learn about the different types of anxiety disorders and their symptoms.',
          link: '#'
        },
        {
          id: 102,
          title: 'Mindfulness Techniques for Daily Life',
          snippet: 'Practical mindfulness exercises you can incorporate into your daily routine.',
          link: '#'
        },
        {
          id: 103,
          title: 'The Science of Sleep and Mental Health',
          snippet: 'How sleep affects your mental health and tips for better sleep hygiene.',
          link: '#'
        }
      ]
    },
    {
      id: 2,
      title: 'Crisis Resources',
      description: 'Immediate support for those in crisis or experiencing severe distress.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      resources: [
        {
          id: 201,
          title: 'National Suicide Prevention Lifeline',
          snippet: '24/7, free and confidential support for people in distress: 1-800-273-8255',
          link: 'https://suicidepreventionlifeline.org'
        },
        {
          id: 202,
          title: 'Crisis Text Line',
          snippet: 'Text HOME to 741741 to connect with a Crisis Counselor.',
          link: 'https://www.crisistextline.org'
        }
      ]
    },
    {
      id: 3,
      title: 'Self-Help Tools',
      description: 'Interactive tools to support your mental wellbeing journey.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
        </svg>
      ),
      resources: [
        {
          id: 301,
          title: 'Mood Tracker Worksheet',
          snippet: 'Download a printable worksheet to track your daily mood patterns.',
          link: '#'
        },
        {
          id: 302,
          title: 'Guided Meditation Audio',
          snippet: 'A collection of guided meditations for stress reduction.',
          link: '#'
        },
        {
          id: 303,
          title: 'Cognitive Behavioral Therapy Exercises',
          snippet: 'Self-guided CBT exercises to challenge negative thought patterns.',
          link: '#'
        }
      ]
    },
    {
      id: 4,
      title: 'Find Professional Help',
      description: 'Directories and resources to find mental health professionals.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      resources: [
        {
          id: 401,
          title: 'Therapist Directory',
          snippet: 'Search for licensed therapists and counselors in your area.',
          link: '#'
        },
        {
          id: 402,
          title: 'Online Therapy Platforms',
          snippet: 'Affordable online therapy options for accessing care from home.',
          link: '#'
        },
        {
          id: 403,
          title: 'Insurance Guide',
          snippet: 'How to understand what mental health services your insurance covers.',
          link: '#'
        }
      ]
    }
  ];

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Mental Health Resources</h1>
          <p className="mt-4 text-lg text-gray-600">
            Access helpful articles, tools, and services to support your mental wellbeing journey.
            These resources complement your conversations with Mental Health Companion.
          </p>
        </div>

        {/* Featured Resources */}
        <div className="bg-gradient-to-r from-teal-500 to-purple-500 rounded-xl shadow-lg mb-12 overflow-hidden">
          <div className="px-8 py-12 text-white md:flex items-center">
            <div className="md:w-3/5 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold mb-3">Featured Resource</h2>
              <h3 className="text-xl font-medium mb-2">30-Day Mental Wellness Challenge</h3>
              <p className="mb-4">
                Join our 30-day wellness challenge with daily activities designed to improve your mental health.
                Each day includes a simple task focused on mindfulness, gratitude, or self-care.
              </p>
              <button className="px-6 py-2 bg-white text-purple-600 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-sm">
                Start Challenge
              </button>
            </div>
            <div className="md:w-2/5">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
                <div className="text-white text-xl font-medium mb-4">Today's Activity</div>
                <p className="text-white/90 mb-3">
                  Take 5 minutes to write down three things you're grateful for today. Studies show that practicing gratitude
                  can significantly improve mental wellbeing over time.
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-white/30">
                  <span className="text-white/90">Day 1 of 30</span>
                  <button className="text-white font-medium flex items-center hover:text-teal-100 transition-colors">
                    Next Day
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Categories */}
        <div className="space-y-10">
          {resourceCategories.map((category) => (
            <div key={category.id}>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white mr-3">
                  {category.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
              </div>
              <p className="text-gray-600 mb-6">{category.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.resources.map((resource) => (
                  <a 
                    key={resource.id} 
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow hover:border-teal-300 transition-all group"
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">{resource.title}</h3>
                    <p className="text-gray-600">{resource.snippet}</p>
                    <div className="mt-4 text-teal-600 font-medium flex items-center text-sm group-hover:text-purple-600 transition-colors">
                      Learn more
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Community Support Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Community Support</h2>
            <p className="text-gray-600 mb-6">
              Connect with others on similar mental health journeys. Sharing experiences in a supportive community
              can provide valuable insights and reduce feelings of isolation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Online Support Groups</h3>
                <p className="text-gray-600 mb-4">Join moderated support groups focused on specific mental health topics.</p>
                <button className="text-teal-600 font-medium flex items-center hover:text-purple-600 transition-colors">
                  Browse groups
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Peer Support Network</h3>
                <p className="text-gray-600 mb-4">Connect one-on-one with trained peer supporters who have lived experience.</p>
                <button className="text-teal-600 font-medium flex items-center hover:text-purple-600 transition-colors">
                  Find a peer supporter
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-yellow-50 rounded-lg p-4 text-yellow-800 text-sm border border-yellow-200">
          <p><strong>Disclaimer:</strong> The resources provided here are for informational purposes only and are not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
        </div>
      </div>
    </div>
  );
}