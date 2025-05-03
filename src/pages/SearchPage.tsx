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
    { 
      name: 'İstanbul',
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1000&q=80',
      description: 'Tarihi Sultanahmet Camii ve Ayasofya ile dünyaca ünlü şehir'
    },
    {
      name: 'Antalya', 
      image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=1000&q=80',
      description: 'Muhteşem plajları ve antik kentleriyle Türk Rivierası'
    },
    {
      name: 'Bodrum',
      image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=1000&q=80',
      description: 'St. Peter Kalesi ve yat limanıyla ünlü tatil cenneti'
    },
    {
      name: 'Kapadokya',
      image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1000&q=80',
      description: 'Peri bacaları ve sıcak hava balonlarıyla masalsı bölge'
    },
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // URL parametrelerini oluştur
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
    
    // Arama formuna kaydır
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
      searchForm.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Mükemmel Otelinizi Bulun</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Binlerce oteli keşfedin ve sonraki seyahatiniz için mükemmel konaklamayı bulun.
          </p>
        </div>
        
        {/* Ana Arama Formu */}
        <div id="search-form" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <label htmlFor="destination" className="block text-xl text-gray-700 font-medium mb-2">
                  Konum
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                  <input
                    id="destination"
                    type="text"
                    placeholder="Nereye gitmek istiyorsunuz?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full text-lg pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Hedef şehir veya otel adı"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="check-in" className="block text-xl text-gray-700 font-medium mb-2">
                  Giriş Tarihi
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                  <input
                    id="check-in"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-lg pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Giriş tarihi"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="check-out" className="block text-xl text-gray-700 font-medium mb-2">
                  Çıkış Tarihi
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                  <input
                    id="check-out"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-lg pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Çıkış tarihi"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="guests" className="block text-xl text-gray-700 font-medium mb-2">
                  Misafir
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                  <select
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full text-lg pl-12 pr-4 py-4 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Misafir sayısı"
                  >
                    <option value="1">1 Misafir</option>
                    <option value="2">2 Misafir</option>
                    <option value="3">3 Misafir</option>
                    <option value="4">4 Misafir</option>
                    <option value="5">5+ Misafir</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Filtre Düğmesi */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={toggleFilters}
                className="flex items-center text-blue-600 hover:text-blue-800 transition text-lg"
                aria-label="Gelişmiş filtreleri göster/gizle"
                aria-expanded={showFilters}
              >
                <Filter size={20} className="mr-2" />
                {showFilters ? 'Filtreleri Gizle' : 'Daha Fazla Filtre'}
              </button>
            </div>
            
            {/* Gelişmiş Filtreler */}
            {showFilters && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Yıldız Derecesi */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Yıldız Derecesi</h3>
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
                          aria-label={`${star} yıldız`}
                        >
                          {star} <Star size={18} className="ml-1" fill={starRating.includes(star) ? 'white' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Fiyat Aralığı */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Fiyat Aralığı (gecelik)</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-medium">{priceRange[0]} ₺</span>
                        <span className="text-lg font-medium">{priceRange[1]} ₺</span>
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
                          aria-label="Minimum fiyat"
                        />
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          step="10"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange(e, 1)}
                          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                          aria-label="Maksimum fiyat"
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
                aria-label="Otel ara"
              >
                <Search size={24} className="mr-2" />
                <span>Ara</span>
              </button>
            </div>
          </form>
        </div>
        
        {/* Popüler Destinasyonlar */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popüler Destinasyonlar</h2>
          <p className="text-lg text-gray-600">En çok tercih edilen tatil bölgelerini keşfedin</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((destination, index) => (
            <button
              key={index}
              onClick={() => selectDestination(destination.name)}
              className="group relative rounded-xl overflow-hidden shadow-lg aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <img 
                src={destination.image} 
                alt={destination.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{destination.name}</h3>
                <p className="text-sm text-gray-200">{destination.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;