import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Journal() {
  const { actor, userProfile } = useAuth();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', mood: 'neutral' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Dummy data untuk pengembangan UI
  const dummyEntries = [
    {
      id: 1,
      title: 'Finding calm in chaos',
      content: 'Today was challenging, but I managed to take 10 minutes for myself to meditate and focus on my breathing. I noticed that my anxiety decreased afterward.',
      mood: 'calm',
      createdAt: Date.now() - 86400000 * 2,
    },
    {
      id: 2,
      title: 'Productive day',
      content: 'Finished all my tasks for the day! I\'m proud of myself for staying focused despite distractions. Need to remember this feeling next time I procrastinate.',
      mood: 'happy',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 3,
      title: 'Feeling overwhelmed',
      content: 'Too many deadlines approaching. I need to break down my tasks into smaller steps and take them one at a time. Remember to breathe.',
      mood: 'anxious',
      createdAt: Date.now(),
    }
  ];

  useEffect(() => {
    // Simulasi fetch data - ini akan diganti dengan panggilan ke canister
    // ketika backend implementation selesai
    setTimeout(() => {
      setEntries(dummyEntries);
      setIsLoading(false);
    }, 1000);
    
    // Nanti implementasi akan seperti ini:
    // if (actor) {
    //   fetchJournalEntries();
    // }
  }, []);

  // Function untuk fetch data dari canister (akan diimplementasikan nanti)
  // const fetchJournalEntries = async () => {
  //   setIsLoading(true);
  //   try {
  //     const result = await actor.getJournalEntries();
  //     if ('ok' in result) {
  //       setEntries(result.ok);
  //     } else {
  //       setError(result.err);
  //     }
  //   } catch (err) {
  //     console.error('Failed to fetch journal entries:', err);
  //     setError('Could not load your journal entries');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Validasi
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      setError('Please fill out both title and content');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Untuk demo, kita hanya tambahkan ke state lokal
      const newEntryWithId = {
        ...newEntry,
        id: entries.length + 1,
        createdAt: Date.now(),
      };
      
      setEntries([newEntryWithId, ...entries]);
      setNewEntry({ title: '', content: '', mood: 'neutral' });
      setSuccessMessage('Journal entry saved!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      // Nanti implementasinya akan seperti ini:
      // const result = await actor.createJournalEntry(newEntry);
      // if ('ok' in result) {
      //   fetchJournalEntries();
      //   setNewEntry({ title: '', content: '', mood: 'neutral' });
      //   setSuccessMessage('Journal entry saved!');
      // } else {
      //   setError(result.err);
      // }
    } catch (err) {
      console.error('Failed to save journal entry:', err);
      setError('Could not save your journal entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😔';
      case 'anxious': return '😰';
      case 'angry': return '😠';
      case 'calm': return '😌';
      default: return '😐';
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'happy': return 'bg-green-100 text-green-800 border-green-200';
      case 'sad': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'anxious': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'angry': return 'bg-red-100 text-red-800 border-red-200';
      case 'calm': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-16 h-16 relative">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-teal-200 animate-pulse"></div>
          <svg className="animate-spin w-full h-full text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Journal</h1>
          <p className="mt-2 text-gray-600">Track your thoughts, feelings, and progress over time</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* New Journal Entry Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">New Journal Entry</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newEntry.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Give your entry a title"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">What's on your mind?</label>
                <textarea
                  id="content"
                  name="content"
                  rows={4}
                  value={newEntry.content}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Write your thoughts here..."
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-1">How are you feeling?</label>
                <select
                  id="mood"
                  name="mood"
                  value={newEntry.mood}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="happy">Happy 😊</option>
                  <option value="sad">Sad 😔</option>
                  <option value="anxious">Anxious 😰</option>
                  <option value="angry">Angry 😠</option>
                  <option value="calm">Calm 😌</option>
                  <option value="neutral">Neutral 😐</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white px-5 py-2 rounded-md transition-colors shadow-sm flex items-center space-x-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      <span>Add Entry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Journal Entries List */}
        <div className="space-y-6">
          {entries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No journal entries yet</h3>
              <p className="mt-2 text-gray-500">Start journaling to track your thoughts and feelings over time.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-teal-400 to-purple-500"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-gray-900">{entry.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
                      {getMoodEmoji(entry.mood)} {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{entry.content}</p>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <span>{formatDate(entry.createdAt)}</span>
                    <div className="flex space-x-2">
                      <button className="text-teal-600 hover:text-teal-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}