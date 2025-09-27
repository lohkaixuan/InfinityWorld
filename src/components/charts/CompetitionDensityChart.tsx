import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CompetitionDensityChartProps {
  data: { radius: string; category: string; density: number }[];
}

const CompetitionDensityChart: React.FC<CompetitionDensityChartProps> = ({ data }) => {
  const [selectedBar, setSelectedBar] = useState<string | null>(null);

  const restaurantData = data.filter(d => d.category === 'Restaurants');
  const cafeData = data.filter(d => d.category === 'Cafes');

  const chartData = {
    labels: ['1km', '3km', '5km'],
    datasets: [
      {
        label: 'Restaurants',
        data: restaurantData.map(d => d.density),
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Cafes',
        data: cafeData.map(d => d.density),
        backgroundColor: '#14B8A6',
        borderColor: '#14B8A6',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          color: '#374151',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.y} businesses`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Radius',
          color: '#374151',
        },
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Competitors',
          color: '#374151',
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
      },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const element = elements[0];
        const radius = chartData.labels[element.index];
        const category = chartData.datasets[element.datasetIndex].label;
        setSelectedBar(`${category} - ${radius}`);
      }
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg -m-6 mb-6">
        <h3 className="text-lg font-semibold">Competition Density</h3>
        <p className="text-blue-100 text-sm">Competitor distribution by radius</p>
      </div>
      <div className="h-80 mb-4">
        <Bar data={chartData} options={options} />
      </div>
      {selectedBar && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800">
            <strong>Selected:</strong> {selectedBar}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Click on bars to see detailed breakdown
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionDensityChart;