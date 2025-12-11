export interface Instructor {
  id: string;
  name: string;
  location: string;
  vehicle: 'Auto' | 'Manual';
  rating: number;
  reviews: number;
  image: string;
  price: number;
  bio: string;
  performance: {
    punctuality: number;
    clarity: number;
    patience: number;
    knowledge: number;
    safety: number;
  };
  coordinates: { x: number; y: number }; // For map simulation
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Package {
  id: string;
  name: string;
  lessons: number;
  price: number;
  discount: number; // Percentage
}

// Mock Data
export const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    location: 'North Sydney',
    vehicle: 'Auto',
    rating: 4.9,
    reviews: 124,
    image: 'https://picsum.photos/200/200?random=1',
    price: 75,
    bio: 'Patient and experienced instructor specializing in nervous learners. 10 years of experience.',
    performance: { punctuality: 95, clarity: 98, patience: 100, knowledge: 90, safety: 99 },
    coordinates: { x: 100, y: 150 }
  },
  {
    id: '2',
    name: 'Mike Ross',
    location: 'Bondi Junction',
    vehicle: 'Manual',
    rating: 4.7,
    reviews: 89,
    image: 'https://picsum.photos/200/200?random=2',
    price: 80,
    bio: 'Focus on defensive driving techniques and test preparation. High pass rate.',
    performance: { punctuality: 90, clarity: 92, patience: 85, knowledge: 95, safety: 95 },
    coordinates: { x: 300, y: 200 }
  },
  {
    id: '3',
    name: 'Emily Chen',
    location: 'Parramatta',
    vehicle: 'Auto',
    rating: 4.8,
    reviews: 56,
    image: 'https://picsum.photos/200/200?random=3',
    price: 70,
    bio: 'Friendly and structured lessons. Fluent in English and Mandarin.',
    performance: { punctuality: 98, clarity: 90, patience: 95, knowledge: 88, safety: 92 },
    coordinates: { x: 150, y: 300 }
  },
  {
    id: '4',
    name: 'David Miller',
    location: 'Chatswood',
    vehicle: 'Manual',
    rating: 4.6,
    reviews: 210,
    image: 'https://picsum.photos/200/200?random=4',
    price: 85,
    bio: 'Ex-police driving instructor. Strict but effective for mastering manual transmission.',
    performance: { punctuality: 100, clarity: 85, patience: 70, knowledge: 100, safety: 100 },
    coordinates: { x: 120, y: 100 }
  },
  {
    id: '5',
    name: 'Jessica Lee',
    location: 'Strathfield',
    vehicle: 'Auto',
    rating: 4.9,
    reviews: 45,
    image: 'https://picsum.photos/200/200?random=5',
    price: 72,
    bio: 'Young and relatable instructor. Great for students just starting out.',
    performance: { punctuality: 92, clarity: 95, patience: 98, knowledge: 85, safety: 90 },
    coordinates: { x: 200, y: 250 }
  },
];

export const MOCK_PACKAGES: Package[] = [
  { id: 'p1', name: 'Single Lesson', lessons: 1, price: 75, discount: 0 },
  { id: 'p2', name: 'Starter Pack', lessons: 5, price: 360, discount: 4 },
  { id: 'p3', name: 'Value Pack', lessons: 10, price: 700, discount: 7 },
  { id: 'p4', name: 'Pass Guarantee', lessons: 20, price: 1350, discount: 10 },
];

export const TEST_CENTRES = [
    { name: 'Bondi Junction', x: 280, y: 190 },
    { name: 'Chatswood', x: 130, y: 110 },
    { name: 'Silverwater', x: 180, y: 280 },
    { name: 'Marrickville', x: 220, y: 220 },
];