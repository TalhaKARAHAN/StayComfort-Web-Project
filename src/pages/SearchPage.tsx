import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, MapPin, Star, Filter } from 'lucide-react';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [starRating, setStarRating] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const popularDestinations = [
    { name: 'New York', image: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Paris', image: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Tokyo', image: 'https://images.pexels.com/photos/1510595/pexels-photo-1510595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'London', image: 'https://images.pexels.com/photos/258117/pexels-photo-258117.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);
    if (starRating.length) params.append('stars', starRating.join(','));
    params.append('minPrice', priceRange[0].toString());
    params.append('maxPrice', priceRange[1].toString());
    
    navigate({
      pathname: '/hotels',
      search: params.toString()
    });
  };

  const handleStarFilter = (star: number) => {
    setStarRating(prev => 
      prev.includes(star) 
        ? prev.filter(s => s !== star) 
        : [...prev, star]
    );
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev];
      newRange[index] = newValue;
      return newRange;
    });
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const selectDestination = (dest: string) => {
    setDestination(dest);
    
    // Scroll to search form
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
      searchForm.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Find Your Perfect Hotel</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through thousands of hotels and find the perfect stay for your next trip.
          </p>
        </div>
        
        {/* Main Search Form */}
        <div id="search-form" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <label htmlFor="destination" className="block text-xl text-gray-700 font-medium mb-2">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                  <input
                    id="destination"
                    type="text"
                    placeholder="Where are you going?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full text-lg pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Destination city or hotel name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="check-in" className="block text-xl text-gray-700 font-medium mb-2">
                  Check In
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                  <input
                    id="check-in"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-lg pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Check-in date"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="check-out" className="block text-xl text-gray-700 font-medium mb-2">
                  Check Out
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                  <input
                    id="check-out"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-lg pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Check-out date"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="guests" className="block text-xl text-gray-700 font-medium mb-2">
                  Guests
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                  <select
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full text-lg pl-12 pr-4 py-4 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Number of guests"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Filters Toggle */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={toggleFilters}
                className="flex items-center text-blue-600 hover:text-blue-800 transition text-lg"
                aria-label="Toggle advanced filters"
                aria-expanded={showFilters}
              >
                <Filter size={20} className="mr-2" />
                {showFilters ? 'Hide Filters' : 'Show More Filters'}
              </button>
            </div>
            
            {/* Advanced Filters */}
            {showFilters && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Star Rating */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Star Rating</h3>
                    <div className="flex flex-wrap gap-3">
                      {[5, 4, 3, 2, 1].map(star => (
                        <button
                          key={star}
                          type="button"
                          className={`px-4 py-2 border rounded-lg flex items-center text-lg ${
                            starRating.includes(star) 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                          onClick={() => handleStarFilter(star)}
                          aria-pressed={starRating.includes(star)}
                          aria-label={`${star} star rating`}
                        >
                          {star} <Star size={18} className="ml-1" fill={starRating.includes(star) ? 'white' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Price Range (per night)</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-medium">${priceRange[0]}</span>
                        <span className="text-lg font-medium">${priceRange[1]}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          step="10"
                          value={priceRange[0]}
                          onChange={(e) => handlePriceChange(e, 0)}
                          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                          aria-label="Minimum price"
                        />
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          step="10"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange(e, 1)}
                          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                          aria-label="Maximum price"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg flex items-center justify-center text-xl"
                aria-label="Search for hotels"
              >
                <Search size={24} className="mr-2" />
                <span>Ara</span>
              </button>
            </div>
          </form>
        </div>
        
        {/* Popular Destinations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <div
                key={index}
                className="relative h-80 rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => selectDestination(destination.name)}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && selectDestination(destination.name)}
                aria-label={`Select ${destination.name} as destination`}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold">{destination.name}</h3>
                  <p className="text-white mt-2">Explore hotels</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Search Tips */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Book in Advance",
                description: "For the best rates, book your hotel at least 30 days in advance of your trip."
              },
              {
                title: "Be Flexible with Dates",
                description: "Prices can vary significantly based on the day of the week. Try different dates to find the best deal."
              },
              {
                title: "Check Cancellation Policies",
                description: "Look for hotels with free cancellation to keep your plans flexible."
              }
            ].map((tip, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{tip.title}</h3>
                <p className="text-gray-600 text-lg">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SearchPage;