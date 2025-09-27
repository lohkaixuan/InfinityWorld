import React from 'react';
import { Star, MapPin, Phone } from 'lucide-react';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
  onClick: (business: Business) => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onClick }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
      onClick={() => onClick(business)}
    >
      <div className="flex p-4 gap-4">
        <img
          src={business.thumbnail}
          alt={business.name}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{business.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              {renderStars(business.rating)}
            </div>
            <span className="text-sm text-gray-600">{business.rating}</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{business.address}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-blue-600">{business.distance}km away</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {business.category}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{business.contact}</span>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;