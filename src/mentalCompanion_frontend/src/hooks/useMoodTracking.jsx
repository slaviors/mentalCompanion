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

// Custom hook untuk mood tracking
export const useMoodTracking = () => {
  const { actor, isAuthenticated, isLoading } = useAuth();
  const [moodRecords, setMoodRecords] = useState([]);
  const [isLoadingMoods, setIsLoadingMoods] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Ambil mood records
  const fetchMoodRecords = useCallback(async () => {
    if (!actor || !isAuthenticated) return;
    
    setIsLoadingMoods(true);
    setError(null);
    
    try {
      const result = await actor.getMoodRecords();
      
      if ('ok' in result) {
        // Transform data untuk frontend
        const formattedRecords = result.ok.map(record => ({
          ...record,
          date: formatDate(record.date),
          // Pastikan nilai mood dalam range 0-10
          happiness: Math.min(10, Math.max(0, Number(record.happiness))),
          anxiety: Math.min(10, Math.max(0, Number(record.anxiety))),
          energy: Math.min(10, Math.max(0, Number(record.energy))),
          focus: Math.min(10, Math.max(0, Number(record.focus))),
          notes: record.notes?.[0] || ''
        })).sort((a, b) => b.date - a.date); // Sort dari yang terbaru
        
        setMoodRecords(formattedRecords);
      } else {
        setError(result.err);
      }
    } catch (err) {
      console.error('Error fetching mood records:', err);
      setError('Failed to load mood records. Please try again.');
    } finally {
      setIsLoadingMoods(false);
      setLastUpdated(new Date());
    }
  }, [actor, isAuthenticated]);

  // Load mood records saat hook digunakan dan actor tersedia
  useEffect(() => {
    if (actor && isAuthenticated && !isLoading) {
      fetchMoodRecords();
    }
  }, [actor, isAuthenticated, isLoading, fetchMoodRecords]);

  // Fungsi untuk menyimpan mood record baru
  const recordMood = async (moodData) => {
    if (!actor || !isAuthenticated) {
      setError('You must be logged in to record mood');
      return false;
    }
    
    setIsLoadingMoods(true);
    setError(null);
    
    try {
      const { happiness, anxiety, energy, focus, notes } = moodData;
      
      // Validasi input
      if (happiness < 0 || happiness > 10 || 
          anxiety < 0 || anxiety > 10 || 
          energy < 0 || energy > 10 || 
          focus < 0 || focus > 10) {
        setError('Mood values must be between 0 and 10');
        setIsLoadingMoods(false);
        return false;
      }
      
      // Konversi nilai ke format yang diharapkan backend
      const result = await actor.recordMood(
        Number(happiness),
        Number(anxiety),
        Number(energy),
        Number(focus),
        notes ? [notes] : [] // Convert ke optional value
      );
      
      if ('ok' in result) {
        // Record berhasil, refresh data
        await fetchMoodRecords();
        return true;
      } else {
        setError(result.err);
        return false;
      }
    } catch (err) {
      console.error('Error recording mood:', err);
      setError('Failed to save mood. Please try again.');
      return false;
    } finally {
      setIsLoadingMoods(false);
    }
  };

  // Fungsi untuk mendapatkan mood trends
  const getMoodTrends = (days = 7) => {
    // Filter untuk mendapatkan data mood dalam X hari terakhir
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentMoods = moodRecords.filter(record => 
      record.date >= cutoffDate
    );
    
    // Format data untuk chart/visualisasi
    const trendData = recentMoods.map(record => ({
      date: record.date,
      happiness: record.happiness,
      anxiety: record.anxiety,
      energy: record.energy,
      focus: record.focus
    })).sort((a, b) => a.date - b.date); // Sort dari yang terlama
    
    return trendData;
  };

  // Fungsi untuk mendapatkan mood saat ini/terbaru
  const getCurrentMood = () => {
    if (moodRecords.length === 0) return null;
    
    // Ambil mood entry terbaru
    const latestMood = moodRecords[0]; // Sudah diurutkan di fetchMoodRecords
    
    return latestMood;
  };

  // Fungsi untuk mendapatkan rangkuman statistik mood
  const getMoodStats = () => {
    if (moodRecords.length === 0) {
      return {
        averageHappiness: 0,
        averageAnxiety: 0,
        averageEnergy: 0,
        averageFocus: 0,
        totalEntries: 0
      };
    }
    
    // Hitung rata-rata untuk setiap mood parameter
    const sum = moodRecords.reduce((acc, record) => ({
      happiness: acc.happiness + record.happiness,
      anxiety: acc.anxiety + record.anxiety, 
      energy: acc.energy + record.energy,
      focus: acc.focus + record.focus
    }), { happiness: 0, anxiety: 0, energy: 0, focus: 0 });
    
    const totalEntries = moodRecords.length;
    
    return {
      averageHappiness: (sum.happiness / totalEntries).toFixed(1),
      averageAnxiety: (sum.anxiety / totalEntries).toFixed(1),
      averageEnergy: (sum.energy / totalEntries).toFixed(1),
      averageFocus: (sum.focus / totalEntries).toFixed(1),
      totalEntries
    };
  };

  // Fungsi untuk menghitung wellness score berdasarkan mood records
  const calculateWellnessScore = () => {
    if (moodRecords.length === 0) return 0;
    
    // Ambil 7 mood record terbaru atau semua jika kurang dari 7
    const recentMoods = moodRecords.slice(0, Math.min(7, moodRecords.length));
    
    // Rumus sederhana untuk wellness score:
    // (Rata-rata happiness + Rata-rata energy + Rata-rata focus + (10 - Rata-rata anxiety)) / 4 * 10
    const avgHappiness = recentMoods.reduce((sum, record) => sum + record.happiness, 0) / recentMoods.length;
    const avgAnxiety = recentMoods.reduce((sum, record) => sum + record.anxiety, 0) / recentMoods.length;
    const avgEnergy = recentMoods.reduce((sum, record) => sum + record.energy, 0) / recentMoods.length;
    const avgFocus = recentMoods.reduce((sum, record) => sum + record.focus, 0) / recentMoods.length;
    
    // Hitung wellness score (0-100)
    const score = ((avgHappiness + avgEnergy + avgFocus + (10 - avgAnxiety)) / 4) * 10;
    
    // Pastikan hasil antara 0-100 dan dibulatkan
    return Math.round(Math.min(100, Math.max(0, score)));
  };

  return {
    moodRecords,
    isLoadingMoods,
    error,
    lastUpdated,
    recordMood,
    fetchMoodRecords,
    getMoodTrends,
    getCurrentMood,
    getMoodStats,
    calculateWellnessScore
  };
};

export default useMoodTracking;