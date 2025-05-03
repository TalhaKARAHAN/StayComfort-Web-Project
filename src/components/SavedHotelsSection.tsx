import React from 'react';
import { MapPin, Star, Bookmark } from 'lucide-react';
import { BaseHotel } from '../types/hotel';
import { useNavigate } from 'react-router-dom';

interface SavedHotelsSectionProps {
  savedHotels: BaseHotel[];
  onRemoveHotel: (hotel: BaseHotel) => Promise<void>;
}

const SavedHotelsSection: React.FC<SavedHotelsSectionProps> = ({
  savedHotels,
  onRemoveHotel
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Kaydedilen Oteller</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
          >
            <div className="relative">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="h-48 w-full object-cover"
              />
              <button
                onClick={() => onRemoveHotel(hotel)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
              >
                <Bookmark className="w-5 h-5 text-blue-600 fill-current" />
              </button>
            </div>
            
            <div className="p-4">
              <div onClick={() => navigate(`/hotels/${hotel.id}`)} className="cursor-pointer">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {hotel.name}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1" />
                  <span>{hotel.location}</span>
                </div>
                <div className="flex items-center mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{hotel.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-900">₺{hotel.price}</span>
                  <span className="text-gray-600 text-sm ml-1">/ gecelik</span>
                </div>
                <button
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                  className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                >
                  İncele
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedHotelsSection; 