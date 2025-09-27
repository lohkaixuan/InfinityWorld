import React, { useState } from 'react';
import { MapPin, DollarSign, TrendingUp, Building, Calculator, Info, Star, Users, Clock } from 'lucide-react';

interface RentLocationContentProps {
  location: string;
  businessType: string;
}

const RentLocationContent: React.FC<RentLocationContentProps> = ({ location, businessType }) => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  //  rental data
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
    id: 'edu-cyber11',
    name: 'Edusphere Atelier (Cyber 11) — Shoplot / Retail',
    address: 'Jalan Atelier 1, Cyber 11, Cyberjaya, Selangor',
    rent: 9500,                        // RM/month (typical range RM 8,500–10,000)
    size: 1300,                        // sqft (also smaller ~650 sqft options exist)
    type: 'Shoplot / Retail',
    availability: 'Available Now',
    rating: 4.4,
    amenities: [
      'Near Universities (UoC/MMU)',
      'High Student Footfall',
      'Fast Food Neighbours (KFC/McD)',
      'Ground & First Floor Options',
      'PSF ~ RM7–8',
      'Parking Nearby'
    ],
    contact: 'Multiple agents via PropertyGuru (e.g., Jaclyn Wong, Rachel Chu)',
    image: 'https://images.pexels.com/photos/3758898/pexels-photo-3758898.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Shoplot Setia Eco Glades Cyberjaya',
    address: 'Persiaran Semarak Api, Cyber 10, Cyberjaya, Selangor',
    rent: 8000.00,
    size: 1650,
    type: 'Shoplot / Restaurant Space',
    availability: 'Available Now',
    rating: 4.2,  // estimated / comparison
    amenities: ['Good road frontage', 'Near KFC & McDonald’s', 'Close to major highways (ELITE, LDP, MEX)', 'Freehold tenure'],
    contact: '+60 19-775 0157',
    image: 'https://images.pexels.com/photos/230290/pexels-photo-230290.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    id: '3',
    name: 'CBD Perdana 3 — Shoplot / Restaurant (Fully Furnished)',
    address: 'CBD Perdana 3, Jalan Perdana, Cyberjaya',
    rent: 17000,                     // RM / month (example listing; others range ~RM4,800–18,500)
    size: 2000,                      // sqft (range seen ~1,593–2,174; using a mid estimate)
    type: 'Shoplot / Restaurant',
    availability: 'Available Now',
    rating: 4.5,
    amenities: [
      'Central Cyberjaya CBD (high footfall)',
      'Fully furnished restaurant setup',
      'Suitable for larger F&B concepts',
      '2-storey options available (~2,174 sqft)',
      'Good roadside visibility & parking',
      'Higher rent bracket, prime location'
    ],
    contact: 'Agents via PropertyGuru / iProperty (CBD Perdana 3 listings)',
    image: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
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

      {/* Rent Calculator (drop-in, no hooks/imports needed) */}
        <div
          className="bg-white rounded-xl shadow-md p-6"
          onInput={(e) => {
            const root = e.currentTarget as HTMLDivElement;
            const size = Number(
              (root.querySelector('#rc-size') as HTMLInputElement)?.value || 0
            );
            const rate = Number(
              (root.querySelector('#rc-rate') as HTMLInputElement)?.value || 0
            );
            const monthly = size * rate;

            const fmt = (n: number) =>
              isFinite(n)
                ? n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '0.00';

            const out = root.querySelector('#rc-result') as HTMLElement | null;
            const note = root.querySelector('#rc-note') as HTMLElement | null;
            if (out) out.textContent = fmt(monthly);
            if (note) note.textContent = `(Based on ${fmt(rate)} RM/sq ft × ${size.toLocaleString()} sq ft)`;
          }}
        >
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
                id="rc-size"
                type="number"
                defaultValue={1000}
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rent per sq ft (RM)
              </label>
              <input
                id="rc-rate"
                type="number"
                defaultValue={rentData.averageRent}
                step="0.50"
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800 mb-1">Estimated Monthly Rent</div>
            <div className="text-2xl font-bold text-blue-900">
              RM <span id="rc-result">
                {(rentData.averageRent * 1000).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div id="rc-note" className="text-xs text-blue-700 mt-1">
              (Based on {rentData.averageRent.toFixed(2)} RM/sq ft × {Number(1000).toLocaleString()} sq ft)
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