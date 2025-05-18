import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoals } from '../hooks';

export default function GoalsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { 
    goals, 
    isLoadingGoals, 
    error, 
    createGoal, 
    updateGoalStatus, 
    getGoalsSummary,
    getActiveGoals,
    getCompletedGoals
  } = useGoals();
  
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showCompletedGoals, setShowCompletedGoals] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  
  // Redirect jika tidak terotentikasi
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/goals' } });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Handle form submission untuk goal baru
  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    setSuccessMessage('');
    
    try {
      // Validasi
      if (!newGoalTitle.trim()) {
        setFormError('Goal title is required');
        setSaving(false);
        return;
      }
      
      const success = await createGoal(newGoalTitle.trim());
      
      if (success) {
        setNewGoalTitle('');
        setSuccessMessage('Goal created successfully!');
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to create goal:', err);
      setFormError('Failed to create goal. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle update goal status (complete/incomplete)
  const handleStatusChange = async (goalId, completed) => {
    try {
      setFormError(null);
      await updateGoalStatus(goalId, !completed);
    } catch (err) {
      console.error('Failed to update goal status:', err);
      setFormError('Failed to update goal status. Please try again.');
    }
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Get data for display
  const goalsSummary = getGoalsSummary();
  const activeGoals = getActiveGoals();
  const completedGoals = getCompletedGoals();
  
  // Jika loading
  if (isLoading || isLoadingGoals) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mental Wellness Goals
          </h1>
          <p className="text-gray-600">
            Set and track goals to improve your mental wellbeing.
          </p>
        </div>
        
        {/* Goal Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Completion Rate</h2>
            <div className="flex justify-center">
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
                    stroke="#8b5cf6" // purple-500
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${goalsSummary.completionRate}, 100`}
                  />
                  <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="gray">
                    {goalsSummary.completionRate}%
                  </text>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Goals Overview</h2>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Goals</span>
                <span className="font-bold text-gray-900">{goalsSummary.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Active Goals</span>
                <span className="font-bold text-purple-500">{goalsSummary.uncompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Completed Goals</span>
                <span className="font-bold text-green-500">{goalsSummary.completed}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Recent Progress</h2>
            <div className="flex justify-center items-center h-24">
              {goalsSummary.completedThisWeek > 0 ? (
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-1">{goalsSummary.completedThisWeek}</div>
                  <p className="text-gray-500 text-sm">goals completed this week</p>
                </div>
              ) : (
                <p className="text-center text-gray-500">No goals completed yet this week</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Create New Goal Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Goal</h2>
          
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
          
          <form onSubmit={handleCreateGoal}>
            <div className="flex">
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Enter a new goal..."
                className="flex-1 rounded-l-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                disabled={saving}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-r-md bg-purple-500 text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                disabled={saving}
              >
                {saving ? 'Adding...' : 'Add Goal'}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Tips: Set specific, achievable goals for your mental wellness journey.
            </p>
          </form>
        </div>
        
        {/* Active Goals List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Active Goals</h2>
          </div>
          
          {activeGoals.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {activeGoals.map(goal => (
                <li key={goal.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => handleStatusChange(goal.id, goal.completed)}
                      className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <div className="ml-3 flex-1">
                      {editingGoalId === goal.id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                            autoFocus
                          />
                          <button
                            className="ml-2 text-green-500 hover:text-green-700"
                            onClick={() => {
                              // updateGoalTitle would be needed here
                              setEditingGoalId(null);
                            }}
                          >
                            Save
                          </button>
                          <button
                            className="ml-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setEditingGoalId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                            <p className="text-xs text-gray-500">
                              Created: {formatDate(goal.createdAt)}
                            </p>
                          </div>
                          {/* Edit button - commented out since we don't have an updateGoalTitle function implemented
                          <button
                            className="mt-2 sm:mt-0 text-sm text-purple-500 hover:text-purple-700"
                            onClick={() => {
                              setEditingGoalId(goal.id);
                              setEditTitle(goal.title);
                            }}
                          >
                            Edit
                          </button>
                          */}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-12 px-4 text-center">
              <p className="text-gray-500 mb-4">You don't have any active goals yet.</p>
              <p className="text-gray-500 mb-6">
                Create your first goal to start tracking your mental wellness journey.
              </p>
            </div>
          )}
        </div>
        
        {/* Completed Goals Toggle & List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Completed Goals</h2>
            <button
              onClick={() => setShowCompletedGoals(!showCompletedGoals)}
              className="text-sm text-purple-500 hover:text-purple-700"
            >
              {showCompletedGoals ? 'Hide' : 'Show'} ({completedGoals.length})
            </button>
          </div>
          
          {showCompletedGoals && (
            completedGoals.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {completedGoals.map(goal => (
                  <li key={goal.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => handleStatusChange(goal.id, goal.completed)}
                        className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-500 line-through">{goal.title}</p>
                            <div className="flex flex-col sm:flex-row sm:space-x-4 text-xs text-gray-400">
                              <p>Created: {formatDate(goal.createdAt)}</p>
                              {goal.completedAt && <p>Completed: {formatDate(goal.completedAt)}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 px-4 text-center">
                <p className="text-gray-500">You haven't completed any goals yet.</p>
              </div>
            )
          )}
          
          {/* Tips for wellness goals */}
          <div className="px-6 py-4 bg-purple-50">
            <h3 className="text-sm font-medium text-purple-800 mb-2">Tips for Effective Mental Wellness Goals</h3>
            <ul className="text-xs text-purple-700 space-y-1 list-disc pl-5">
              <li>Make goals specific and measurable</li>
              <li>Focus on small, achievable steps</li>
              <li>Celebrate your progress, no matter how small</li>
              <li>Be kind to yourself if you face setbacks</li>
              <li>Revisit and adjust your goals regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}