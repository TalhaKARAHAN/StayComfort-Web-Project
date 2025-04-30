interface Hotel {
  id: string;
  name: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  description?: string;
}

// Örnek otel verileri
const SAMPLE_HOTELS: { [key: string]: Hotel } = {
  'hotel1': {
    id: 'hotel1',
    name: 'Luxury Palace Hotel',
    location: 'İstanbul, Türkiye',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
    price: 350,
    rating: 4.8,
    description: 'Boğaz manzaralı lüks otel'
  },
  'hotel2': {
    id: 'hotel2',
    name: 'Seaside Resort',
    location: 'Antalya, Türkiye',
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
    price: 250,
    rating: 4.5,
    description: 'Denize sıfır resort otel'
  },
  'hotel3': {
    id: 'hotel3',
    name: 'Mountain View Hotel',
    location: 'Bursa, Türkiye',
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
    price: 200,
    rating: 4.3,
    description: 'Uludağ manzaralı dağ oteli'
  },
  // Daha fazla otel eklenebilir
};

export const hotelService = {
  // Tek bir otelin bilgilerini getir
  getHotelById: (hotelId: string): Hotel | null => {
    return SAMPLE_HOTELS[hotelId] || null;
  },

  // Birden fazla otelin bilgilerini getir
  getHotelsByIds: (hotelIds: string[]): Hotel[] => {
    return hotelIds.map(id => SAMPLE_HOTELS[id]).filter((hotel): hotel is Hotel => hotel !== null);
  },

  // Tüm otelleri getir
  getAllHotels: (): Hotel[] => {
    return Object.values(SAMPLE_HOTELS);
  },

  // Otel ara
  searchHotels: (query: string): Hotel[] => {
    const searchTerm = query.toLowerCase();
    return Object.values(SAMPLE_HOTELS).filter(hotel => 
      hotel.name.toLowerCase().includes(searchTerm) ||
      hotel.location.toLowerCase().includes(searchTerm)
    );
  }
};

export type { Hotel }; 