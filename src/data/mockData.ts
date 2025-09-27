import { LocationAnalysis, Business } from '../types';

export const mockAnalysis: LocationAnalysis = {
  location: {
    lat: 2.9226,
    lng: 101.6550,
    address: 'Near DPULZE Shopping Centre, Cyberjaya, Selangor, Malaysia',
  },
  businessType: 'Restaurant',
  seasonalDemand: [
    { month: 'Jan', demand: 85, change: -5 },
    { month: 'Feb', demand: 78, change: -8 },
    { month: 'Mar', demand: 92, change: 18 },
    { month: 'Apr', demand: 88, change: -4 },
    { month: 'May', demand: 95, change: 8 },
    { month: 'Jun', demand: 82, change: -14 },
    { month: 'Jul', demand: 76, change: -7 },
    { month: 'Aug', demand: 89, change: 17 },
    { month: 'Sep', demand: 94, change: 6 },
    { month: 'Oct', demand: 91, change: -3 },
    { month: 'Nov', demand: 87, change: -4 },
    { month: 'Dec', demand: 98, change: 13 },
  ],
  demographics: { office: 60, residents: 40 }, // Cyberjaya skewed toward offices/uni crowd
  competitors: [
    { name: 'Shaftsbury Square Bistro', size: 110, rating: 4.4, distance: 0.7 },
    { name: 'DPULZE Food Court', size: 90, rating: 4.2, distance: 0.2 },
    { name: 'Tamarind Square Eatery', size: 70, rating: 4.6, distance: 2.3 },
    { name: 'Family Kitchen Cyberjaya', size: 95, rating: 4.1, distance: 1.0 },
    { name: 'Quick Bites Cyber', size: 45, rating: 3.9, distance: 0.5 },
  ],
  locationProfile: { age: 82, income: 88, familySize: 50, daytimePop: 90, accessibility: 92 },
  competitionDensity: [
    { radius: '1km', category: 'Restaurants', density: 10 },
    { radius: '1km', category: 'Cafes', density: 9 },
    { radius: '3km', category: 'Restaurants', density: 28 },
    { radius: '3km', category: 'Cafes', density: 24 },
    { radius: '5km', category: 'Restaurants', density: 46 },
    { radius: '5km', category: 'Cafes', density: 38 },
  ],
  successScore: 87, // keep as-is; you can still override per selected scale in UI
  kpis: {
    avgRating: 4.3,
    monthlyDemand: 11800,
    rentSensitivity: 74,
    competitorCount: 38,
    revenuePotential: 78000,
  },
};

export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Shaftsbury Square Bistro',
    rating: 4.4,
    address: 'Shaftsbury Square, Cyberjaya',
    distance: 0.7,
    category: 'Bistro',
    contact: '+60 3-8888 1111',
    thumbnail:
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
    position: { lat: 2.9249, lng: 101.6536, address: '' },
    reviewTrend: [4.2, 4.3, 4.4, 4.5, 4.4, 4.4],
  },
  {
    id: '2',
    name: 'DPULZE Food Court',
    rating: 4.2,
    address: 'Level 2, DPULZE Shopping Centre, Cyberjaya',
    distance: 0.2,
    category: 'Food Court',
    contact: '+60 3-8320 0000',
    thumbnail:
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    position: { lat: 2.9236, lng: 101.6566, address: '' },
    reviewTrend: [4.0, 4.1, 4.2, 4.2, 4.3, 4.2],
  },
  {
    id: '3',
    name: "Tamarind Square Eatery",
    rating: 4.6,
    address: 'Tamarind Square, Persiaran Multimedia, Cyberjaya',
    distance: 2.3,
    category: 'Casual Dining',
    contact: '+60 3-8325 8888',
    thumbnail:
      'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=400',
    position: { lat: 2.9606, lng: 101.6518, address: '' },
    reviewTrend: [4.5, 4.5, 4.6, 4.7, 4.7, 4.6],
  },
  {
    id: '4',
    name: 'Cyberjaya Night Market',
    rating: 4.1,
    address: 'Persiaran Rimba Permai, Cyberjaya',
    distance: 1.1,
    category: 'Street Food',
    contact: 'Various vendors',
    thumbnail:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    position: { lat: 2.9189, lng: 101.6555, address: '' },
    reviewTrend: [4.0, 4.0, 4.1, 4.1, 4.2, 4.1],
  },
  {
    id: '5',
    name: 'SkyPark Rooftop Dining',
    rating: 4.3,
    address: 'Lingkaran Cyber Point Barat, Cyberjaya',
    distance: 1.3,
    category: 'Fine Dining',
    contact: '+60 3-2020 5055',
    thumbnail:
      'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&w=400',
    position: { lat: 2.9207, lng: 101.6468, address: '' },
    reviewTrend: [4.2, 4.3, 4.3, 4.4, 4.3, 4.3],
  },
];

export const chatSuggestions = [
  "What's the best time to open this type of business?",
  'How does foot traffic vary throughout the day?',
  'What are the main demographic characteristics?',
  'Which competitors should I be most concerned about?',
  "What's the average rent in this area?",
  'How seasonal is demand for this business type?',
];
