import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Star, Coffee, Wifi, Car, CreditCard, Utensils, Filter, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  amenities: string[];
}

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
  
  const starFilter = starsParam ? starsParam.split(',').map(s => parseInt(s)) : [];
  
  // State
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    stars: starFilter,
    minPrice: minPrice,
    maxPrice: maxPrice,
    amenities: [] as string[]
  });
  
  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const dummyHotels: Hotel[] = [
        {
          id: 1,
          name: "Luxury Ocean Resort",
          location: "Miami, FL",
          description: "Experience luxury at its finest with stunning ocean views and world-class amenities.",
          image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          price: 299,
          rating: 4.8,
          amenities: ["pool", "wifi", "parking", "restaurant", "spa", "gym"]
        },
        {
          id: 2,
          name: "Mountain View Lodge",
          location: "Aspen, CO",
          description: "Nestled in the mountains, this lodge offers a cozy retreat with breathtaking mountain vistas.",
          image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          price: 199,
          rating: 4.6,
          amenities: ["wifi", "parking", "restaurant", "fireplace"]
        },
        {
          id: 3,
          name: "Urban Boutique Hotel",
          location: "New York, NY",
          description: "A stylish boutique hotel in the heart of Manhattan with modern decor and premium services.",
          image: "https://images.pexels.com/photos/2869215/pexels-photo-2869215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          price: 249,
          rating: 4.7,
          amenities: ["wifi", "restaurant", "bar", "gym"]
        },
        {
          id: 4,
          name: "Historic Downtown Inn",
          location: "Charleston, SC",
          description: "A charming historic inn with classic decor and southern hospitality in the heart of downtown.",
          image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          price: 179,
          rating: 4.5,
          amenities: ["wifi", "breakfast", "parking"]
        },
        {
          id: 5,
          name: "Beachfront Paradise Resort",
          location: "Honolulu, HI",
          description: "Wake up to the sound of waves at this stunning beachfront resort with tropical gardens.",
          image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          price: 399,
          rating: 4.9,
          amenities: ["pool", "wifi", "parking", "restaurant", "bar", "spa", "gym", "beach"]
        },
        {
          id: 6,
          name: "Modern City Loft",
          location: "Chicago, IL",
          description: "A sleek, contemporary loft in downtown with skyline views and urban amenities.",
          image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          price: 159,
          rating: 4.3,
          amenities: ["wifi", "gym", "parking"]
        }
      ];
      
      setHotels(dummyHotels);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Apply filters
  useEffect(() => {
    if (hotels.length > 0) {
      let filtered = [...hotels];
      
      // Filter by destination (if provided)
      if (destination) {
        filtered = filtered.filter(hotel => 
          hotel.name.toLowerCase().includes(destination.toLowerCase()) || 
          hotel.location.toLowerCase().includes(destination.toLowerCase())
        );
      }
      
      // Filter by star rating
      if (filters.stars.length > 0) {
        filtered = filtered.filter(hotel => 
          filters.stars.some(star => Math.floor(hotel.rating) === star)
        );
      }
      
      // Filter by price range
      filtered = filtered.filter(hotel => 
        hotel.price >= filters.minPrice && hotel.price <= filters.maxPrice
      );
      
      // Filter by amenities
      if (filters.amenities.length > 0) {
        filtered = filtered.filter(hotel => 
          filters.amenities.every(amenity => hotel.amenities.includes(amenity))
        );
      }
      
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
        // Default is 'recommended'
        default:
          // Sort by a combination of rating and price
          filtered.sort((a, b) => b.rating - a.rating || a.price - b.price);
      }
      
      setFilteredHotels(filtered);
    }
  }, [hotels, destination, filters, sortBy]);
  
  const toggleFilter = () => {
    setShowFilters(!showFilters);
  };
  
  const handleStarFilter = (star: number) => {
    setFilters(prev => {
      const newStars = prev.stars.includes(star) 
        ? prev.stars.filter(s => s !== star)
        : [...prev.stars, star];
      
      return { ...prev, stars: newStars };
    });
  };
  
  const handleAmenityFilter = (amenity: string) => {
    setFilters(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      
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
    if (filters.stars.length) params.append('stars', filters.stars.join(','));
    params.append('minPrice', filters.minPrice.toString());
    params.append('maxPrice', filters.maxPrice.toString());
    
    navigate({
      pathname: '/hotels',
      search: params.toString()
    });
  };
  
  const clearFilters = () => {
    setFilters({
      stars: [],
      minPrice: 0,
      maxPrice: 1000,
      amenities: []
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
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {destination ? `Hotels in ${destination}` : 'All Hotels'}
          </h1>
          
          {(checkIn && checkOut) && (
            <p className="text-lg text-gray-600">
              {`${new Date(checkIn).toLocaleDateString()} - ${new Date(checkOut).toLocaleDateString()} · ${guests} ${parseInt(guests) > 1 ? 'guests' : 'guest'}`}
            </p>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar (Desktop) */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
              
              <div className="space-y-8">
                {/* Price Range */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span>${filters.minPrice}</span>
                      <span>${filters.maxPrice}</span>
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
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Star Rating</h3>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`flex items-center justify-between w-full px-4 py-2 border rounded-lg text-lg ${
                          filters.stars.includes(star) 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                        onClick={() => handleStarFilter(star)}
                        aria-pressed={filters.stars.includes(star)}
                        aria-label={`${star} star rating`}
                      >
                        <span className="flex items-center">
                          {star} <Star size={18} className="ml-1" fill={filters.stars.includes(star) ? 'white' : 'none'} />
                        </span>
                        {filters.stars.includes(star) && <Check size={18} />}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Amenities</h3>
                  <div className="space-y-3">
                    {['wifi', 'parking', 'breakfast', 'restaurant', 'pool', 'gym'].map(amenity => (
                      <button
                        key={amenity}
                        type="button"
                        className={`flex items-center justify-between w-full px-4 py-2 border rounded-lg text-lg ${
                          filters.amenities.includes(amenity) 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                        onClick={() => handleAmenityFilter(amenity)}
                        aria-pressed={filters.amenities.includes(amenity)}
                        aria-label={`${amenity} amenity`}
                      >
                        <span className="flex items-center">
                          {getAmenityIcon(amenity)}
                          <span className="ml-2 capitalize">{amenity}</span>
                        </span>
                        {filters.amenities.includes(amenity) && <Check size={18} />}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={updateSearchParams}
                    className="btn btn-primary w-full"
                    aria-label="Apply filters"
                  >
                    Apply Filters
                  </button>
                  
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="btn btn-outline w-full"
                    aria-label="Clear all filters"
                  >
                    Clear All
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
                aria-controls="mobile-filters"
                aria-label="Toggle filters panel"
              >
                <Filter size={20} className="mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {showFilters ? <ChevronUp size={20} className="ml-2" /> : <ChevronDown size={20} className="ml-2" />}
              </button>
            </div>
            
            {/* Mobile Filters Panel */}
            {showFilters && (
              <div id="mobile-filters" className="lg:hidden bg-white rounded-xl shadow-md p-6 mb-6 animate-slideDown">
                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Price Range</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-lg">
                        <span>${filters.minPrice}</span>
                        <span>${filters.maxPrice}</span>
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
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Star Rating</h3>
                    <div className="flex flex-wrap gap-2">
                      {[5, 4, 3, 2, 1].map(star => (
                        <button
                          key={star}
                          type="button"
                          className={`px-4 py-2 border rounded-lg flex items-center text-lg ${
                            filters.stars.includes(star) 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                          onClick={() => handleStarFilter(star)}
                          aria-pressed={filters.stars.includes(star)}
                          aria-label={`${star} star rating`}
                        >
                          {star} <Star size={18} className="ml-1" fill={filters.stars.includes(star) ? 'white' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {['wifi', 'parking', 'breakfast', 'restaurant'].map(amenity => (
                        <button
                          key={amenity}
                          type="button"
                          className={`px-4 py-2 border rounded-lg flex items-center text-lg ${
                            filters.amenities.includes(amenity) 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                          onClick={() => handleAmenityFilter(amenity)}
                          aria-pressed={filters.amenities.includes(amenity)}
                          aria-label={`${amenity} amenity`}
                        >
                          <span className="capitalize">{amenity}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={updateSearchParams}
                      className="btn btn-primary flex-1"
                      aria-label="Apply filters"
                    >
                      Apply
                    </button>
                    
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="btn btn-outline flex-1"
                      aria-label="Clear all filters"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6 bg-white rounded-lg shadow-sm p-4">
              <div className="text-lg font-medium text-gray-700">
                {loading ? 'Searching...' : `${filteredHotels.length} hotels found`}
              </div>
              
              <div className="flex items-center">
                <label htmlFor="sort-by" className="mr-3 text-gray-600">Sort by:</label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  aria-label="Sort hotels by"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
            
            {/* Hotel Listings */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mx-auto mb-4"></div>
                <p className="text-xl text-gray-600">Loading hotels...</p>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">No hotels found</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Try adjusting your filters or search criteria to find more options.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn btn-primary"
                  aria-label="Clear filters and search again"
                >
                  Clear Filters
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
                              <div className="text-2xl font-bold text-blue-600">${hotel.price}</div>
                              <div className="text-gray-500">per night</div>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-4 text-lg">{hotel.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hotel.amenities.slice(0, 4).map((amenity, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                              >
                                {getAmenityIcon(amenity)}
                                <span className="ml-1 capitalize">{amenity}</span>
                              </span>
                            ))}
                            {hotel.amenities.length > 4 && (
                              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                +{hotel.amenities.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Link
                            to={`/hotels/${hotel.id}`}
                            className="btn btn-primary text-lg"
                            aria-label={`View details for ${hotel.name}`}
                          >
                            View Details
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