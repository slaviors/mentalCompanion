import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMoodTracking } from '../hooks';

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

export default function MoodTrackingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { 
    moodRecords, 
    isLoadingMoods, 
    error, 
    recordMood, 
    getMoodTrends, 
    getMoodStats, 
    calculateWellnessScore 
  } = useMoodTracking();
  
  const [formData, setFormData] = useState({
    happiness: 5,
    anxiety: 5,
    energy: 5,
    focus: 5,
    notes: ''
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [moodTrends, setMoodTrends] = useState([]);
  const [timeRange, setTimeRange] = useState(7); // Default 7 hari
  
  // Redirect jika tidak terotentikasi
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/mood' } });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Persiapkan data mood untuk visualisasi
  useEffect(() => {
    if (moodRecords && moodRecords.length > 0) {
      setMoodTrends(getMoodTrends(timeRange));
    }
  }, [moodRecords, getMoodTrends, timeRange]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'range' ? parseInt(value) : value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    setSuccessMessage('');
    
    try {
      const { happiness, anxiety, energy, focus, notes } = formData;
      
      // Validasi
      if (happiness < 0 || happiness > 10 || 
          anxiety < 0 || anxiety > 10 || 
          energy < 0 || energy > 10 || 
          focus < 0 || focus > 10) {
        setFormError('All mood values must be between 0 and 10');
        setSaving(false);
        return;
      }
      
      const success = await recordMood(formData);
      
      if (success) {
        setSuccessMessage('Mood recorded successfully!');
        
        // Reset notes field but keep slider values
        setFormData(prev => ({
          ...prev,
          notes: ''
        }));
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to record mood:', err);
      setFormError('Failed to record mood. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Persiapkan data untuk chart
  const chartData = {
    labels: moodTrends.map(mood => {
      const date = new Date(mood.date);
      return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Happiness',
        data: moodTrends.map(mood => mood.happiness),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3
      },
      {
        label: 'Anxiety',
        data: moodTrends.map(mood => mood.anxiety),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3
      },
      {
        label: 'Energy',
        data: moodTrends.map(mood => mood.energy),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        tension: 0.3
      },
      {
        label: 'Focus',
        data: moodTrends.map(mood => mood.focus),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: 'Level (0-10)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            return context[0].label;
          }
        }
      }
    }
  };
  
  // Get mood stats
  const moodStats = getMoodStats();
  
  // Jika loading
  if (isLoading || isLoadingMoods) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  // Helper untuk menentukan label untuk slider
  const getMoodLabel = (value, type) => {
    const labels = {
      happiness: {
        0: 'Very Unhappy',
        3: 'Unhappy',
        5: 'Neutral',
        7: 'Happy',
        10: 'Very Happy'
      },
      anxiety: {
        0: 'Very Calm',
        3: 'Calm',
        5: 'Neutral',
        7: 'Anxious',
        10: 'Very Anxious'
      },
      energy: {
        0: 'Exhausted',
        3: 'Tired',
        5: 'Neutral',
        7: 'Energetic',
        10: 'Very Energetic'
      },
      focus: {
        0: 'Not Focused',
        3: 'Distracted',
        5: 'Neutral',
        7: 'Focused',
        10: 'Highly Focused'
      }
    };
    
    // Find closest label
    const thresholds = Object.keys(labels[type]).map(Number);
    const closest = thresholds.reduce((prev, curr) => 
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
    
    return labels[type][closest];
  };
  
  // Helper untuk mendapatkan warna untuk slider
  const getMoodColor = (value, type) => {
    const colors = {
      happiness: {
        0: '#f87171', // red-400
        5: '#fbbf24', // amber-400
        10: '#34d399' // emerald-400
      },
      anxiety: {
        0: '#34d399', // emerald-400
        5: '#fbbf24', // amber-400
        10: '#f87171' // red-400
      },
      energy: {
        0: '#d1d5db', // gray-300
        5: '#93c5fd', // blue-300
        10: '#60a5fa' // blue-400
      },
      focus: {
        0: '#d1d5db', // gray-300
        5: '#a78bfa', // violet-400
        10: '#8b5cf6' // violet-500
      }
    };
    
    // Simple linear interpolation for colors
    let color = '';
    
    if (value <= 5) {
      color = interpolateColor(colors[type][0], colors[type][5], value / 5);
    } else {
      color = interpolateColor(colors[type][5], colors[type][10], (value - 5) / 5);
    }
    
    return color;
  };
  
  // Helper for color interpolation
  const interpolateColor = (color1, color2, factor) => {
    if (factor > 1) factor = 1;
    if (factor < 0) factor = 0;
    
    const result = color1.replace(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, (m, r, g, b) => {
      const r1 = parseInt(r, 16);
      const g1 = parseInt(g, 16);
      const b1 = parseInt(b, 16);
      
      const r2 = parseInt(color2.substr(1, 2), 16);
      const g2 = parseInt(color2.substr(3, 2), 16);
      const b2 = parseInt(color2.substr(5, 2), 16);
      
      const r3 = Math.round(r1 + (r2 - r1) * factor);
      const g3 = Math.round(g1 + (g2 - g1) * factor);
      const b3 = Math.round(b1 + (b2 - b1) * factor);
      
      return `#${r3.toString(16).padStart(2, '0')}${g3.toString(16).padStart(2, '0')}${b3.toString(16).padStart(2, '0')}`;
    });
    
    return result;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mood Tracking
          </h1>
          <p className="text-gray-600">
            Track your mood to gain insights into your mental wellbeing patterns.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Wellness Score Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Wellness Score</h2>
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
                    stroke={`hsl(${calculateWellnessScore()}, 70%, 50%)`} // Color based on score
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${calculateWellnessScore()}, 100`}
                  />
                  <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="gray">
                    {calculateWellnessScore()}/100
                  </text>
                </svg>
              </div>
            </div>
            <p className="text-center mt-2 text-sm text-gray-500">Based on your recent mood data</p>
          </div>
          
          {/* Mood Stats Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Mood Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-teal-50 rounded-md">
                <p className="text-sm text-gray-500">Average Happiness</p>
                <p className="text-2xl font-bold text-teal-600">{moodStats.averageHappiness}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-md">
                <p className="text-sm text-gray-500">Average Anxiety</p>
                <p className="text-2xl font-bold text-red-600">{moodStats.averageAnxiety}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-md">
                <p className="text-sm text-gray-500">Average Energy</p>
                <p className="text-2xl font-bold text-yellow-600">{moodStats.averageEnergy}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-md">
                <p className="text-sm text-gray-500">Average Focus</p>
                <p className="text-2xl font-bold text-purple-600">{moodStats.averageFocus}</p>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-500">Total entries: {moodStats.totalEntries}</p>
            </div>
          </div>
        </div>
        
        {/* Mood Tracking Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Record Your Current Mood</h2>
          
          {formError && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Happiness Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="happiness" className="block text-sm font-medium text-gray-700">
                    Happiness
                  </label>
                  <span className="text-sm font-medium" style={{ color: getMoodColor(formData.happiness, 'happiness') }}>
                    {getMoodLabel(formData.happiness, 'happiness')}
                  </span>
                </div>
                <input
                  type="range"
                  name="happiness"
                  id="happiness"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.happiness}
                  onChange={handleInputChange}
                  className="w-full accent-teal-500"
                  disabled={saving}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
              
              {/* Anxiety Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="anxiety" className="block text-sm font-medium text-gray-700">
                    Anxiety
                  </label>
                  <span className="text-sm font-medium" style={{ color: getMoodColor(formData.anxiety, 'anxiety') }}>
                    {getMoodLabel(formData.anxiety, 'anxiety')}
                  </span>
                </div>
                <input
                  type="range"
                  name="anxiety"
                  id="anxiety"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.anxiety}
                  onChange={handleInputChange}
                  className="w-full accent-red-500"
                  disabled={saving}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
              
              {/* Energy Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="energy" className="block text-sm font-medium text-gray-700">
                    Energy
                  </label>
                  <span className="text-sm font-medium" style={{ color: getMoodColor(formData.energy, 'energy') }}>
                    {getMoodLabel(formData.energy, 'energy')}
                  </span>
                </div>
                <input
                  type="range"
                  name="energy"
                  id="energy"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.energy}
                  onChange={handleInputChange}
                  className="w-full accent-yellow-500"
                  disabled={saving}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
              
              {/* Focus Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="focus" className="block text-sm font-medium text-gray-700">
                    Focus
                  </label>
                  <span className="text-sm font-medium" style={{ color: getMoodColor(formData.focus, 'focus') }}>
                    {getMoodLabel(formData.focus, 'focus')}
                  </span>
                </div>
                <input
                  type="range"
                  name="focus"
                  id="focus"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.focus}
                  onChange={handleInputChange}
                  className="w-full accent-purple-500"
                  disabled={saving}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
              
              {/* Notes Textarea */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  placeholder="What's contributing to your mood today? Any specific events or thoughts?"
                  disabled={saving}
                />
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Record Mood'}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Mood Trends Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Your Mood Trends</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange(7)}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === 7 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange(30)}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === 30 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange(90)}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === 90 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                3 Months
              </button>
            </div>
          </div>
          
          {moodTrends.length > 0 ? (
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">Not enough data to show trends yet.</p>
              <p className="text-gray-500">
                Start recording your mood regularly to see patterns and insights.
              </p>
            </div>
          )}
        </div>
        
        {/* Mood History Table - Optional */}
        {moodRecords.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Mood History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Happiness
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Anxiety
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Energy
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Focus
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {moodRecords.slice(0, 10).map((record, index) => (
                    <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.date.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="font-medium" style={{ color: getMoodColor(record.happiness, 'happiness') }}>
                          {record.happiness}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="font-medium" style={{ color: getMoodColor(record.anxiety, 'anxiety') }}>
                          {record.anxiety}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="font-medium" style={{ color: getMoodColor(record.energy, 'energy') }}>
                          {record.energy}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="font-medium" style={{ color: getMoodColor(record.focus, 'focus') }}>
                          {record.focus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {record.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {moodRecords.length > 10 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">Showing 10 most recent entries of {moodRecords.length} total</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}