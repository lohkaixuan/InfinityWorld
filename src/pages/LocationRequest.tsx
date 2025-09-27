import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import WaveBackground from '../components/WaveBackground';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

interface LocationRequestProps {
  onSubmit: (location: string, businessType: string) => void;
}

const LocationRequest: React.FC<LocationRequestProps> = ({ onSubmit }) => {
  const [location, setLocation] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  const handleLocationChange = (value: string) => {
    setLocation(value);
    
    if (value.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          types: ['establishment', 'geocode']
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.slice(0, 5));
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: google.maps.places.AutocompletePrediction) => {
    setLocation(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const businessTypes = [
    'Restaurant',
    'Cafe',
    'Retail Store',
    'Office Space',
    'Gym/Fitness',
    'Beauty Salon',
    'Medical Clinic',
    'Educational Center',
    'Entertainment Venue',
    'Service Business',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim() && businessType) {
      onSubmit(location.trim(), businessType);
    }
  };

  const isFormValid = location.trim() && businessType;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <WaveBackground />
      
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">BizLocation.ai</h1>
            <p className="text-blue-100 text-lg">
              Discover the perfect spot for your business with AI-powered insights
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            
            <div className="space-y-6">
              <div className="flex flex-row">

                {/* Location Input */}
                <div className="p-2 flex-1 relative">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 ">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="e.g., near LRT KLCC, Malaysia"
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                      aria-label="Enter location for analysis"
                      required
                    />
                    
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-20 mt-1 max-h-60 overflow-y-auto">
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion.place_id}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {suggestion.structured_formatting.main_text}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {suggestion.structured_formatting.secondary_text}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* <p className="text-sm text-gray-500 mt-2">
                    Enter a specific address, landmark, or area you're considering
                  </p> */}
                </div>            


                {/* Business Type Dropdown */}
                <div className="p-2  flex-1 relative">
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 ">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="businessType"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full appearance-none px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg bg-white"
                      aria-label="Select business type"
                      required
                    >
                      <option value="">Select business type</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {/* <p className="text-sm text-gray-500 mt-2">
                    Choose the type of business you want to analyze
                  </p> */}
                </div>
                

                {/* Submit Button */}
                <div className="p-2">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`mt-5 py-4 px-8 rounded-xl text-white font-semibold text-lg transition-all duration-300 transform ${
                      isFormValid
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-[1.02] shadow-lg'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    aria-label="Analyze selected location"
                  >
                    {isFormValid ? 'Analyze Location' : 'Please fill in all fields'}
                  </button> 
                </div>
                

              </div>
            {/* Additional Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-2">What you'll get:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Comprehensive demographic analysis</li>
                <li>• Competitor mapping and insights</li>
                <li>• Seasonal demand predictions</li>
                <li>• AI-powered success scoring</li>
                <li>• Interactive maps and visualizations</li>
              </ul>
            </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationRequest;