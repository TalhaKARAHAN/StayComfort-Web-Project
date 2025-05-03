export interface BaseHotel {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  amenities: string[];
  category: 'luxury' | 'business' | 'resort' | 'boutique';
  starRating: 1 | 2 | 3 | 4 | 5;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  response?: {
    text: string;
    date: string;
  };
}

export interface Policy {
  title: string;
  details: string;
  category: 'check-in' | 'check-out' | 'cancellation' | 'children' | 'pets' | 'other';
  isImportant: boolean;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  size: number; // in square meters
  bedType: 'single' | 'double' | 'king' | 'twin';
  view: 'city' | 'sea' | 'garden' | 'mountain';
  isAvailable: boolean;
  maxOccupancy: number;
  floor?: number;
  roomNumber?: string;
  basePrice: number;
  discountedPrice: number | null;
}

export interface HotelDetails extends BaseHotel {
  images: string[];
  longDescription: string;
  reviews: Review[];
  policies: Policy[];
  rooms: Room[];
  checkInTime: string;
  checkOutTime: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  facilities: {
    name: string;
    description: string;
    icon: string;
    isAvailable: boolean;
  }[];
  nearbyAttractions: {
    name: string;
    distance: number;
    type: string;
  }[];
  languages: string[];
  paymentMethods: string[];
  sustainability: {
    isEcoFriendly: boolean;
    certifications: string[];
  };
} 