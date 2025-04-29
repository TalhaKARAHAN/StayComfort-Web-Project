import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Users, Check, Star, Coffee, Wifi, Tv, Wind, Bath, Maximize2, Calendar } from 'lucide-react';

interface Room {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  capacity: number;
  size: number;
  bedType: string;
  amenities: string[];
  available: boolean;
}

interface Hotel {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
}

const RoomSelectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  // Get search parameters
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '2';
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  
  useEffect(() => {
    // Simulated API call to get hotel and room data
    setTimeout(() => {
      const dummyHotel: Hotel = {
        id: parseInt(id || '1'),
        name: "Luxury Ocean Resort",
        location: "Miami Beach, FL",
        image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        rating: 4.8
      };
      
      const dummyRooms: Room[] = [
        {
          id: 1,
          name: "Deluxe Ocean View Room",
          description: "Spacious room with a king-size bed and stunning ocean views from a private balcony.",
          image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          price: 299,
          capacity: 2,
          size: 450,
          bedType: "King",
          amenities: ["Free WiFi", "Ocean View", "Air Conditioning", "Flat-screen TV", "Mini Bar", "Coffee Maker"],
          available: true
        },
        {
          id: 2,
          name: "Premium Suite",
          description: "Luxurious suite with separate living area, king-size bed, and panoramic ocean views.",
          image: "https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          price: 499,
          capacity: 2,
          size: 750,
          bedType: "King",
          amenities: ["Free WiFi", "Ocean View", "Air Conditioning", "Flat-screen TV", "Mini Bar", "Coffee Maker", "Separate Living Area", "Jacuzzi"],
          available: true
        },
        {
          id: 3,
          name: "Standard Double Room",
          description: "Comfortable room with two double beds, perfect for families or groups.",
          image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          price: 199,
          capacity: 4,
          size: 400,
          bedType: "2 Double",
          amenities: ["Free WiFi", "Air Conditioning", "Flat-screen TV", "Coffee Maker"],
          available: true
        },
        {
          id: 4,
          name: "Family Suite",
          description: "Spacious suite with two bedrooms, perfect for families with children.",
          image: "https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          price: 399,
          capacity: 4,
          size: 850,
          bedType: "1 King & 2 Twin",
          amenities: ["Free WiFi", "Partial Ocean View", "Air Conditioning", "Flat-screen TV", "Mini Bar", "Coffee Maker", "Separate Living Area"],
          available: true
        }
      ];
      
      setHotel(dummyHotel);
      setRooms(dummyRooms);
      setLoading(false);
    }, 1000);
  }, [id]);
  
  const handleRoomSelect = (roomId: number) => {
    setSelectedRoom(roomId);
  };
  
  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    
    if (lowerAmenity.includes('wifi')) return <Wifi size={20} />;
    if (lowerAmenity.includes('coffee')) return <Coffee size={20} />;
    if (lowerAmenity.includes('tv')) return <Tv size={20} />;
    if (lowerAmenity.includes('air')) return <Wind size={20} />;
    if (lowerAmenity.includes('jacuzzi') || lowerAmenity.includes('bath')) return <Bath size={20} />;
    
    return <Check size={20} />;
  };
  
  const proceedToPayment = () => {
    if (selectedRoom !== null) {
      const selectedRoomData = rooms.find(room => room.id === selectedRoom);
      
      if (selectedRoomData) {
        navigate('/payment', {
          state: {
            hotelId: id,
            hotelName: hotel?.name,
            hotelLocation: hotel?.location,
            roomId: selectedRoom,
            roomName: selectedRoomData.name,
            roomImage: selectedRoomData.image,
            price: selectedRoomData.price,
            checkIn,
            checkOut,
            guests
          }
        });
      }
    }
  };
  
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 1;
  };
  
  const nights = calculateNights();
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading available rooms...</p>
        </div>
      </div>
    );
  }
  
  if (!hotel) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Hotel Not Found</h2>
          <p className="text-lg text-gray-600 mb-6">We couldn't find the hotel you're looking for.</p>
          <button 
            onClick={() => navigate('/hotels')}
            className="btn btn-primary"
            aria-label="Return to hotel search"
          >
            Browse Hotels
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Hotel Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full md:w-48 h-32 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
            />
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
              <div className="flex items-center text-gray-600 mb-2">
                <span className="text-lg">{hotel.location}</span>
                <div className="ml-4 flex items-center">
                  <Star size={18} className="text-yellow-500 mr-1" fill="currentColor" />
                  <span className="font-medium">{hotel.rating}</span>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-1" />
                <span>
                  {checkIn && checkOut
                    ? `${new Date(checkIn).toLocaleDateString()} - ${new Date(checkOut).toLocaleDateString()} · ${nights} ${nights > 1 ? 'nights' : 'night'}`
                    : 'Dates not selected'}
                </span>
                <span className="mx-2">•</span>
                <Users size={18} className="mr-1" />
                <span>{guests} {parseInt(guests) > 1 ? 'guests' : 'guest'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Select Your Room</h2>
          <p className="text-lg text-gray-600">
            Choose from our available rooms for your stay from {checkIn && new Date(checkIn).toLocaleDateString()} to {checkOut && new Date(checkOut).toLocaleDateString()}.
          </p>
        </div>
        
        {/* Room Selection */}
        <div className="space-y-6 mb-8">
          {rooms.map((room) => (
            <div 
              key={room.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
                selectedRoom === room.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
              }`}
              tabIndex={0}
            >
              <div className="md:flex">
                <div className="md:w-1/3 h-64 md:h-auto relative">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6 md:w-2/3 flex flex-col">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{room.name}</h3>
                        <div className="flex items-center mb-4">
                          <Users size={18} className="text-gray-500 mr-1" />
                          <span className="text-gray-600 mr-4">Up to {room.capacity} guests</span>
                          <Maximize2 size={18} className="text-gray-500 mr-1" />
                          <span className="text-gray-600">{room.size} sq ft</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl md:text-2xl font-bold text-blue-600">${room.price}</div>
                        <div className="text-gray-500">per night</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{room.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Bed Type</h4>
                      <p className="text-gray-600">{room.bedType}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Room Amenities</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        {room.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center">
                            {getAmenityIcon(amenity)}
                            <span className="ml-2 text-gray-600">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRoomSelect(room.id)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 text-lg ${
                        selectedRoom === room.id
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      aria-label={`Select ${room.name}`}
                      aria-pressed={selectedRoom === room.id}
                    >
                      {selectedRoom === room.id ? 'Selected' : 'Select Room'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Price Summary and Reservation Button */}
        {selectedRoom !== null && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reservation Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <div className="text-gray-600">Room:</div>
                <div className="font-medium">{rooms.find(r => r.id === selectedRoom)?.name}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-600">Check-in:</div>
                <div className="font-medium">{checkIn && new Date(checkIn).toLocaleDateString()}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-600">Check-out:</div>
                <div className="font-medium">{checkOut && new Date(checkOut).toLocaleDateString()}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-600">Duration:</div>
                <div className="font-medium">{nights} {nights > 1 ? 'nights' : 'night'}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-600">Guests:</div>
                <div className="font-medium">{guests}</div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold">
                  <div>Total Price:</div>
                  <div className="text-blue-600">
                    ${(rooms.find(r => r.id === selectedRoom)?.price || 0) * nights}
                  </div>
                </div>
                <div className="text-right text-gray-500 text-sm">
                  ${rooms.find(r => r.id === selectedRoom)?.price} x {nights} {nights > 1 ? 'nights' : 'night'}
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={proceedToPayment}
              className="btn btn-primary w-full text-lg"
              aria-label="Continue to payment"
            >
              Continue to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSelectionPage;