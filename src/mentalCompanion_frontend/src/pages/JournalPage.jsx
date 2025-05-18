import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJournal } from '../hooks';

export default function JournalPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated, isLoading } = useAuth();
  const { 
    journalEntries, 
    isLoadingJournal, 
    error, 
    createJournalEntry, 
    updateJournalEntry, 
    deleteJournalEntry,
    getJournalEntryById
  } = useJournal();
  
  const [entryFormData, setEntryFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral'
  });
  const [formMode, setFormMode] = useState(id === 'new' ? 'create' : id ? 'edit' : 'none');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Mood options for dropdown
  const moodOptions = [
    'happy',
    'content',
    'neutral',
    'anxious',
    'sad',
    'angry',
    'excited',
    'calm',
    'tired',
    'stressed'
  ];

  // Redirect jika tidak terotentikasi
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/journal' } });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Set form data jika edit mode
  useEffect(() => {
    if (id && id !== 'new') {
      const entry = getJournalEntryById(id);
      if (entry) {
        setEntryFormData({
          title: entry.title,
          content: entry.content,
          mood: entry.mood
        });
      } else if (!isLoadingJournal) {
        // Entry not found dan sudah selesai loading
        navigate('/journal');
      }
    }
  }, [id, getJournalEntryById, isLoadingJournal, navigate]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntryFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    setSuccessMessage('');
    
    try {
      const { title, content, mood } = entryFormData;
      
      // Validasi
      if (!title.trim() || !content.trim()) {
        setFormError('Title and content are required');
        setSaving(false);
        return;
      }
      
      let success;
      if (formMode === 'create') {
        success = await createJournalEntry({ title, content, mood });
      } else if (formMode === 'edit' && id) {
        success = await updateJournalEntry(id, { title, content, mood });
      }
      
      if (success) {
        setSuccessMessage(formMode === 'create' ? 'Entry created successfully' : 'Entry updated successfully');
        
        // Reset form jika create
        if (formMode === 'create') {
          setEntryFormData({
            title: '',
            content: '',
            mood: 'neutral'
          });
        }
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        
        // Redirect to journal list if editing
        if (formMode === 'edit') {
          navigate('/journal');
        }
      }
    } catch (err) {
      console.error('Failed to save journal entry:', err);
      setFormError('Failed to save journal entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!id || id === 'new') return;
    
    setSaving(true);
    setFormError(null);
    
    try {
      const success = await deleteJournalEntry(id);
      if (success) {
        navigate('/journal');
      }
    } catch (err) {
      console.error('Failed to delete journal entry:', err);
      setFormError('Failed to delete journal entry. Please try again.');
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };
  
  // Jika loading
  if (isLoading || isLoadingJournal) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  // Render entry form
  const renderEntryForm = () => (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
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
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={entryFormData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            disabled={saving}
            placeholder="Give your entry a title"
            required
          />
        </div>
        
        <div>
          <label htmlFor="mood" className="block text-sm font-medium text-gray-700">
            Mood
          </label>
          <select
            name="mood"
            id="mood"
            value={entryFormData.mood}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            disabled={saving}
          >
            {moodOptions.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            name="content"
            id="content"
            rows={8}
            value={entryFormData.content}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            disabled={saving}
            placeholder="Write about your thoughts and feelings..."
            required
          />
        </div>
        
        <div className="flex justify-between space-x-4 pt-4">
          <div>
            {formMode === 'edit' && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                disabled={saving}
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate('/journal')}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              disabled={saving}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600"
              disabled={saving}
            >
              {saving ? 'Saving...' : formMode === 'create' ? 'Create Entry' : 'Update Entry'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
  
  // Render journal entries list
  const renderJournalList = () => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Your Journal Entries</h2>
          <Link
            to="/journal/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Entry
          </Link>
        </div>
      </div>
      
      {journalEntries.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {journalEntries.map(entry => (
            <li key={entry.id} className="hover:bg-gray-50">
              <Link to={`/journal/${entry.id}`} className="block p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{entry.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{entry.content}</p>
                    <div className="mt-2 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {entry.mood}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 text-right">
                    <p className="text-sm text-gray-500">
                      {entry.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-12 px-4 text-center">
          <p className="text-gray-500 mb-4">You haven't created any journal entries yet.</p>
          <p className="text-gray-500 mb-6">
            Journaling can be a great way to track your thoughts and feelings over time.
          </p>
          <Link
            to="/journal/new"
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Entry
          </Link>
        </div>
      )}
    </div>
  );
  
  // Delete confirmation modal
  const deleteConfirmModal = showDeleteConfirm && (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Delete Journal Entry
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this journal entry? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleDelete}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              disabled={saving}
            >
              {saving ? 'Deleting...' : 'Delete'}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {formMode === 'create' ? 'New Journal Entry' : 
             formMode === 'edit' ? 'Edit Journal Entry' : 
             'Your Journal'}
          </h1>
          {formMode === 'none' && (
            <p className="text-gray-600">
              Record your thoughts, feelings, and experiences to track your mental wellbeing over time.
            </p>
          )}
        </div>
        
                {formMode === 'none' ? renderJournalList() : renderEntryForm()}
        
        {/* Delete Confirmation Modal */}
        {deleteConfirmModal}
      </div>
    </div>
  );
}