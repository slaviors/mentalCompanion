import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

// Helper untuk memformat timestamp
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    // Jika timestamp adalah BigInt, konversi ke number
    let timestampMs;
    if (typeof timestamp === 'bigint') {
      timestampMs = Number(timestamp.toString()) / 1_000_000;
    } else {
      timestampMs = Number(timestamp) / 1_000_000;
    }
    
    return new Date(timestampMs);
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return new Date();
  }
};

// Custom hook untuk goals management
export const useGoals = () => {
  const { actor, isAuthenticated, isLoading } = useAuth();
  const [goals, setGoals] = useState([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Ambil semua goals
  const fetchGoals = useCallback(async () => {
    if (!actor || !isAuthenticated) return;
    
    setIsLoadingGoals(true);
    setError(null);
    
    try {
      const result = await actor.getGoals();
      
      if ('ok' in result) {
        // Transform data untuk frontend
        const formattedGoals = result.ok.map(goal => ({
          ...goal,
          createdAt: formatDate(goal.createdAt),
          completedAt: goal.completedAt?.[0] ? formatDate(goal.completedAt[0]) : null,
          // Memastikan field lain ada
          title: goal.title || 'Untitled Goal',
          completed: Boolean(goal.completed)
        })).sort((a, b) => {
          // Urutkan berdasarkan: belum selesai dulu, lalu dari yang terbaru
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          return b.createdAt - a.createdAt;
        });
        
        setGoals(formattedGoals);
      } else {
        setError(result.err);
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to load goals. Please try again.');
    } finally {
      setIsLoadingGoals(false);
      setLastUpdated(new Date());
    }
  }, [actor, isAuthenticated]);

  // Load goals saat hook digunakan dan actor tersedia
  useEffect(() => {
    if (actor && isAuthenticated && !isLoading) {
      fetchGoals();
    }
  }, [actor, isAuthenticated, isLoading, fetchGoals]);

  // Fungsi untuk membuat goal baru
  const createGoal = async (title) => {
    if (!actor || !isAuthenticated) {
      setError('You must be logged in to create goals');
      return false;
    }
    
    setIsLoadingGoals(true);
    setError(null);
    
    try {
      // Validasi input dasar
      if (!title.trim()) {
        setError('Goal title is required');
        setIsLoadingGoals(false);
        return false;
      }
      
      const result = await actor.createGoal(title.trim());
      
      if ('ok' in result) {
        // Goal berhasil dibuat, refresh data
        await fetchGoals();
        return true;
      } else {
        setError(result.err);
        return false;
      }
    } catch (err) {
      console.error('Error creating goal:', err);
      setError('Failed to save goal. Please try again.');
      return false;
    } finally {
      setIsLoadingGoals(false);
    }
  };

  // Fungsi untuk update status goal (complete/incomplete)
  const updateGoalStatus = async (goalId, completed) => {
    if (!actor || !isAuthenticated) {
      setError('You must be logged in to update goals');
      return false;
    }
    
    setIsLoadingGoals(true);
    setError(null);
    
    try {
      const result = await actor.updateGoalStatus(
        Number(goalId),
        Boolean(completed)
      );
      
      if ('ok' in result) {
        // Goal berhasil diupdate, refresh data
        await fetchGoals();
        return true;
      } else {
        setError(result.err);
        return false;
      }
    } catch (err) {
      console.error('Error updating goal status:', err);
      setError('Failed to update goal. Please try again.');
      return false;
    } finally {
      setIsLoadingGoals(false);
    }
  };

  // Fungsi untuk mendapatkan rangkuman goals
  const getGoalsSummary = () => {
    const total = goals.length;
    const completed = goals.filter(goal => goal.completed).length;
    const uncompleted = total - completed;
    
    // Hitung completion rate (persentase)
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Ambil goals yang diselesaikan minggu ini
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const completedThisWeek = goals.filter(goal => 
      goal.completed && 
      goal.completedAt && 
      goal.completedAt > oneWeekAgo
    ).length;
    
    return {
      total,
      completed,
      uncompleted,
      completionRate,
      completedThisWeek
    };
  };

  // Fungsi untuk mendapatkan active (uncompleted) goals
  const getActiveGoals = () => {
    return goals.filter(goal => !goal.completed);
  };

  // Fungsi untuk mendapatkan completed goals
  const getCompletedGoals = () => {
    return goals.filter(goal => goal.completed)
      .sort((a, b) => b.completedAt - a.completedAt); // Sort berdasarkan completedAt
  };

  return {
    goals,
    isLoadingGoals,
    error,
    lastUpdated,
    fetchGoals,
    createGoal,
    updateGoalStatus,
    getGoalsSummary,
    getActiveGoals,
    getCompletedGoals
  };
};

export default useGoals;