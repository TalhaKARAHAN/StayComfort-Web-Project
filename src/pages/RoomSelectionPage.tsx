import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Users, Check, Star, Coffee, Wifi, Tv, Wind, Bath, Maximize2, Calendar } from 'lucide-react';
import { hotelService } from '../services/hotelService';
import { authService } from '../services/authService';

interface Room {
  id: string;
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
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
}

const RoomSelectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get dates from location state
  const { state } = location;
  const checkIn = state?.checkIn || '';
  const checkOut = state?.checkOut || '';
  const guests = state?.guests || '2';
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login', { 
          state: { 
            returnUrl: location.pathname,
            checkIn,
            checkOut,
            guests 
          } 
        });
        return;
      }

      if (!checkIn || !checkOut) {
        navigate(`/hotels/${id}`, { replace: true });
        return;
      }

      try {
        setLoading(true);
        const hotelData = hotelService.getHotelById(id || '');
        if (hotelData) {
          setHotel({
            id: id || '1',
            name: hotelData.name,
            location: hotelData.location,
            image: hotelData.images[0],
            rating: hotelData.rating
          });

          const transformedRooms = hotelData.rooms.map(room => ({
            id: room.id,
            name: room.name,
            description: room.description,
            image: room.images[0],
            price: room.price,
            capacity: room.capacity,
            size: room.size,
            bedType: room.bedType,
            amenities: room.amenities,
            available: room.isAvailable
          }));

          setRooms(transformedRooms);
        }
      } catch (err) {
        setError('Otel bilgileri yüklenirken bir hata oluştu.');
        console.error('Error fetching hotel data:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [id, checkIn, checkOut, navigate, location.pathname]);
  
  const handleRoomSelect = async (roomId: string) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login', { 
          state: { 
            returnUrl: location.pathname,
            checkIn,
            checkOut,
            guests 
          } 
        });
        return;
      }
      
    setSelectedRoom(roomId);
      setError('');

      const summaryElement = document.getElementById('reservation-summary');
      if (summaryElement) {
        summaryElement.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setError('Oda seçimi yapılırken bir hata oluştu.');
      console.error('Error selecting room:', err);
    }
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
  
  const getAmenityLabel = (amenity: string) => {
    const translations: { [key: string]: string } = {
      'Free WiFi': 'Ücretsiz WiFi',
      'Ocean View': 'Deniz Manzarası',
      'Air Conditioning': 'Klima',
      'Flat-screen TV': 'Düz Ekran TV',
      'Mini Bar': 'Mini Bar',
      'Coffee Maker': 'Kahve Makinesi',
      'Separate Living Area': 'Ayrı Oturma Alanı',
      'Jacuzzi': 'Jakuzi',
      'Room Service': 'Oda Servisi',
      'wifi': 'Ücretsiz WiFi',
      'minibar': 'Mini Bar',
      'tv': 'Televizyon',
      'safe': 'Kasa',
      'aircon': 'Klima',
      'balcony': 'Balkon',
      'room-service': 'Oda Servisi'
    };
    return translations[amenity] || amenity;
  };

  const getBedTypeLabel = (bedType: string) => {
    const translations: { [key: string]: string } = {
      'King': 'King Size Yatak',
      '2 Double': 'İki Kişilik İki Yatak',
      '1 King & 2 Twin': 'Bir King Size ve İki Tek Kişilik Yatak',
      'double': 'Çift Kişilik Yatak',
      'king': 'King Size Yatak',
      'twin': 'İki Tek Kişilik Yatak',
      'single': 'Tek Kişilik Yatak'
    };
    return translations[bedType] || bedType;
  };
  
  const proceedToPayment = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login', { 
          state: { 
            returnUrl: location.pathname,
            checkIn,
            checkOut,
            guests 
          } 
        });
        return;
      }

      if (!checkIn || !checkOut) {
        setError('Lütfen tarih seçimi yapın');
        return;
      }

      if (!selectedRoom) {
        setError('Lütfen bir oda seçin');
        return;
      }

      const selectedRoomData = rooms.find(room => room.id === selectedRoom);
      
      if (!selectedRoomData) {
        setError('Seçilen oda bulunamadı');
        return;
      }

      if (!hotel) {
        setError('Otel bilgisi bulunamadı');
        return;
      }

      const pricePerNight = selectedRoomData.price;
      const totalPrice = pricePerNight * nights;

        navigate('/payment', {
          state: {
          bookingDetails: {
            hotelId: hotel.id,
            roomId: selectedRoom,
            checkIn,
            checkOut,
            totalPrice,
            guests: parseInt(guests)
          }
          }
        });
    } catch (err) {
      setError('Ödeme sayfasına yönlendirilirken bir hata oluştu.');
      console.error('Error proceeding to payment:', err);
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
          <p className="text-xl text-gray-600">Odalar yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  if (!hotel) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Otel Bulunamadı</h2>
          <p className="text-lg text-gray-600 mb-6">Aradığınız otel bulunamadı.</p>
          <button 
            onClick={() => navigate('/hotels')}
            className="btn btn-primary"
          >
            Otellere Dön
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

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
                    ? `${new Date(checkIn).toLocaleDateString('tr-TR')} - ${new Date(checkOut).toLocaleDateString('tr-TR')} · ${nights} ${nights > 1 ? 'gece' : 'gece'}`
                    : 'Tarih seçilmedi'}
                </span>
                <span className="mx-2">•</span>
                <Users size={18} className="mr-1" />
                <span>{guests} {parseInt(guests) > 1 ? 'misafir' : 'misafir'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Oda Seçimi</h2>
          <p className="text-lg text-gray-600">
            {checkIn && checkOut 
              ? `${new Date(checkIn).toLocaleDateString('tr-TR')} - ${new Date(checkOut).toLocaleDateString('tr-TR')} tarihleri için müsait odalar.`
              : 'Lütfen tarih seçimi yapın.'}
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
                          <span className="text-gray-600 mr-4">{room.capacity} misafire kadar</span>
                          <Maximize2 size={18} className="text-gray-500 mr-1" />
                          <span className="text-gray-600">{room.size} m²</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl md:text-2xl font-bold text-blue-600">₺{room.price}</div>
                        <div className="text-gray-500">gecelik</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{room.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Yatak Tipi</h4>
                      <p className="text-gray-600">{getBedTypeLabel(room.bedType)}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Oda Özellikleri</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {room.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center">
                            {getAmenityIcon(amenity)}
                            <span className="ml-2 text-gray-600">{getAmenityLabel(amenity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleRoomSelect(room.id)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 text-lg ${
                        selectedRoom === room.id
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {selectedRoom === room.id ? 'Seçildi' : 'Odayı Seç'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Price Summary and Reservation Button */}
        {selectedRoom !== null && (
          <div id="reservation-summary" className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Rezervasyon Özeti</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <div className="text-gray-600">Oda:</div>
                <div className="font-medium">{rooms.find(r => r.id === selectedRoom)?.name}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-600">Giriş:</div>
                <div className="font-medium">{checkIn && new Date(checkIn).toLocaleDateString('tr-TR')}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-600">Çıkış:</div>
                <div className="font-medium">{checkOut && new Date(checkOut).toLocaleDateString('tr-TR')}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-600">Süre:</div>
                <div className="font-medium">{nights} {nights > 1 ? 'gece' : 'gece'}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-600">Misafir:</div>
                <div className="font-medium">{guests} {parseInt(guests) > 1 ? 'misafir' : 'misafir'}</div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold">
                  <div>Toplam Tutar:</div>
                  <div className="text-blue-600">
                    ₺{(rooms.find(r => r.id === selectedRoom)?.price || 0) * nights}
                  </div>
                </div>
                <div className="text-right text-gray-500 text-sm">
                  ₺{rooms.find(r => r.id === selectedRoom)?.price} x {nights} {nights > 1 ? 'gece' : 'gece'}
                </div>
              </div>
            </div>
            
            <button
              onClick={proceedToPayment}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Ödemeye Geç
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSelectionPage;