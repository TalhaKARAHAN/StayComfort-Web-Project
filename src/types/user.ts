import { BaseHotel } from './hotel';

export interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  isDefault: boolean;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  preferences: {
    language: string;
    currency: string;
    theme: 'light' | 'dark';
  };
}

export interface Reservation {
  id: string;
  hotelName: string;
  location: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  image: string;
  price: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  age: string;
  isEmailVerified: boolean;
  createdAt: string;
  lastLogin: string;
  savedHotels?: string[];
  paymentMethods?: PaymentMethod[];
  reservations?: Reservation[];
  settings?: UserSettings;
} 