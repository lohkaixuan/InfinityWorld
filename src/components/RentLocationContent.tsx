import React, { useState } from 'react';
import { MapPin, DollarSign, TrendingUp, Building, Calculator, Info, Star, Users, Clock } from 'lucide-react';

interface RentLocationContentProps {
  location: string;
  businessType: string;
}

const RentLocationContent: React.FC<RentLocationContentProps> = ({ location, businessType }) => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  // Mock rental data
  const rentData = {
    averageRent: 15.50,
    priceRange: { min: 12, max: 22 },
    currency: 'RM',
    unit: 'per sq ft/month',
    marketTrend: 'increasing',
    trendPercentage: 8.5,
  };

  const properties = [
    {
      id: '1',
      name: 'Avenue K Restaurant Lot',
      address: 'Level G, Avenue K Mall, Jalan Ampang, Kuala Lumpur',
      rent: 25.00,
      size: 1100,
      type: 'Restaurant Space',
      availability: 'Available Now',
      rating: 4.6,
      amenities: ['High Foot Traffic', 'Mall Security', 'Grease Trap Installed', 'Air Conditioning'],
      contact: '+60 3-2168 7888',
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '2',
      name: 'Suria KLCC F&B Corner Lot',
      address: 'Lot C.12, Level Concourse, Suria KLCC',
      rent: 28.50,
      size: 900,
      type: 'Restaurant Space',
      availability: 'Available in 3 weeks',
      rating: 4.9,
      amenities: ['High Foot Traffic', 'Kitchen Exhaust Ready', 'Mall Security', 'Utilities Included'],
      contact: '+60 3-2382 2828',
      image: 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '3',
      name: 'The LINC KL Dining Lot',
      address: '360 Jalan Tun Razak, Ground Floor, Kuala Lumpur',
      rent: 20.75,
      size: 1000,
      type: 'Restaurant Space',
      availability: 'Available Now',
      rating: 4.4,
      amenities: ['Open Concept Layout', 'Ample Parking', 'Grease Trap Installed', 'Flexible Kitchen Setup'],
      contact: '+60 3-2730 1188',
      image: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '4',
      name: 'Menara Binjai F&B Lot',
      address: 'No. 2 Jalan Binjai, Near KLCC LRT',
      rent: 18.90,
      size: 1250,
      type: 'Restaurant Space',
      availability: 'Available in 1 month',
      rating: 4.2,
      amenities: ['Street Frontage', 'Exhaust Ventilation Ready', 'Nearby Offices', 'High Visibility'],
      contact: '+60 3-2020 5055',
      image: 'https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '5',
      name: 'Lot 10 Bukit Bintang Food Court Unit',
      address: 'LG Floor, Lot 10 Mall, Jalan Sultan Ismail',
      rent: 19.50,
      size: 750,
      type: 'Restaurant Space',
      availability: 'Available in 2 weeks',
      rating: 4.5,
      amenities: ['Food Court Location', 'Ready Kitchen Setup', 'Utilities Included', 'Mall Security'],
      contact: '+60 3-2143 0110',
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '6',
      name: 'Jalan P. Ramlee Streetfront Cafe Lot',
      address: 'Ground Floor, Jalan P. Ramlee, Kuala Lumpur',
      rent: 22.00,
      size: 1300,
      type: 'Restaurant Space',
      availability: 'Available Now',
      rating: 4.3,
      amenities: ['Street Frontage', 'Bar Setup Possible', 'High Nightlife Traffic', 'Flexible Layout'],
      contact: '+60 3-2181 5055',
      image: 'https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '7',
      name: 'Plaza Low Yat F&B Lot',
      address: 'Ground Floor, Plaza Low Yat, Jalan Bukit Bintang',
      rent: 17.80,
      size: 950,
      type: 'Restaurant Space',
      availability: 'Available Now',
      rating: 4.1,
      amenities: ['Near IT Crowd', 'Air Conditioning', 'Mall Security', 'High Visibility'],
      contact: '+60 3-2142 8611',
      image: 'https://images.pexels.com/photos/302902/pexels-photo-302902.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '8',
      name: 'Petronas Twin Towers Food Court Unit',
      address: 'Tower 2, Level Concourse, Petronas Twin Towers',
      rent: 24.50,
      size: 850,
      type: 'Restaurant Space',
      availability: 'Available in 1 month',
      rating: 4.7,
      amenities: ['Corporate Lunch Crowd', 'Kitchen Exhaust Ready', 'Mall Security', 'Utilities Included'],
      contact: '+60 3-2331 8080',
      image: 'https://images.pexels.com/photos/45530/pexels-photo-45530.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '9',
      name: 'Jalan Ampang Corner Shoplot',
      address: 'No. 188 Jalan Ampang, Kuala Lumpur',
      rent: 21.25,
      size: 1400,
      type: 'Restaurant Space',
      availability: 'Available Now',
      rating: 4.2,
      amenities: ['Street Parking', 'Exhaust Ready', 'High Visibility', 'Office Crowd Nearby'],
      contact: '+60 3-2148 0099',
      image: 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '10',
      name: 'Quill City Mall F&B Lot',
      address: 'Ground Floor, Quill City Mall, Jalan Sultan Ismail',
      rent: 18.20,
      size: 1000,
      type: 'Restaurant Space',
      availability: 'Available in 2 weeks',
      rating: 4.0,
      amenities: ['Mall Crowd', 'Grease Trap Installed', 'Ample Parking', 'Utilities Included'],
      contact: '+60 3-2603 1111',
      image: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const calculateMonthlyRent = (rentPerSqFt: number, size: number) => {
    return (rentPerSqFt * size).toLocaleString();
  };

  const getRentColor = (rent: number) => {
    if (rent <= 15) return 'text-green-600';
    if (rent <= 18) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRentBadgeColor = (rent: number) => {
    if (rent <= 15) return 'bg-green-100 text-green-800';
    if (rent <= 18) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Building className="w-6 h-6" />
          Rental Market Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">
              {rentData.currency} {rentData.averageRent}
            </div>
            <div className="text-blue-100 text-sm">Average Rent ({rentData.unit})</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">
              {rentData.currency} {rentData.priceRange.min} - {rentData.priceRange.max}
            </div>
            <div className="text-blue-100 text-sm">Price Range ({rentData.unit})</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <div className="text-2xl font-bold">+{rentData.trendPercentage}%</div>
            </div>
            <div className="text-blue-100 text-sm">Market Trend (YoY)</div>
          </div>
        </div>
      </div>

      {/* Rent Calculator */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Quick Rent Calculator
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Space Size (sq ft)
            </label>
            <input
              type="number"
              defaultValue="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rent per sq ft (RM)
            </label>
            <input
              type="number"
              defaultValue={rentData.averageRent}
              step="0.50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800 mb-1">Estimated Monthly Rent</div>
          <div className="text-2xl font-bold text-blue-900">
            RM {calculateMonthlyRent(rentData.averageRent, 1000)}
          </div>
        </div>
      </div>

      {/* Available Properties */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Available Properties Near {location}
        </h4>
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${selectedProperty === property.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
              onClick={() => setSelectedProperty(selectedProperty === property.id ? null : property.id)}
            >
              <div className="flex gap-4">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-gray-900 truncate">{property.name}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRentBadgeColor(property.rent)}`}>
                      RM {property.rent}/sq ft
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(property.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{property.rating}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-600">{property.type}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{property.address}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {property.size.toLocaleString()} sq ft
                      </span>
                      <span className={`font-semibold ${getRentColor(property.rent)}`}>
                        RM {calculateMonthlyRent(property.rent, property.size)}/month
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {property.availability}
                    </div>
                  </div>
                </div>
              </div>

              {selectedProperty === property.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="font-medium text-gray-900 mb-2">Amenities</h6>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h6 className="font-medium text-gray-900 mb-2">Contact Information</h6>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {property.contact}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Contact Owner
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                      Schedule Visit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          Market Insights for {businessType}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Rental Trends</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Prime locations (KLCC area) command 20-30% premium</li>
              <li>• Ground floor retail spaces are 15% more expensive</li>
              <li>• Flexible lease terms available for new businesses</li>
              <li>• Average lease duration: 3-5 years</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Location Benefits</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• High foot traffic from office workers and tourists</li>
              <li>• Excellent public transportation connectivity</li>
              <li>• Premium shopping and dining district</li>
              <li>• Strong brand association with luxury market</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentLocationContent;