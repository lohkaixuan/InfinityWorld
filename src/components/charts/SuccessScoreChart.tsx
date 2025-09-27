import React from 'react';

interface SuccessScoreChartProps {
  score: number;
}

const SuccessScoreChart: React.FC<SuccessScoreChartProps> = ({ score }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return { color: '#10B981', bg: 'bg-green-100', text: 'text-green-800' };
    if (score >= 60) return { color: '#F59E0B', bg: 'bg-yellow-100', text: 'text-yellow-800' };
    return { color: '#EF4444', bg: 'bg-red-100', text: 'text-red-800' };
  };

  const scoreData = getScoreColor(score);
  const getMessage = (score: number) => {
    if (score >= 85) return 'Excellent location with high potential';
    if (score >= 70) return 'Good location with moderate competition';
    if (score >= 55) return 'Average location, consider alternatives';
    return 'Challenging location, high risk';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg -m-6 mb-6">
        <h3 className="text-lg font-semibold">Overall Success Score</h3>
        <p className="text-blue-100 text-sm">Comprehensive location assessment</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 mb-6">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 144 144"
          >
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke={scoreData.color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 1.5s ease-in-out',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">{score}</div>
              <div className="text-sm text-gray-600">out of 100</div>
            </div>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full ${scoreData.bg} ${scoreData.text} text-center max-w-sm`}>
          <div className="text-sm font-medium">{getMessage(score)}</div>
        </div>
      </div>
    </div>
  );
};

export default SuccessScoreChart;