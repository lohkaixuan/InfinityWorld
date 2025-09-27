import React from 'react';
import { X, Star, MapPin, Phone, TrendingUp } from 'lucide-react';
import { Business } from '../types';
import { googleMapsPlaceUrl } from '../utils/maps';

interface BusinessDetailProps {
  business: Business;
  onClose: () => void;
  onRecenter: (business: Business) => void;
}

const BusinessDetail: React.FC<BusinessDetailProps> = ({ business, onClose, onRecenter }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-5 h-5 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      );
    }

    return stars;
  };

  const maxTrend = Math.max(...business.reviewTrend);
  const minTrend = Math.min(...business.reviewTrend);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={business.thumbnail}
            alt={business.name}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{business.name}</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {renderStars(business.rating)}
            </div>
            <span className="text-lg font-medium text-gray-700">{business.rating}</span>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
              {business.category}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <div className="text-gray-700">{business.address}</div>
                <div className="text-sm text-blue-600 font-medium">{business.distance}km from selected location</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{business.contact}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Rating Trend (Last 6 Months)</h3>
            </div>
            <div className="flex items-end gap-2 h-16">
              {business.reviewTrend.map((rating, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{
                      height: `${((rating - minTrend) / (maxTrend - minTrend)) * 100}%`,
                      minHeight: '20px',
                    }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-1">{rating}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={googleMapsPlaceUrl(business)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
            >
            Show on Map
            </a>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;