import { BaseHotel, HotelDetails } from '../types/hotel';
import { turkishHotels } from '../components/TurkishHotels';
import { getTurkishHotelDetails } from '../components/TurkishHotelDetails';

// Helper function to normalize Turkish characters for search
const normalizeText = (text: string): string => {
  return text.toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c');
};

export interface HotelFilterCriteria {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  starRating?: (1 | 2 | 3 | 4 | 5)[];
  amenities?: string[];
  location?: string;
  category?: ('luxury' | 'business' | 'resort' | 'boutique')[];
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  isActive?: boolean;
}

class HotelService {
  getAllHotels(): BaseHotel[] {
    return turkishHotels;
  }

  getHotelById(id: string): HotelDetails | null {
    return getTurkishHotelDetails(id);
  }

  searchHotels(query: string): BaseHotel[] {
    const normalizedQuery = normalizeText(query);
    return turkishHotels.filter(hotel => {
      const normalizedName = normalizeText(hotel.name);
      const normalizedLocation = normalizeText(hotel.location);
      const normalizedDescription = normalizeText(hotel.description);
      
      return normalizedName.includes(normalizedQuery) ||
             normalizedLocation.includes(normalizedQuery) ||
             normalizedDescription.includes(normalizedQuery);
    });
  }

  filterHotels(criteria: HotelFilterCriteria): BaseHotel[] {
    let filtered = [...turkishHotels];

    if (criteria.location) {
      const searchTerm = normalizeText(criteria.location);
      filtered = filtered.filter(hotel => 
        normalizeText(hotel.location).includes(searchTerm) ||
        normalizeText(hotel.name).includes(searchTerm)
      );
    }

    if (criteria.minPrice !== undefined) {
      filtered = filtered.filter(hotel => hotel.price >= criteria.minPrice!);
    }

    if (criteria.maxPrice !== undefined) {
      filtered = filtered.filter(hotel => hotel.price <= criteria.maxPrice!);
    }

    if (criteria.minRating !== undefined) {
      filtered = filtered.filter(hotel => hotel.rating >= criteria.minRating!);
    }

    if (criteria.starRating && criteria.starRating.length > 0) {
      filtered = filtered.filter(hotel => criteria.starRating!.includes(hotel.starRating));
    }

    if (criteria.amenities && criteria.amenities.length > 0) {
      filtered = filtered.filter(hotel =>
        criteria.amenities!.every((amenity: string) => hotel.amenities.includes(amenity))
      );
    }

    if (criteria.category && criteria.category.length > 0) {
      filtered = filtered.filter(hotel => criteria.category!.includes(hotel.category));
    }

    if (criteria.isActive !== undefined) {
      filtered = filtered.filter(hotel => hotel.isActive === criteria.isActive);
    }

    return filtered;
  }

  getHotelsByCategory(category: 'luxury' | 'business' | 'resort' | 'boutique'): BaseHotel[] {
    return turkishHotels.filter(hotel => hotel.category === category);
  }

  getHotelsByStarRating(starRating: 1 | 2 | 3 | 4 | 5): BaseHotel[] {
    return turkishHotels.filter(hotel => hotel.starRating === starRating);
  }

  getHotelsByLocation(location: string): BaseHotel[] {
    const normalizedLocation = normalizeText(location);
    return turkishHotels.filter(hotel => 
      normalizeText(hotel.location).includes(normalizedLocation)
    );
  }

  getHotelsWithAmenities(amenities: string[]): BaseHotel[] {
    return turkishHotels.filter(hotel => 
      amenities.every(amenity => hotel.amenities.includes(amenity))
    );
  }

  getHotelsInPriceRange(minPrice: number, maxPrice: number): BaseHotel[] {
    return turkishHotels.filter(hotel => 
      hotel.price >= minPrice && hotel.price <= maxPrice
    );
  }

  getHotelsWithMinRating(minRating: number): BaseHotel[] {
    return turkishHotels.filter(hotel => hotel.rating >= minRating);
  }

  getHotelsByIds(hotelIds: string[]): BaseHotel[] {
    return hotelIds.map(id => this.getHotelById(id)).filter(Boolean) as BaseHotel[];
  }
}

export const hotelService = new HotelService(); 