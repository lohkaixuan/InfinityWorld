import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DemographicChartProps {
  data: { office: number; residents: number };
}

const DemographicChart: React.FC<DemographicChartProps> = ({ data }) => {
  const chartData = {
    labels: ['Office Workers', 'Residents'],
    datasets: [
      {
        data: [data.office, data.residents],
        backgroundColor: ['#3B82F6', '#14B8A6'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 3,
        hoverBackgroundColor: ['#2563EB', '#0D9488'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          color: '#374151',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.parsed}%`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
      },
    },
    cutout: '60%',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg -m-6 mb-6">
        <h3 className="text-lg font-semibold">Demographic Mix</h3>
        <p className="text-blue-100 text-sm">Local population breakdown</p>
      </div>
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DemographicChart;