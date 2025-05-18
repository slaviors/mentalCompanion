import React from 'react';

// Komponen untuk menampilkan wellness score dengan visualisasi yang menarik
const WellnessScoreCard = ({ 
  score = 0, 
  label = 'Wellness Score', 
  previousScore = null,
  showDelta = true,
  size = 'medium', // 'small', 'medium', 'large'
  theme = 'teal', // 'teal', 'purple', 'gradient'
  className = ''
}) => {
  // Memastikan score dalam range 0-100
  const normalizedScore = Math.min(100, Math.max(0, score));
  
  // Menghitung delta dan persentase perubahan
  const scoreDelta = previousScore !== null ? normalizedScore - previousScore : null;
  const deltaPercentage = previousScore !== null && previousScore > 0 
    ? ((normalizedScore - previousScore) / previousScore * 100).toFixed(1) 
    : null;
  
  // Menentukan warna berdasarkan score
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-teal-500';
    if (score >= 40) return 'text-yellow-500';
    if (score >= 20) return 'text-orange-500';
    return 'text-red-500';
  };
  
  // Menentukan warna untuk delta
  const getDeltaColor = (delta) => {
    if (delta > 0) return 'text-green-500';
    if (delta < 0) return 'text-red-500';
    return 'text-gray-500';
  };
  
  // Menentukan ukuran berdasarkan prop
  const sizeClasses = {
    small: {
      container: 'p-3',
      title: 'text-sm mb-1',
      score: 'text-3xl',
      chart: 'w-16 h-16',
      chartText: 'text-lg',
      delta: 'text-xs mt-1'
    },
    medium: {
      container: 'p-4',
      title: 'text-base mb-2',
      score: 'text-4xl',
      chart: 'w-24 h-24',
      chartText: 'text-xl',
      delta: 'text-sm mt-2'
    },
    large: {
      container: 'p-5',
      title: 'text-lg mb-3',
      score: 'text-5xl',
      chart: 'w-32 h-32',
      chartText: 'text-2xl',
      delta: 'text-base mt-3'
    }
  };
  
  // Menentukan tema berdasarkan prop
  const themeClasses = {
    teal: 'bg-white border border-gray-200',
    purple: 'bg-white border border-gray-200',
    gradient: 'bg-gradient-to-br from-teal-50 to-purple-50 border border-gray-200'
  };
  
  // Menentukan warna progress berdasarkan tema
  const progressColor = {
    teal: `hsl(${normalizedScore}, 70%, 45%)`,
    purple: 'rgba(139, 92, 246, 0.8)', // purple-500 with opacity
    gradient: `url(#scoreGradient-${normalizedScore})`
  };
  
  const currentSize = sizeClasses[size] || sizeClasses.medium;
  const currentTheme = themeClasses[theme] || themeClasses.teal;

  return (
    <div className={`rounded-lg shadow-sm ${currentTheme} ${currentSize.container} ${className}`}>
      <h3 className={`${currentSize.title} font-medium text-gray-700`}>{label}</h3>
      
      <div className="flex flex-col items-center justify-center">
        {/* Circular progress */}
        <div className={`relative ${currentSize.chart}`}>
          <svg className="w-full h-full" viewBox="0 0 36 36">
            {/* Gradient definition for gradient theme */}
            {theme === 'gradient' && (
              <defs>
                <linearGradient id={`scoreGradient-${normalizedScore}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(20, 184, 166, 0.8)" /> {/* teal-500 */}
                  <stop offset="100%" stopColor="rgba(139, 92, 246, 0.8)" /> {/* purple-500 */}
                </linearGradient>
              </defs>
            )}
            
            {/* Background circle */}
            <circle
              cx="18"
              cy="18"
              r="15.9155"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Progress circle */}
            <circle
              cx="18"
              cy="18"
              r="15.9155"
              fill="none"
              stroke={progressColor[theme]}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${normalizedScore}, 100`}
              transform="rotate(-90 18 18)"
            />
            
            {/* Score text */}
            <text
              x="18"
              y="18"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize={currentSize.chartText.replace('text-', '')}
              fontWeight="bold"
              className={getScoreColor(normalizedScore)}
            >
              {normalizedScore}
            </text>
            
            {/* Label */}
            <text
              x="18"
              y="23"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="3"
              fill="#6B7280"
            >
              /100
            </text>
          </svg>
        </div>
        
        {/* Delta indicator */}
        {showDelta && scoreDelta !== null && (
          <div className={`${currentSize.delta} flex items-center justify-center`}>
            <span className={`font-medium ${getDeltaColor(scoreDelta)}`}>
              {scoreDelta > 0 ? '↑' : scoreDelta < 0 ? '↓' : '–'}
              {' '}
              {Math.abs(scoreDelta)} pts
              {deltaPercentage && ` (${scoreDelta > 0 ? '+' : ''}${deltaPercentage}%)`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessScoreCard;