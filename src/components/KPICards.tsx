import React from 'react';
import { Star, TrendingUp, DollarSign, Users, Target } from 'lucide-react';

interface KPICardsProps {
  kpis: {
    avgRating: number;
    monthlyDemand: number;
    rentSensitivity: number;
    competitorCount: number;
    revenuePotential: number;
  };
}

const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const cards = [
    {
      title: 'Revenue Potential',
      value: (kpis.revenuePotential / 1000).toFixed(0),
      unit: 'K RM',
      icon: Target,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Competitor Count',
      value: kpis.competitorCount.toString(),
      unit: '',
      icon: Users,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
    },
    {
      title: 'Avg Rating',
      value: kpis.avgRating.toFixed(1),
      unit: '⭐',
      icon: Star,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'Est. Monthly Demand',
      value: (kpis.monthlyDemand / 1000).toFixed(1),
      unit: 'K visits',
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
    {
      title: 'Rent Sensitivity',
      value: kpis.rentSensitivity.toString(),
      unit: '/100',
      icon: DollarSign,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },


  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} ${card.borderColor} border rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg min-h-[140px] flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 ${card.color} rounded-lg shadow-sm`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className={`text-2xl font-bold ${card.textColor} mb-1 leading-tight`}>
              {card.value}
              <span className="text-lg font-medium ml-1">{card.unit}</span>
            </div>
            <div className="text-sm text-gray-600 font-medium leading-tight">{card.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;