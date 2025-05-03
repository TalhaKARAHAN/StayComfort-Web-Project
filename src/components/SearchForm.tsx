import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, MapPin, ChevronDown } from 'lucide-react';

const SearchForm: React.FC = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const guestDropdownRef = useRef<HTMLDivElement>(null);
  
  // Set default dates (check-in: today, check-out: tomorrow)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState(formatDate(today));
  const [checkOut, setCheckOut] = useState(formatDate(tomorrow));
  const [guests, setGuests] = useState('2');
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);

  // Click outside handler for guest dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target as Node)) {
        setIsGuestDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);
    
    navigate({
      pathname: '/hotels',
      search: params.toString()
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1">
          <label htmlFor="destination" className="block text-gray-700 font-medium mb-2 text-left">
            Konum
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="destination"
              type="text"
              placeholder="Nereye gitmek istiyorsunuz?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-900 placeholder-gray-500"
              aria-label="Hedef şehir veya otel adı"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <label htmlFor="check-in" className="block text-gray-700 font-medium mb-2 text-left">
            Giriş Tarihi
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            <input
              id="check-in"
              type="date"
              value={checkIn}
              min={formatDate(today)}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (e.target.value > checkOut) {
                  const newCheckOut = new Date(e.target.value);
                  newCheckOut.setDate(newCheckOut.getDate() + 1);
                  setCheckOut(formatDate(newCheckOut));
                }
              }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none text-gray-900"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <label htmlFor="check-out" className="block text-gray-700 font-medium mb-2 text-left">
            Çıkış Tarihi
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            <input
              id="check-out"
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none text-gray-900"
            />
          </div>
        </div>
        
        <div className="w-full lg:w-48" ref={guestDropdownRef}>
          <label htmlFor="guests" className="block text-gray-700 font-medium mb-2 text-left">
            Misafir
          </label>
          <div className="relative">
            <div 
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer flex items-center justify-between min-h-[46px]"
              onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
            >
              <div className="flex items-center">
                <Users className="absolute left-3 text-gray-400" size={20} />
                <span className="text-gray-900">{guests} Misafir</span>
              </div>
              <ChevronDown 
                size={20} 
                className={`text-gray-400 transition-transform duration-200 ${isGuestDropdownOpen ? 'transform rotate-180' : ''}`} 
              />
            </div>
            
            {isGuestDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div
                    key={num}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                    onClick={() => {
                      setGuests(num === 5 ? '5+' : num.toString());
                      setIsGuestDropdownOpen(false);
                    }}
                  >
                    <span className="text-gray-900">{num === 5 ? '5+ Misafir' : `${num} Misafir`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full lg:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
            aria-label="Otel ara"
          >
            <Search size={20} className="inline-block mr-2" />
            Ara
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;