import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMoodTracking, useJournal, useGoals } from '../hooks';

// Komponen chart (gunakan library chart pilihan Anda)
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, userProfile } = useAuth();
  const { moodRecords, getCurrentMood, getMoodTrends, calculateWellnessScore, isLoadingMoods } = useMoodTracking();
  const { journalEntries, isLoadingJournal, getJournalMoodStats } = useJournal();
  const { goals, isLoadingGoals, getGoalsSummary } = useGoals();
  
  const [moodTrends, setMoodTrends] = useState([]);

  // Redirect jika tidak terotentikasi
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/dashboard' } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Persiapkan data mood untuk visualisasi
  useEffect(() => {
    if (moodRecords && moodRecords.length > 0) {
      setMoodTrends(getMoodTrends(7)); // Data 7 hari terakhir
    }
  }, [moodRecords, getMoodTrends]);

  // Persiapkan data untuk chart
  const chartData = {
    labels: moodTrends.map(mood => {
      const date = new Date(mood.date);
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Happiness',
        data: moodTrends.map(mood => mood.happiness),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Anxiety',
        data: moodTrends.map(mood => mood.anxiety),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Energy',
        data: moodTrends.map(mood => mood.energy),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
      },
      {
        label: 'Focus',
        data: moodTrends.map(mood => mood.focus),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      }
    }
  };

  // Mendapatkan wellness score
  const wellnessScore = calculateWellnessScore();
  
  // Mendapatkan data goals
  const goalsSummary = getGoalsSummary();
  
  // Mendapatkan data jurnal
  const journalStats = getJournalMoodStats();
  
  // Mendapatkan current mood
  const currentMood = getCurrentMood();

  // Rendering kondisional saat loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {userProfile?.name || 'Friend'}
        </h1>
        <p className="text-gray-600">
          Here's an overview of your mental well-being journey.
        </p>
      </div>
      
      {/* Wellness Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 col-span-1">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Wellness Score</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={`hsl(${wellnessScore}, 70%, 50%)`} // Color based on score
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${wellnessScore}, 100`}
                />
                <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="gray">
                  {wellnessScore}/100
                </text>
              </svg>
            </div>
          </div>
          <p className="text-center mt-2 text-sm text-gray-500">Based on your recent mood data</p>
        </div>
        
        {/* Current Mood Card */}
        <div className="bg-white rounded-lg shadow-md p-6 col-span-1">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Current Mood</h2>
          {currentMood ? (
            <div>
              <div className="flex space-x-4 mb-4 justify-around">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Happiness</div>
                  <div className="text-xl font-bold" style={{color: `rgba(75, 192, 192, 1)`}}>{currentMood.happiness}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Anxiety</div>
                  <div className="text-xl font-bold" style={{color: `rgba(255, 99, 132, 1)`}}>{currentMood.anxiety}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Energy</div>
                  <div className="text-xl font-bold" style={{color: `rgba(255, 206, 86, 1)`}}>{currentMood.energy}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                Recorded: {currentMood.date.toLocaleDateString()}
              </div>
              <div className="mt-3">
                <Link to="/mood" className="text-teal-500 text-sm font-medium hover:text-teal-600">
                  Record new mood →
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 mb-4">You haven't recorded any moods yet.</p>
              <Link
                to="/mood"
                className="inline-block px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
              >
                Record Your First Mood
              </Link>
            </div>
          )}
        </div>
        
        {/* Goals Progress Card */}
        <div className="bg-white rounded-lg shadow-md p-6 col-span-1">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Goals Progress</h2>
          {goals.length > 0 ? (
            <div>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Completion Rate</span>
                  <span className="text-sm font-medium">{goalsSummary.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${goalsSummary.completionRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-center p-2 bg-purple-50 rounded-md">
                  <div className="text-xl font-bold text-purple-600">{goalsSummary.completed}</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div className="text-center p-2 bg-teal-50 rounded-md">
                  <div className="text-xl font-bold text-teal-600">{goalsSummary.uncompleted}</div>
                  <div className="text-xs text-gray-500">In Progress</div>
                </div>
              </div>
              <div className="mt-2">
                <Link to="/goals" className="text-purple-500 text-sm font-medium hover:text-purple-600">
                  Manage your goals →
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 mb-4">You haven't created any goals yet.</p>
              <Link
                to="/goals"
                className="inline-block px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              >
                Create Your First Goal
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mood Trends Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Mood Trends</h2>
        {moodTrends.length > 0 ? (
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">Not enough data to show trends yet.</p>
            <Link
              to="/mood"
              className="inline-block px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
            >
              Start Tracking Your Mood
            </Link>
          </div>
        )}
      </div>
      
      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Journal Entries */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Journal Entries</h2>
            <Link to="/journal" className="text-teal-500 text-sm font-medium hover:text-teal-600">
              View All
            </Link>
          </div>
          
          {isLoadingJournal ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
            </div>
          ) : journalEntries.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {journalEntries.slice(0, 3).map(entry => (
                <li key={entry.id} className="py-3">
                  <Link to={`/journal/${entry.id}`} className="block hover:bg-gray-50">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{entry.title}</p>
                      <span className="text-xs text-gray-500">
                        {entry.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 truncate">
                      {entry.content.substring(0, 80)}...
                    </p>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">
                        {entry.mood}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">No journal entries yet.</p>
              <Link
                to="/journal/new"
                className="inline-block px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
              >
                Write Your First Entry
              </Link>
            </div>
          )}
        </div>
        
        {/* Active Goals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Active Goals</h2>
            <Link to="/goals" className="text-purple-500 text-sm font-medium hover:text-purple-600">
              View All
            </Link>
          </div>
          
          {isLoadingGoals ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          ) : goals.filter(goal => !goal.completed).length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {goals
                .filter(goal => !goal.completed)
                .slice(0, 4)
                .map(goal => (
                  <li key={goal.id} className="py-3">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                        checked={goal.completed}
                        onChange={() => {}} // Read-only in dashboard
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                        <p className="text-xs text-gray-500">
                          Created: {goal.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">No active goals.</p>
              <Link
                to="/goals"
                className="inline-block px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              >
                Create New Goal
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;