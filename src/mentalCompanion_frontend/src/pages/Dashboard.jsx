import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper untuk format tanggal
const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Data untuk Mood Trends
const moodTrendsData = [
  { date: '2025-05-06', happiness: 7, anxiety: 4, energy: 6, focus: 5 },
  { date: '2025-05-07', happiness: 6, anxiety: 5, energy: 5, focus: 6 },
  { date: '2025-05-08', happiness: 5, anxiety: 6, energy: 4, focus: 4 },
  { date: '2025-05-09', happiness: 4, anxiety: 7, energy: 3, focus: 3 },
  { date: '2025-05-10', happiness: 5, anxiety: 5, energy: 5, focus: 5 },
  { date: '2025-05-11', happiness: 7, anxiety: 3, energy: 8, focus: 7 },
  { date: '2025-05-12', happiness: 8, anxiety: 2, energy: 9, focus: 8 },
  { date: '2025-05-13', happiness: 9, anxiety: 1, energy: 8, focus: 9 },
];

// Data untuk Weekly Activity
const weeklyActivityData = [
  { name: 'Sun', chats: 2, journal: 1, exercises: 3 },
  { name: 'Mon', chats: 3, journal: 2, exercises: 2 },
  { name: 'Tue', chats: 1, journal: 3, exercises: 1 },
  { name: 'Wed', chats: 4, journal: 1, exercises: 2 },
  { name: 'Thu', chats: 2, journal: 2, exercises: 3 },
  { name: 'Fri', chats: 3, journal: 1, exercises: 1 },
  { name: 'Sat', chats: 5, journal: 3, exercises: 4 },
];

// Data untuk Mood Distribution
const moodDistributionData = [
  { name: 'Happy', value: 35, color: '#4FD1C5' },
  { name: 'Calm', value: 25, color: '#9F7AEA' },
  { name: 'Tired', value: 15, color: '#F6AD55' },
  { name: 'Anxious', value: 10, color: '#FC8181' },
  { name: 'Focused', value: 15, color: '#63B3ED' },
];

// Recent Journal Entries
const journalEntries = [
  {
    id: 1,
    title: 'Morning Reflection',
    date: '2025-05-13',
    mood: 'Happy',
    excerpt: 'Today I woke up feeling refreshed and ready to tackle the day...',
    color: '#4FD1C5'
  },
  {
    id: 2,
    title: 'Afternoon Thoughts',
    date: '2025-05-12',
    mood: 'Calm',
    excerpt: 'After lunch, I took some time to meditate and organize my tasks...',
    color: '#9F7AEA'
  },
  {
    id: 3,
    title: 'Evening Reflection',
    date: '2025-05-11',
    mood: 'Tired',
    excerpt: 'Today was quite challenging with multiple deadlines to meet...',
    color: '#F6AD55'
  }
];

// Goals and Tasks
const goalsAndTasks = [
  { id: 1, title: 'Morning meditation', completed: true },
  { id: 2, title: 'Journal for 10 minutes', completed: true },
  { id: 3, title: 'Take a mindful walk', completed: false },
  { id: 4, title: 'Deep breathing exercise', completed: false },
  { id: 5, title: 'Connect with a friend', completed: false }
];

// Daily Inspiration Quotes
const inspirationalQuotes = [
  {
    quote: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Unknown"
  },
  {
    quote: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman"
  },
  {
    quote: "Mental health problems don't define who you are. They are something you experience.",
    author: "Roy T. Bennett"
  }
];

