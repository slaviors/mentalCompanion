import React, { useState } from 'react';

// Komponen untuk menampilkan dan mengelola goals
const GoalTracker = ({ 
  goals = [], 
  onToggleComplete, 
  onAddGoal,
  onDeleteGoal, // optional
  title = 'Wellness Goals',
  showAddForm = true,
  showCompleted = true,
  maxDisplay = Infinity,
  className = ''
}) => {
  const [newGoalText, setNewGoalText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showCompletedItems, setShowCompletedItems] = useState(false);
  
  // Filter goals
  const activeGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);
  
  // Limit displayed goals based on maxDisplay
  const displayedActiveGoals = activeGoals.slice(0, maxDisplay);
  const displayedCompletedGoals = completedGoals.slice(0, maxDisplay);
  
  // Compute completion percentage
  const totalGoals = goals.length;
  const completionPercentage = totalGoals > 0 
    ? Math.round((completedGoals.length / totalGoals) * 100) 
    : 0;
  
  // Handle submission of new goal
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newGoalText.trim()) {
      setError('Please enter a goal');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      if (onAddGoal) {
        await onAddGoal(newGoalText.trim());
        setNewGoalText('');
      }
    } catch (err) {
      setError('Failed to add goal');
      console.error('Error adding goal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          {showCompleted && completedGoals.length > 0 && (
            <button
              type="button"
              onClick={() => setShowCompletedItems(!showCompletedItems)}
              className="text-sm font-medium text-purple-600 hover:text-purple-800"
            >
              {showCompletedItems ? 'Hide Completed' : `Show Completed (${completedGoals.length})`}
            </button>
          )}
        </div>
        
        {goals.length > 0 && (
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>{`${completedGoals.length} of ${totalGoals} completed`}</span>
              <span>{`${completionPercentage}%`}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Active Goals List */}
      <ul className="divide-y divide-gray-200">
        {displayedActiveGoals.map((goal) => (
          <li key={goal.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => onToggleComplete && onToggleComplete(goal.id, !goal.completed)}
                  className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                <p className="text-xs text-gray-500">Created {formatDate(goal.createdAt)}</p>
              </div>
              {onDeleteGoal && (
                <button
                  onClick={() => onDeleteGoal(goal.id)}
                  className="ml-2 text-gray-400 hover:text-red-500"
                  aria-label="Delete goal"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </li>
        ))}
        
        {/* Show message if no active goals */}
        {activeGoals.length === 0 && (
          <li className="py-6 px-4 text-center">
            <p className="text-sm text-gray-500">No active goals</p>
            {!showAddForm && (
              <p className="text-xs text-gray-400 mt-1">
                Add goals to track your mental wellness journey
              </p>
            )}
          </li>
        )}
        
        {/* Show "more" indicator if not all goals are displayed */}
        {activeGoals.length > maxDisplay && (
          <li className="p-3 text-center border-t">
            <span className="text-xs text-purple-500">
              +{activeGoals.length - maxDisplay} more active goals
            </span>
          </li>
        )}
      </ul>
      
      {/* Completed Goals (collapsible) */}
      {showCompleted && showCompletedItems && completedGoals.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50">
          <ul className="divide-y divide-gray-200">
            {displayedCompletedGoals.map((goal) => (
              <li key={goal.id} className="p-4 hover:bg-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => onToggleComplete && onToggleComplete(goal.id, !goal.completed)}
                      className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-500 line-through">{goal.title}</p>
                    <div className="flex space-x-3">
                      <p className="text-xs text-gray-400">Created {formatDate(goal.createdAt)}</p>
                      {goal.completedAt && (
                        <p className="text-xs text-gray-400">Completed {formatDate(goal.completedAt)}</p>
                      )}
                    </div>
                  </div>
                  {onDeleteGoal && (
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                      aria-label="Delete goal"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </li>
            ))}
            
            {/* Show "more" indicator if not all completed goals are displayed */}
            {completedGoals.length > maxDisplay && (
              <li className="p-3 text-center border-t">
                <span className="text-xs text-purple-500">
                  +{completedGoals.length - maxDisplay} more completed goals
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
      
      {/* Add Goal Form */}
      {showAddForm && (
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSubmit}>
            {error && (
              <p className="text-xs text-red-500 mb-2">{error}</p>
            )}
            <div className="flex">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="Add a new goal..."
                className="flex-1 rounded-l-md border-r-0 border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-sm"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-700 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span>Add</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;