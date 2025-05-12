import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-gradient-to-b from-purple-50 to-teal-50 min-h-screen">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center">
              <span className="sr-only">Mental Health Companion</span>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">MH</div>
              <span className="ml-3 text-xl font-semibold text-teal-800">MindfulTalk</span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button 
              type="button" 
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-teal-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="#features" className="text-sm/6 font-medium text-teal-800 hover:text-teal-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm/6 font-medium text-teal-800 hover:text-teal-600 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-sm/6 font-medium text-teal-800 hover:text-teal-600 transition-colors">Testimonials</a>
            <a href="#about" className="text-sm/6 font-medium text-teal-800 hover:text-teal-600 transition-colors">About</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link to="/login" className="text-sm font-medium text-teal-800 hover:text-teal-600 transition-colors">
              Log in <span aria-hidden="true">→</span>
            </Link>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-30" onClick={() => setMobileMenuOpen(false)}>
            <div 
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">MH</div>
                  <span className="ml-2 text-lg font-semibold text-teal-800">MindfulTalk</span>
                </a>
                <button 
                  type="button" 
                  className="-m-2.5 rounded-md p-2.5 text-teal-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <a href="#features" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-medium text-teal-800 hover:bg-teal-50 transition-colors">Features</a>
                    <a href="#how-it-works" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-medium text-teal-800 hover:bg-teal-50 transition-colors">How It Works</a>
                    <a href="#testimonials" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-medium text-teal-800 hover:bg-teal-50 transition-colors">Testimonials</a>
                    <a href="#about" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-medium text-teal-800 hover:bg-teal-50 transition-colors">About</a>
                  </div>
                  <div className="py-6">
                    <Link 
                      to="/login" 
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-medium text-teal-800 hover:bg-teal-50 transition-colors"
                    >
                      Log in
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* Decorative blobs */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-300 to-teal-300 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}></div>
        </div>

        <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-40">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-4 py-1.5 text-sm/6 text-teal-700 ring-1 ring-teal-300/50 backdrop-blur-sm hover:ring-teal-400/50 transition-all duration-300">
              <span className="font-medium">Your mental health matters</span>
              <span className="ml-1 text-teal-500">♥</span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-balance text-teal-800 sm:text-6xl md:text-7xl">
              <span className="inline-block">Your Companion for</span>
              <span className="block mt-1 bg-gradient-to-r from-purple-600 via-teal-500 to-blue-500 bg-clip-text text-transparent">Mental Wellbeing</span>
            </h1>
            
            <p className="mt-8 text-lg/relaxed text-pretty text-gray-600 sm:text-xl max-w-2xl mx-auto">
              A safe, private space where you can express your thoughts and feelings, receive compassionate support, and develop healthy coping strategies for life's challenges.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4">
              <Link 
                to="/login" 
                className="rounded-full bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 px-6 py-3.5 text-base font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Your Journey
              </Link>
              <a href="#how-it-works" className="text-base/6 font-medium text-teal-800 flex items-center gap-x-1 hover:text-teal-600 transition-colors">
                Learn how it works 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
            
            {/* Feature cards */}
            <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100 hover:border-purple-200 group">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-teal-800 mb-2">Emotional Support</h3>
                <p className="text-gray-600 text-sm">Connect with a companion who is always ready to listen without judgment.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-teal-100 hover:border-teal-200 group">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-teal-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-teal-800 mb-2">Private & Secure</h3>
                <p className="text-gray-600 text-sm">Your conversations are completely private and protected on the Internet Computer.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 hover:border-blue-200 group sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-teal-800 mb-2">Personal Growth</h3>
                <p className="text-gray-600 text-sm">Develop coping strategies and mindfulness techniques for everyday challenges.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom decorative blob */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-teal-300 to-purple-300 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}></div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm py-4 text-center text-sm text-gray-500 mt-10">
        <p>&copy; {new Date().getFullYear()} Mental Health Companion</p>
        <p className="mt-1">Current date: {new Date('2025-05-12').toLocaleDateString()} | User: mamatqurtifa</p>
      </footer>
    </div>
  );
}

export default Welcome;