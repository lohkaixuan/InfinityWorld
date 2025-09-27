import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

interface LocationRequestProps {
  onSubmit: (location: string, businessType: string) => void;
}

const LocationRequest: React.FC<LocationRequestProps> = ({ onSubmit }) => {
  const [location, setLocation] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  // Lock background scroll when dropdown is open
  useEffect(() => {
    if (dropdownOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [dropdownOpen]);

  const handleLocationChange = (value: string) => {
    setLocation(value);
    if (value.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        { input: value, types: ['establishment', 'geocode'] },
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
    <div
      className="w-full h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('assets/background.jpg')" }}
    >
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          <div className="relative rounded-2xl border border-gray-200 shadow-[0_4px_10px_rgba(0,0,0,0.3),_inset_0_2px_4px_rgba(255,255,255,0.6)]">
            {/* Header */}
            <div className="mt-8 text-black text-center">
              <div className="flex items-center justify-center">
                <img src="assets/logo.png" alt="Logo" className="w-20 h-auto object-contain" />
                <h1 className="text-5xl font-bold">Infinity World</h1>
              </div>
              <p className="text-black-100 text-lg">
                Finding the best location for your business
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                <div className="flex flex-row">
                  {/* Location Input */}
                  <div className="p-2 flex-1 relative z-20">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                      <input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="e.g., near LRT KLCC, Malaysia"
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl
                                   text-lg transition-all duration-200
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                   hover:border-blue-400 hover:shadow-md bg-white/90 backdrop-blur"
                        required
                      />

                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                          {suggestions.map((s) => (
                            <button
                              key={s.place_id}
                              type="button"
                              onClick={() => handleSuggestionClick(s)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {s.structured_formatting.main_text}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {s.structured_formatting.secondary_text}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Business Type Dropdown */}
                  <div className="p-2 flex-1 relative z-10">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen((o) => !o)}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl
                                   text-lg bg-white text-left
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                   hover:border-blue-400 hover:shadow-md
                                   flex justify-between items-center"
                      >
                        {businessType || "Select business type"}
                        <ChevronDown className="w-5 h-5 text-gray-400 ml-2" />
                      </button>

                      {dropdownOpen && (
                        <ul className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                          {businessTypes.map((type) => (
                            <li
                              key={type}
                              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setBusinessType(type);
                                setDropdownOpen(false);
                              }}
                            >
                              {type}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="p-2">
                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className={`py-4 px-8 rounded-xl text-white font-semibold text-lg transition-all duration-300 transform ${
                        isFormValid
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-[1.02] shadow-lg'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isFormValid ? 'Analyze Location' : 'Please fill in all fields'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationRequest;
