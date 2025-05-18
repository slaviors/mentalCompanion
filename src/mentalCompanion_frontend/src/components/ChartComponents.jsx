import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Common chart options for consistent styling
const getCommonOptions = (title = '', yAxisLabel = '') => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 15,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      titleColor: '#333',
      bodyColor: '#666',
      borderColor: '#ddd',
      borderWidth: 1,
      padding: 10,
      displayColors: true,
      boxWidth: 10,
      boxHeight: 10,
      usePointStyle: true,
    },
    title: {
      display: !!title,
      text: title,
      font: {
        size: 16,
        weight: 'normal'
      },
      padding: {
        top: 10,
        bottom: 15
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: !!yAxisLabel,
        text: yAxisLabel,
        font: {
          size: 12,
          weight: 'normal'
        }
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        borderDash: [3, 3]
      },
      ticks: {
        font: {
          size: 11
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        }
      }
    }
  }
});

// Line Chart Component
export const MoodLineChart = ({ 
  data, 
  title = 'Mood Trends', 
  yAxisLabel = 'Level (0-10)',
  height = 300,
  showLegend = true
}) => {
  const options = {
    ...getCommonOptions(title, yAxisLabel),
    elements: {
      line: {
        tension: 0.3 // Add curve to lines
      },
      point: {
        radius: 3,
        hitRadius: 10,
        hoverRadius: 5
      }
    },
    plugins: {
      ...getCommonOptions().plugins,
      legend: {
        ...getCommonOptions().plugins.legend,
        display: showLegend
      }
    }
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={data} options={options} />
    </div>
  );
};

// Bar Chart Component
export const MoodBarChart = ({ 
  data, 
  title = 'Mood Analysis', 
  yAxisLabel = 'Level (0-10)',
  height = 300,
  showLegend = true
}) => {
  const options = {
    ...getCommonOptions(title, yAxisLabel),
    plugins: {
      ...getCommonOptions().plugins,
      legend: {
        ...getCommonOptions().plugins.legend,
        display: showLegend
      }
    },
    barPercentage: 0.8,
    categoryPercentage: 0.8
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bar data={data} options={options} />
    </div>
  );
};

// Doughnut Chart Component
export const MoodDistributionChart = ({ 
  data, 
  title = 'Mood Distribution', 
  height = 300,
  showLegend = true
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        display: showLegend,
        labels: {
          usePointStyle: true,
          padding: 15,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.formattedValue;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = Math.round((context.raw / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'normal'
        },
        padding: {
          top: 10,
          bottom: 15
        }
      }
    }
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

// Sample Usage Components

// Sample Line Chart with preset data for demonstration
export const SampleMoodLineChart = ({ height = 300 }) => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Happiness',
        data: [7, 6, 8, 5, 7, 8, 9],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true
      },
      {
        label: 'Anxiety',
        data: [4, 5, 3, 6, 4, 2, 1],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true
      }
    ]
  };

  return <MoodLineChart data={data} height={height} />;
};

// Sample Bar Chart with preset data for demonstration
export const SampleMoodBarChart = ({ height = 300 }) => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Energy',
        data: [6, 5, 7, 4, 8, 9, 7],
        backgroundColor: 'rgba(255, 206, 86, 0.8)',
      },
      {
        label: 'Focus',
        data: [7, 6, 8, 5, 7, 8, 9],
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
      }
    ]
  };

  return <MoodBarChart data={data} height={height} />;
};

// Sample Doughnut Chart with preset data for demonstration
export const SampleMoodDistributionChart = ({ height = 300 }) => {
  const data = {
    labels: ['Happy', 'Content', 'Neutral', 'Anxious', 'Sad'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ],
        borderWidth: 1,
        borderColor: '#fff'
      }
    ]
  };

  return <MoodDistributionChart data={data} height={height} />;
};

// Export all chart components together
export default {
  MoodLineChart,
  MoodBarChart,
  MoodDistributionChart,
  SampleMoodLineChart,
  SampleMoodBarChart,
  SampleMoodDistributionChart
};