export default function Dashboard() {
  const { isAuthenticated, userProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [weeklyGoalProgress, setWeeklyGoalProgress] = useState(40);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Rotate inspirational quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length);
    }, 10000); // Change quote every 10 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Prepare data based on selected period
  const getPeriodData = () => {
    switch (selectedPeriod) {
      case 'week':
        return moodTrendsData.slice(-7);
      case 'month':
        return moodTrendsData;
      case 'year':
        // Simulated yearly data - in real app would be aggregated
        return moodTrendsData;
      default:
        return moodTrendsData.slice(-7);
    }
  };
  
  // Handle period change
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-teal-200 opacity-20"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-teal-500 animate-spin"></div>
            <svg className="w-full h-full text-teal-500 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8z" opacity="0.5" />
            </svg>
          </div>
          <p className="mt-4 text-sm text-teal-600 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-purple-500 px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {userProfile?.name?.split(' ')[0] || 'Friend'}!
              </h1>
              <p className="text-teal-100">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="h-16 w-16 rounded-full bg-white p-1 shadow-md">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                  {userProfile?.name ? userProfile.name[0].toUpperCase() : 'U'}
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start bg-teal-50 rounded-lg p-4">
              <div className="p-2 bg-teal-500 rounded-full text-white mr-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="mt-3 sm:mt-0">
                <h3 className="text-lg font-medium text-teal-800">Today's Inspiration</h3>
                <p className="text-teal-600 italic">"{inspirationalQuotes[currentQuote].quote}"</p>
                <p className="text-teal-500 text-sm">— {inspirationalQuotes[currentQuote].author}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mood Trends */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Mood Trends</h2>
                <p className="text-sm text-gray-500">Track your emotional wellbeing over time</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handlePeriodChange('week')}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    selectedPeriod === 'week' 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Week
                </button>
                <button 
                  onClick={() => handlePeriodChange('month')}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    selectedPeriod === 'month' 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Month
                </button>
                <button 
                  onClick={() => handlePeriodChange('year')}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    selectedPeriod === 'year' 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Year
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getPeriodData()}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="#888888"
                      fontSize={12}
                    />
                    <YAxis stroke="#888888" fontSize={12} domain={[0, 10]} />
                    <Tooltip 
                      formatter={(value) => [`${value} / 10`, '']}
                      labelFormatter={(label) => formatDate(label)}
                      contentStyle={{ 
                        borderRadius: '6px', 
                        border: 'none', 
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line 
                      type="monotone" 
                      dataKey="happiness" 
                      name="Happiness" 
                      stroke="#4FD1C5" 
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="anxiety" 
                      name="Anxiety" 
                      stroke="#FC8181" 
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="energy" 
                      name="Energy" 
                      stroke="#F6AD55" 
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="focus" 
                      name="Focus" 
                      stroke="#9F7AEA" 
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-teal-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-teal-800">Happiness</span>
                    <span className="text-2xl font-bold text-teal-600">9</span>
                  </div>
                  <div className="mt-2 text-xs text-teal-700">
                    <span className="inline-flex items-center text-green-600">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      15% up from last week
                    </span>
                  </div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-800">Anxiety</span>
                    <span className="text-2xl font-bold text-red-600">1</span>
                  </div>
                  <div className="mt-2 text-xs text-red-700">
                    <span className="inline-flex items-center text-green-600">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      20% down from last week
                    </span>
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-orange-800">Energy</span>
                    <span className="text-2xl font-bold text-orange-600">8</span>
                  </div>
                  <div className="mt-2 text-xs text-orange-700">
                    <span className="inline-flex items-center text-green-600">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      10% up from last week
                    </span>
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-800">Focus</span>
                    <span className="text-2xl font-bold text-purple-600">9</span>
                  </div>
                  <div className="mt-2 text-xs text-purple-700">
                    <span className="inline-flex items-center text-green-600">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      25% up from last week
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Weekly Activity */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Weekly Activity</h2>
              <p className="text-sm text-gray-500">Your engagement with mental wellness activities</p>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyActivityData}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '6px', 
                        border: 'none', 
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="chats" name="Conversations" fill="#4FD1C5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="journal" name="Journal Entries" fill="#9F7AEA" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="exercises" name="Wellness Exercises" fill="#F6AD55" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mr-2">Weekly Consistency:</div>
                  <div className="flex items-center">
                    <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-500 to-purple-500" style={{ width: '75%' }}></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">75%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Journal Entries */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Recent Journal Entries</h2>
              <p className="text-sm text-gray-500">Your recent thoughts and reflections</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {journalEntries.map((entry) => (
                  <div key={entry.id} className="flex border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-2" style={{ backgroundColor: entry.color }}></div>
                    <div className="flex-1 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800">{entry.title}</h3>
                        <span className="text-xs text-gray-500">{formatDate(entry.date)}</span>
                      </div>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${entry.color}20`, color: entry.color }}>
                          {entry.mood}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{entry.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button className="px-4 py-2 bg-white border border-teal-500 text-teal-600 rounded-md text-sm font-medium hover:bg-teal-50 transition-colors">
                  View All Journal Entries
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar - Right Column */}
        <div className="space-y-8">
          {/* Daily Wellness Score */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Wellness Score</h2>
              <p className="text-sm text-gray-500">Your overall mental wellness today</p>
            </div>
            <div className="p-6 flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E6E6E6"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#wellness-gradient)"
                    strokeWidth="3"
                    strokeDasharray="85, 100"
                    className="animate-dash"
                  />
                  <defs>
                    <linearGradient id="wellness-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4FD1C5" />
                      <stop offset="100%" stopColor="#9F7AEA" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent">85%</div>
                    <div className="text-xs text-gray-500">Excellent</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-sm text-gray-600 text-center">
                <p>You're doing great! Your wellness score is <span className="font-medium text-teal-600">15%</span> higher than last week.</p>
              </div>
              <div className="mt-4 w-full grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-teal-50 p-2 rounded">
                  <div className="font-medium text-teal-800">8.2/10</div>
                  <div className="text-teal-600">Sleep</div>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <div className="font-medium text-purple-800">9.0/10</div>
                  <div className="text-purple-600">Mood</div>
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <div className="font-medium text-orange-800">7.8/10</div>
                  <div className="text-orange-600">Activity</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mood Distribution */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Mood Distribution</h2>
              <p className="text-sm text-gray-500">Your emotional patterns this month</p>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {moodDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentage']}
                      contentStyle={{ 
                        borderRadius: '6px', 
                        border: 'none', 
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {moodDistributionData.map((mood) => (
                  <div key={mood.name} className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mood.color }}></div>
                    <span className="text-xs text-gray-600">{mood.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Today's Goals */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Today's Goals</h2>
              <p className="text-sm text-gray-500">Your mental wellness tasks for today</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {goalsAndTasks.map((task) => (
                  <div key={task.id} className="flex items-center p-2 rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label className={`ml-3 text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {task.title}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-1">Weekly progress ({weeklyGoalProgress}%)</div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-purple-500"
                    style={{ width: `${weeklyGoalProgress}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-md text-sm font-medium hover:from-teal-600 hover:to-purple-600 transition-colors shadow-sm">
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Goal
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Recommended Resources */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Recommended For You</h2>
              <p className="text-sm text-gray-500">Based on your recent mood patterns</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="group flex items-start p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex-shrink-0 p-1.5 bg-blue-500 rounded-lg text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 group-hover:text-blue-900">5-Minute Breathing Exercise</h3>
                    <p className="mt-1 text-xs text-blue-600">Perfect for reducing anxiety and improving focus</p>
                  </div>
                </div>
                
                <div className="group flex items-start p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <div className="flex-shrink-0 p-1.5 bg-purple-500 rounded-lg text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-purple-800 group-hover:text-purple-900">Article: Improving Sleep Quality</h3>
                    <p className="mt-1 text-xs text-purple-600">Tips to help you get more restful sleep</p>
                  </div>
                </div>
                
                <div className="group flex items-start p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                  <div className="flex-shrink-0 p-1.5 bg-teal-500 rounded-lg text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-teal-800 group-hover:text-teal-900">Guided Journaling Prompt</h3>
                    <p className="mt-1 text-xs text-teal-600">Reflect on moments of gratitude today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add keyframes to CSS */}
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dasharray: 85, 100;
          }
        }
        .animate-dash {
          animation: dash 1.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}