import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface CompetitorChartProps {
  data: { name: string; size: number; rating: number; distance: number }[];
}

const CompetitorChart: React.FC<CompetitorChartProps> = ({ data }) => {
  const chartData = {
    datasets: [
      {
        label: 'Competitors',
        data: data.map(item => ({
          x: item.size,
          y: item.rating,
          name: item.name,
          distance: item.distance,
        })),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: '#3B82F6',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 12,
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
        callbacks: {
          title: () => '',
          label: (context: any) => {
            const point = context.raw;
            return [
              `Business: ${point.name}`,
              `Size: ${point.x} seats`,
              `Rating: ${point.y} stars`,
              `Distance: ${point.distance}km`,
            ];
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3B82F6',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Business Size (seats)',
          color: '#374151',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Average Rating',
          color: '#374151',
        },
        min: 3.5,
        max: 5,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg -m-6 mb-6">
        <h3 className="text-lg font-semibold">Competitor Analysis</h3>
        <p className="text-blue-100 text-sm">Size vs Rating comparison</p>
      </div>
      <div className="h-80">
        <Scatter data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CompetitorChart;