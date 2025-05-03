import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Star, Coffee, Wifi, Car, CreditCard, Utensils, Filter, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { BaseHotel } from '../types/hotel';
import { hotelService, HotelFilterCriteria } from '../services/hotelService';

const HotelListPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  // Get search parameters
  const destination = searchParams.get('destination') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '';
  const starsParam = searchParams.get('stars') || '';
  const minPrice = parseInt(searchParams.get('minPrice') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '1000');
  const categoryParam = searchParams.get('category') || '';
  
  const starFilter = starsParam ? starsParam.split(',').map(s => parseInt(s) as 1 | 2 | 3 | 4 | 5) : [];
  const categoryFilter = categoryParam ? categoryParam.split(',') : [];
  
  // State
  const [hotels, setHotels] = useState<BaseHotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<BaseHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<HotelFilterCriteria>({
    starRating: starFilter,
    minPrice: minPrice,
    maxPrice: maxPrice,
    amenities: [],
    category: categoryFilter as ('luxury' | 'business' | 'resort' | 'boutique')[],
    checkIn,
    checkOut,
    guests: guests ? parseInt(guests) : undefined
  });
  
  // Fetch hotels
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const allHotels = hotelService.getAllHotels();
      setHotels(allHotels);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Apply filters
  useEffect(() => {
    if (hotels.length > 0) {
      let filtered = hotelService.filterHotels({
        ...filters,
        location: destination
      });
      
      // Sort hotels
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'name-asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
          break;
        case 'name-desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
          break;
        default:
          // Sort by a combination of rating and price
          filtered.sort((a, b) => {
            const ratingDiff = b.rating - a.rating;
            if (Math.abs(ratingDiff) > 0.5) return ratingDiff;
            return a.price - b.price;
          });
      }
      
      setFilteredHotels(filtered);
    }
  }, [hotels, destination, filters, sortBy]);
  
  const toggleFilter = () => {
    setShowFilters(!showFilters);
  };
  
  const handleStarFilter = (star: 1 | 2 | 3 | 4 | 5) => {
    setFilters(prev => {
      const newStars = prev.starRating?.includes(star) 
        ? prev.starRating.filter(s => s !== star)
        : [...(prev.starRating || []), star];
      
      return { ...prev, starRating: newStars };
    });
  };
  
  const handleCategoryFilter = (category: 'luxury' | 'business' | 'resort' | 'boutique') => {
    setFilters(prev => {
      const newCategories = prev.category?.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...(prev.category || []), category];
      
      return { ...prev, category: newCategories };
    });
  };
  
  const handleAmenityFilter = (amenity: string) => {
    setFilters(prev => {
      const newAmenities = prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity];
      
      return { ...prev, amenities: newAmenities };
    });
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = parseInt(e.target.value);
    setFilters(prev => ({
      ...prev,
      [type === 'min' ? 'minPrice' : 'maxPrice']: value
    }));
  };
  
  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);
    if (filters.starRating?.length) params.append('stars', filters.starRating.join(','));
    if (filters.category?.length) params.append('category', filters.category.join(','));
    params.append('minPrice', filters.minPrice?.toString() || '0');
    params.append('maxPrice', filters.maxPrice?.toString() || '1000');
    
    navigate({
      pathname: '/hotels',
      search: params.toString()
    });
  };
  
  const clearFilters = () => {
    setFilters({
      starRating: [],
      minPrice: 0,
      maxPrice: 1000,
      amenities: [],
      category: []
    });
  };
  
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi size={20} />;
      case 'parking':
        return <Car size={20} />;
      case 'breakfast':
        return <Coffee size={20} />;
      case 'restaurant':
        return <Utensils size={20} />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      luxury: 'Lüks',
      business: 'İş',
      resort: 'Resort',
      boutique: 'Butik'
    };
    return labels[category] || category;
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {destination ? `${destination} Otelleri` : 'Tüm Oteller'}
          </h1>
          
          {(checkIn && checkOut) && (
            <p className="text-lg text-gray-600">
              {`${new Date(checkIn).toLocaleDateString()} - ${new Date(checkOut).toLocaleDateString()} · ${guests} ${parseInt(guests) > 1 ? 'misafir' : 'misafir'}`}
            </p>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar (Desktop) */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Filtreler</h2>
              
              <div className="space-y-8">
                {/* Category Filter */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Otel Kategorisi</h3>
                  <div className="space-y-3">
                    {['luxury', 'business', 'resort', 'boutique'].map(category => (
                      <button
                        key={category}
                        type="button"
                        className={`flex items-center justify-between w-full px-4 py-2 border rounded-lg text-lg ${
                          filters.category?.includes(category as any) 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                        onClick={() => handleCategoryFilter(category as any)}
                        aria-pressed={filters.category?.includes(category as any)}
                      >
                        <span>{getCategoryLabel(category)}</span>
                        {filters.category?.includes(category as any) && <Check size={18} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Fiyat Aralığı</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span>₺{filters.minPrice}</span>
                      <span>₺{filters.maxPrice}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={filters.minPrice}
                      onChange={(e) => handlePriceChange(e, 'min')}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      aria-label="Minimum price range"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={filters.maxPrice}
                      onChange={(e) => handlePriceChange(e, 'max')}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      aria-label="Maximum price range"
                    />
                  </div>
                </div>
                
                {/* Star Rating */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Yıldız Derecesi</h3>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`flex items-center justify-between w-full px-4 py-2 border rounded-lg text-lg ${
                          filters.starRating?.includes(star as 1 | 2 | 3 | 4 | 5) 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                        onClick={() => handleStarFilter(star as 1 | 2 | 3 | 4 | 5)}
                        aria-pressed={filters.starRating?.includes(star as 1 | 2 | 3 | 4 | 5)}
                      >
                        <span className="flex items-center">
                          {star} <Star size={18} className="ml-1" fill={filters.starRating?.includes(star as 1 | 2 | 3 | 4 | 5) ? 'white' : 'none'} />
                        </span>
                        {filters.starRating?.includes(star as 1 | 2 | 3 | 4 | 5) && <Check size={18} />}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Otel Olanakları</h3>
                  <div className="space-y-3">
                    {['wifi', 'parking', 'breakfast', 'restaurant', 'pool', 'gym'].map(amenity => {
                      const amenityTranslations: { [key: string]: string } = {
                        wifi: 'Ücretsiz WiFi',
                        parking: 'Otopark',
                        breakfast: 'Kahvaltı',
                        restaurant: 'Restoran',
                        pool: 'Yüzme Havuzu',
                        gym: 'Spor Salonu'
                      };
                      return (
                      <button
                        key={amenity}
                        type="button"
                        className={`flex items-center justify-between w-full px-4 py-2 border rounded-lg text-lg ${
                            filters.amenities?.includes(amenity) 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                        onClick={() => handleAmenityFilter(amenity)}
                          aria-pressed={filters.amenities?.includes(amenity)}
                      >
                        <span className="flex items-center">
                          {getAmenityIcon(amenity)}
                            <span className="ml-2">{amenityTranslations[amenity]}</span>
                        </span>
                          {filters.amenities?.includes(amenity) && <Check size={18} />}
                      </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={updateSearchParams}
                    className="btn btn-primary w-full"
                  >
                    Filtreleri Uygula
                  </button>
                  
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="btn btn-outline w-full"
                  >
                    Tümünü Temizle
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters Button */}
            <div className="lg:hidden mb-4">
              <button
                type="button"
                className="btn btn-outline w-full flex items-center justify-center"
                onClick={toggleFilter}
                aria-expanded={showFilters}
              >
                <Filter size={20} className="mr-2" />
                {showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
                {showFilters ? <ChevronUp size={20} className="ml-2" /> : <ChevronDown size={20} className="ml-2" />}
              </button>
            </div>
            
            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-xl shadow-md p-6 mb-6">
                {/* Mobile filters content - same as desktop but with different layout */}
                {/* ... (same filter components as desktop) ... */}
              </div>
            )}
            
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6 bg-white rounded-lg shadow-sm p-4">
              <div className="text-lg font-medium text-gray-700">
                {loading ? 'Aranıyor...' : `${filteredHotels.length} otel bulundu`}
              </div>
              
              <div className="flex items-center">
                <label htmlFor="sort-by" className="mr-3 text-gray-600">Sırala:</label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                >
                  <option value="recommended">Önerilen</option>
                  <option value="price-low">Fiyat: Düşükten Yükseğe</option>
                  <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
                  <option value="rating">En Yüksek Puanlı</option>
                  <option value="name-asc">İsim: A-Z</option>
                  <option value="name-desc">İsim: Z-A</option>
                </select>
              </div>
            </div>
            
            {/* Hotel Listings */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mx-auto mb-4"></div>
                <p className="text-xl text-gray-600">Oteller yükleniyor...</p>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Otel bulunamadı</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Daha fazla seçenek bulmak için filtrelerinizi veya arama kriterlerinizi ayarlamayı deneyin.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn btn-primary"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredHotels.map((hotel) => (
                  <div key={hotel.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="md:flex">
                      <div className="md:w-1/3 h-64 md:h-auto relative">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white rounded-full py-1 px-3 flex items-center shadow-md">
                          <Star className="text-yellow-500 mr-1" size={16} fill="currentColor" />
                          <span className="font-semibold">{hotel.rating}</span>
                        </div>
                        <div className="absolute top-4 left-4 bg-blue-600 text-white rounded-full py-1 px-3 text-sm">
                          {getCategoryLabel(hotel.category)}
                        </div>
                      </div>
                      
                      <div className="p-6 md:w-2/3 flex flex-col">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900 mb-2">{hotel.name}</h2>
                              <div className="flex items-center text-gray-600 mb-4">
                                <MapPin size={18} className="mr-1" />
                                <span>{hotel.location}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">₺{hotel.price}</div>
                              <div className="text-gray-500">gecelik</div>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-4 text-lg">{hotel.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hotel.amenities.slice(0, 4).map((amenity, index) => {
                              const amenityTranslations: { [key: string]: string } = {
                                wifi: 'Ücretsiz WiFi',
                                parking: 'Otopark',
                                breakfast: 'Kahvaltı',
                                restaurant: 'Restoran',
                                pool: 'Yüzme Havuzu',
                                gym: 'Spor Salonu',
                                spa: 'Spa',
                                roomService: 'Oda Servisi'
                              };
                              return (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                              >
                                {getAmenityIcon(amenity)}
                                  <span className="ml-1">{amenityTranslations[amenity] || amenity}</span>
                              </span>
                              );
                            })}
                            {hotel.amenities.length > 4 && (
                              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                +{hotel.amenities.length - 4} daha fazla
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Link
                            to={`/hotels/${hotel.id}`}
                            className="btn btn-primary text-lg"
                          >
                            Detayları Gör
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelListPage;