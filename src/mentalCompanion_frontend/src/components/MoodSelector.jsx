import React from 'react';

// Komponen untuk memilih mood dengan visual yang menarik
const MoodSelector = ({ 
  value = 'neutral', 
  onChange, 
  disabled = false,
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  // Pilihan mood dengan emoji dan warna
  const moodOptions = [
    { value: 'happy', emoji: '😊', label: 'Happy', color: 'bg-green-100 border-green-300 text-green-800' },
    { value: 'excited', emoji: '😄', label: 'Excited', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
    { value: 'content', emoji: '😌', label: 'Content', color: 'bg-blue-100 border-blue-300 text-blue-800' },
    { value: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-gray-100 border-gray-300 text-gray-800' },
    { value: 'tired', emoji: '😴', label: 'Tired', color: 'bg-indigo-100 border-indigo-300 text-indigo-800' },
    { value: 'stressed', emoji: '😓', label: 'Stressed', color: 'bg-orange-100 border-orange-300 text-orange-800' },
    { value: 'anxious', emoji: '😟', label: 'Anxious', color: 'bg-amber-100 border-amber-300 text-amber-800' },
    { value: 'sad', emoji: '😢', label: 'Sad', color: 'bg-purple-100 border-purple-300 text-purple-800' },
    { value: 'angry', emoji: '😠', label: 'Angry', color: 'bg-red-100 border-red-300 text-red-800' }
  ];

  // Menentukan ukuran berdasarkan prop
  const sizeClasses = {
    small: {
      container: 'max-w-md',
      button: 'p-2 text-sm',
      emoji: 'text-lg mb-1',
      label: 'text-xs'
    },
    medium: {
      container: 'max-w-lg',
      button: 'p-3',
      emoji: 'text-2xl mb-1',
      label: 'text-sm'
    },
    large: {
      container: 'max-w-xl',
      button: 'p-4',
      emoji: 'text-3xl mb-2',
      label: 'text-base'
    }
  };
  
  const currentSize = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className={`${currentSize.container} mx-auto`}>
      <div className="flex flex-wrap justify-center gap-2">
        {moodOptions.map(mood => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange && onChange(mood.value)}
            disabled={disabled}
            className={`
              flex flex-col items-center justify-center 
              ${currentSize.button} rounded-lg border-2
              transition-all duration-200
              ${value === mood.value ? 
                `${mood.color} border-opacity-100 shadow-md` : 
                'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-label={`Select mood: ${mood.label}`}
          >
            <span className={`${currentSize.emoji} leading-none`} role="img" aria-label={mood.label}>
              {mood.emoji}
            </span>
            <span className={`${currentSize.label}`}>{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;