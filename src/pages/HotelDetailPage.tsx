import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Coffee, Wifi, Car, Utensils, Building2, Check, AlertCircle } from 'lucide-react';
import { HotelDetails } from '../types/hotel';
import { hotelService } from '../services/hotelService';
import { authService } from '../services/authService';
import { User } from '../types/user';

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [saved, setSaved] = useState<boolean>(false);
  
  useEffect(() => {
    setLoading(true);
    const hotelData = hotelService.getHotelById(id || '');
    setHotel(hotelData);
    setLoading(false);
  }, [id]);
  
  useEffect(() => {
    if (user && hotel) {
      setSaved(user.savedHotels?.includes(hotel.id) ?? false);
    }
  }, [user, hotel]);
  
  const handleDateChange = (date: string, type: 'checkIn' | 'checkOut') => {
    setError('');
    if (type === 'checkIn') {
      setCheckIn(date);
      // Eğer check-out tarihi check-in tarihinden önceyse veya aynıysa, check-out tarihini temizle
      if (checkOut && new Date(date) >= new Date(checkOut)) {
        setCheckOut('');
      }
    } else {
      setCheckOut(date);
    }
  };

  const handleGuestsChange = (value: string) => {
    setError('');
    setGuests(value);
  };
  
  const handleViewRooms = () => {
    if (!checkIn || !checkOut) {
      setError('Lütfen giriş ve çıkış tarihlerini seçin');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate < today) {
      setError('Giriş tarihi bugünden önce olamaz');
      return;
    }

    if (checkOutDate <= checkInDate) {
      setError('Çıkış tarihi giriş tarihinden sonra olmalıdır');
      return;
    }

    // Tüm kontroller başarılı, odalar sayfasına yönlendir
    navigate(`/hotels/${id}/rooms`, {
      state: {
        checkIn,
        checkOut,
        guests
      }
    });
  };
  
  const handleToggleSavedHotel = async () => {
    if (!user || !hotel) return;
    await authService.toggleSavedHotel(user.id, hotel.id);
    const updatedUser = await authService.getCurrentUser();
    setUser(updatedUser);
    setSaved(updatedUser?.savedHotels?.includes(hotel.id) ?? false);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Otel bilgileri yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!hotel) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Otel bulunamadı</h2>
            <p className="text-lg text-gray-600 mb-6">
              Aradığınız otel bulunamadı veya kaldırılmış olabilir.
            </p>
            <button
              onClick={() => navigate('/hotels')}
              className="btn btn-primary"
            >
              Otellere Dön
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Hotel Header */}
        <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
            <img
            src={hotel.images[0]}
            alt={hotel.name}
              className="w-full h-full object-cover"
            />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
            <div className="flex items-center text-lg">
              <MapPin size={20} className="mr-2" />
              <span>{hotel.location}</span>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <Star size={20} className="mr-1" fill="currentColor" />
                <span>{hotel.rating}</span>
              </div>
            </div>
          </div>
          <button
            className={`absolute top-4 right-4 px-4 py-2 rounded-full transition-colors ${
              saved
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'
            }`}
            onClick={handleToggleSavedHotel}
          >
            <Star size={20} className="inline-block mr-2" fill={saved ? 'yellow' : 'none'} />
            {saved ? 'Kaydedildi' : 'Kaydet'}
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
              {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md mb-8">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-4 text-lg font-medium ${
                    activeTab === 'about'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('about')}
                >
                  Hakkında
                </button>
                <button
                  className={`flex-1 py-4 text-lg font-medium ${
                    activeTab === 'amenities'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('amenities')}
                >
                  Olanaklar
                </button>
                <button
                  className={`flex-1 py-4 text-lg font-medium ${
                    activeTab === 'reviews'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Değerlendirmeler
                </button>
                    <button
                  className={`flex-1 py-4 text-lg font-medium ${
                    activeTab === 'policies'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                  onClick={() => setActiveTab('policies')}
                    >
                  Politikalar
                    </button>
              </div>
              
              <div className="p-6">
                {activeTab === 'about' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Otel Hakkında</h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-8">
                      {hotel.longDescription}
                    </p>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Otel Olanakları</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="flex items-center">
                        <Wifi size={24} className="text-blue-600 mr-3" />
                        <span>Ücretsiz WiFi</span>
                    </div>
                      <div className="flex items-center">
                        <Car size={24} className="text-blue-600 mr-3" />
                        <span>Otopark</span>
                  </div>
                      <div className="flex items-center">
                        <Coffee size={24} className="text-blue-600 mr-3" />
                        <span>Kahvaltı</span>
                </div>
                      <div className="flex items-center">
                        <Utensils size={24} className="text-blue-600 mr-3" />
                        <span>Restoran</span>
                      </div>
                      <div className="flex items-center">
                        <Check size={24} className="text-blue-600 mr-3" />
                        <span>Spa</span>
                  </div>
                      <div className="flex items-center">
                        <Building2 size={24} className="text-blue-600 mr-3" />
                        <span>Fitness Merkezi</span>
                </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Misafir Değerlendirmeleri</h2>
                      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center">
                        <Star size={20} className="mr-2" fill="currentColor" />
                        <span className="font-semibold">{hotel.rating}/5</span>
                      </div>
                    </div>
                  <div className="space-y-6">
                      {hotel.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">
                                {review.userName.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{review.userName}</h3>
                                <p className="text-sm text-gray-500">{review.date}</p>
                              </div>
                              </div>
                              <div className="flex items-center">
                              <Star size={16} className="text-yellow-400" fill="currentColor" />
                                <span className="ml-1 font-medium">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {activeTab === 'policies' && (
                  <div className="space-y-6">
                    {hotel.policies.map((policy, index) => (
                      <div
                        key={index}
                        className={`bg-white rounded-xl shadow-sm p-6 ${
                          policy.isImportant ? 'border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {policy.title}
                        </h3>
                        <p className="text-gray-600 whitespace-pre-line">{policy.details}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Booking Card */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold text-blue-600">₺{hotel.rooms[0]?.price || 0}</div>
                <div className="text-gray-500">gecelik</div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giriş Tarihi
                  </label>
                    <input
                      type="date"
                      value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(e.target.value, 'checkIn')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Çıkış Tarihi
                  </label>
                    <input
                      type="date"
                      value={checkOut}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(e.target.value, 'checkOut')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Misafir Sayısı
                  </label>
                    <select
                      value={guests}
                    onChange={(e) => handleGuestsChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    <option value="1">1 Misafir</option>
                    <option value="2">2 Misafir</option>
                    <option value="3">3 Misafir</option>
                    <option value="4">4 Misafir</option>
                    </select>
                  </div>
                </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                  <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
                
                <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleViewRooms}
              >
                Odaları Görüntüle
                </button>
                
              <p className="text-center text-sm text-gray-500 mt-4">
                Şimdi rezervasyon yapın, sonra ödeyin
              </p>

              <div className="mt-6 space-y-2">
                <div className="flex items-center text-green-600">
                  <Check size={20} className="mr-2" />
                  <span>En iyi fiyat garantisi</span>
                </div>
                <div className="flex items-center text-green-600">
                  <Check size={20} className="mr-2" />
                  <span>Ücretsiz iptal</span>
                </div>
                <div className="flex items-center text-green-600">
                  <Check size={20} className="mr-2" />
                  <span>Rezervasyon ücreti yok</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailPage;