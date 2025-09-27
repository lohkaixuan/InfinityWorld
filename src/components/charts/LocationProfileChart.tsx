import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface LocationProfileChartProps {
  data: {
    age: number;
    income: number;
    familySize: number;
    daytimePop: number;
    accessibility: number;
  };
}

const LocationProfileChart: React.FC<LocationProfileChartProps> = ({ data }) => {
  const chartData = {
    labels: ['Age Score', 'Income Level', 'Family Size', 'Daytime Pop.', 'Accessibility'],
    datasets: [
      {
        label: 'Location Profile',
        data: [data.age, data.income, data.familySize, data.daytimePop, data.accessibility],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3B82F6',
        borderWidth: 3,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          color: '#374151',
          font: {
            size: 12,
          },
        },
        ticks: {
          color: '#6B7280',
          backdropColor: 'transparent',
        },
      },
    },
  };

  const metrics = [
    { label: 'Competition', score: 75, color: 'bg-orange-500' },
    { label: 'Demand', score: 88, color: 'bg-green-500' },
    { label: 'Accessibility', score: 95, color: 'bg-blue-500' },
    { label: 'Demographics', score: 82, color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg -m-6 mb-6">
        <h3 className="text-lg font-semibold">Location Profile</h3>
        <p className="text-blue-100 text-sm">Key location characteristics</p>
      </div>
      <div className="h-80 mb-6">
        <Radar data={chartData} options={options} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold text-gray-800">{metric.score}</div>
            <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${metric.color} transition-all duration-1000`}
                style={{ width: `${metric.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationProfileChart;