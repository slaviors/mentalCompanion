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

// Custom hook untuk journal entries
export const useJournal = () => {
  const { actor, isAuthenticated, isLoading } = useAuth();
  const [journalEntries, setJournalEntries] = useState([]);
  const [isLoadingJournal, setIsLoadingJournal] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentEntry, setCurrentEntry] = useState(null);

  // Ambil journal entries
  const fetchJournalEntries = useCallback(async () => {
    if (!actor || !isAuthenticated) return;
    
    setIsLoadingJournal(true);
    setError(null);
    
    try {
      const result = await actor.getJournalEntries();
      
      if ('ok' in result) {
        // Transform data untuk frontend
        const formattedEntries = result.ok.map(entry => ({
          ...entry,
          createdAt: formatDate(entry.createdAt),
          // Memastikan field lain ada
          title: entry.title || 'Untitled Entry',
          content: entry.content || '',
          mood: entry.mood || 'neutral'
        })).sort((a, b) => b.createdAt - a.createdAt); // Sort dari yang terbaru
        
        setJournalEntries(formattedEntries);
      } else {
        setError(result.err);
      }
    } catch (err) {
      console.error('Error fetching journal entries:', err);
      setError('Failed to load journal entries. Please try again.');
    } finally {
      setIsLoadingJournal(false);
      setLastUpdated(new Date());
    }
  }, [actor, isAuthenticated]);

  // Load journal entries saat hook digunakan dan actor tersedia
  useEffect(() => {
    if (actor && isAuthenticated && !isLoading) {
      fetchJournalEntries();
    }
  }, [actor, isAuthenticated, isLoading, fetchJournalEntries]);

  // Fungsi untuk membuat journal entry baru
  const createJournalEntry = async (entryData) => {
    if (!actor || !isAuthenticated) {
      setError('You must be logged in to create journal entries');
      return false;
    }
    
    setIsLoadingJournal(true);
    setError(null);
    
    try {
      const { title, content, mood } = entryData;
      
      // Validasi input dasar
      if (!title.trim() || !content.trim() || !mood.trim()) {
        setError('Title, content, and mood are required');
        setIsLoadingJournal(false);
        return false;
      }
      
      const result = await actor.createJournalEntry(
        title.trim(),
        content.trim(),
        mood.trim()
      );
      
      if ('ok' in result) {
        // Entry berhasil dibuat, refresh data
        await fetchJournalEntries();
        return true;
      } else {
        setError(result.err);
        return false;
      }
    } catch (err) {
      console.error('Error creating journal entry:', err);
      setError('Failed to save journal entry. Please try again.');
      return false;
    } finally {
      setIsLoadingJournal(false);
    }
  };

  // Fungsi untuk memperbarui journal entry
  const updateJournalEntry = async (entryId, entryData) => {
    if (!actor || !isAuthenticated) {
      setError('You must be logged in to update journal entries');
      return false;
    }
    
    setIsLoadingJournal(true);
    setError(null);
    
    try {
      const { title, content, mood } = entryData;
      
      // Validasi input dasar
      if (!title.trim() || !content.trim() || !mood.trim()) {
        setError('Title, content, and mood are required');
        setIsLoadingJournal(false);
        return false;
      }
      
      const result = await actor.updateJournalEntry(
        Number(entryId),
        title.trim(),
        content.trim(),
        mood.trim()
      );
      
      if ('ok' in result) {
        // Entry berhasil diupdate, refresh data
        await fetchJournalEntries();
        return true;
      } else {
        setError(result.err);
        return false;
      }
    } catch (err) {
      console.error('Error updating journal entry:', err);
      setError('Failed to update journal entry. Please try again.');
      return false;
    } finally {
      setIsLoadingJournal(false);
    }
  };

  // Fungsi untuk menghapus journal entry
  const deleteJournalEntry = async (entryId) => {
    if (!actor || !isAuthenticated) {
      setError('You must be logged in to delete journal entries');
      return false;
    }
    
    setIsLoadingJournal(true);
    setError(null);
    
    try {
      const result = await actor.deleteJournalEntry(Number(entryId));
      
      if ('ok' in result) {
        // Entry berhasil dihapus, refresh data
        await fetchJournalEntries();
        return true;
      } else {
        setError(result.err);
        return false;
      }
    } catch (err) {
      console.error('Error deleting journal entry:', err);
      setError('Failed to delete journal entry. Please try again.');
      return false;
    } finally {
      setIsLoadingJournal(false);
    }
  };

  // Fungsi untuk mendapatkan entry by ID
  const getJournalEntryById = (entryId) => {
    const entry = journalEntries.find(entry => entry.id.toString() === entryId.toString());
    return entry || null;
  };

  // Fungsi untuk set entry saat ini (untuk edit/view detail)
  const setActiveEntry = (entryId) => {
    const entry = getJournalEntryById(entryId);
    setCurrentEntry(entry);
    return entry;
  };

  // Fungsi untuk mendapatkan mood stats dari journal
  const getJournalMoodStats = () => {
    if (journalEntries.length === 0) {
      return {
        moodCounts: {},
        totalEntries: 0,
        mostCommonMood: 'No entries'
      };
    }
    
    // Hitung jumlah untuk setiap mood
    const moodCounts = journalEntries.reduce((counts, entry) => {
      const mood = entry.mood || 'unspecified';
      counts[mood] = (counts[mood] || 0) + 1;
      return counts;
    }, {});
    
    // Temukan mood yang paling sering
    let mostCommonMood = '';
    let highestCount = 0;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > highestCount) {
        mostCommonMood = mood;
        highestCount = count;
      }
    });
    
    return {
      moodCounts,
      totalEntries: journalEntries.length,
      mostCommonMood
    };
  };

  return {
    journalEntries,
    isLoadingJournal,
    error,
    lastUpdated,
    currentEntry,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    fetchJournalEntries,
    getJournalEntryById,
    setActiveEntry,
    getJournalMoodStats
  };
};

export default useJournal;