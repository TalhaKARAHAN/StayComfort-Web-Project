import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Settings, Bookmark, CreditCard, LogOut, Calendar, MapPin, Star, ChevronRight, ChevronDown } from 'lucide-react';
import { authService } from '../services/authService';
import { hotelService, type Hotel } from '../services/hotelService';

// Interface tanımlamaları
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  age: string;
  isEmailVerified: boolean;
  createdAt: string;
  lastLogin: string;
  savedHotels?: string[];
  paymentMethods?: PaymentMethod[];
  reservations?: Reservation[];
}

interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  isDefault: boolean;
}

interface Reservation {
  id: string;
  hotelName: string;
  location: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  image: string;
  price: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reservations');
  const [activeSubTab, setActiveSubTab] = useState('upcoming');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Kullanıcı state'leri
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [savedHotels, setSavedHotels] = useState<Hotel[]>([]);
  
  // Form state'leri
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    phone: currentUser?.phone || '',
    age: currentUser?.age || ''
  });
  
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    isDefault: false
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const user = authService.getCurrentUser();
        
        if (!user) {
          navigate('/login');
          return;
        }

        // Test için örnek otel verilerini ekleyelim
        const testHotels = hotelService.getAllHotels();
        setSavedHotels(testHotels);
        
        setReservations(user.reservations || []);
        setPaymentMethods(user.paymentMethods || []);
        
      } catch (err: any) {
        setError(err.message || 'Kullanıcı bilgileri yüklenirken bir hata oluştu');
        console.error('Hata:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!currentUser) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      const updatedUser = await authService.updateProfile(currentUser.id, profileForm);
      setCurrentUser(updatedUser);
      alert('Profil bilgileriniz güncellendi');
    } catch (err: any) {
      setError(err.message || 'Profil güncellenirken bir hata oluştu');
    }
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!currentUser) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      const newMethod = await authService.addPaymentMethod(currentUser.id, newPaymentMethod);
      setPaymentMethods([...paymentMethods, newMethod]);
      setNewPaymentMethod({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        isDefault: false
      });
      alert('Ödeme yöntemi eklendi');
    } catch (err: any) {
      setError(err.message || 'Ödeme yöntemi eklenirken bir hata oluştu');
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId: string) => {
    try {
      if (!currentUser) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      await authService.removePaymentMethod(currentUser.id, paymentMethodId);
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== paymentMethodId));
      alert('Ödeme yöntemi silindi');
    } catch (err: any) {
      setError(err.message || 'Ödeme yöntemi silinirken bir hata oluştu');
    }
  };

  const handleToggleSavedHotel = async (hotelId: string) => {
    try {
      if (!currentUser) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      await authService.toggleSavedHotel(currentUser.id, hotelId);
      setSavedHotels(savedHotels.filter(hotel => hotel.id !== hotelId));
      alert('Otel kaydedilenlerden kaldırıldı');
    } catch (err: any) {
      setError(err.message || 'Otel kaydedilenlerden kaldırılırken bir hata oluştu');
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      if (!currentUser) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      const updatedReservation = await authService.cancelReservation(currentUser.id, reservationId);
      setReservations(reservations.map(res => 
        res.id === reservationId ? updatedReservation : res
      ));
      alert('Rezervasyon iptal edildi');
    } catch (err: any) {
      setError(err.message || 'Rezervasyon iptal edilirken bir hata oluştu');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const filteredReservations = reservations.filter(
    reservation => reservation.status === activeSubTab
  );
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-sm font-medium">Yaklaşan</span>;
      case 'completed':
        return <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-sm font-medium">Tamamlanan</span>;
      case 'cancelled':
        return <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md text-sm font-medium">İptal Edilen</span>;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const calculateNights = (checkIn: string, checkOut: string) => {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hesabım</h1>
              <p className="mt-2 text-gray-600">Profilinizi ve tercihlerinizi yönetin</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">{currentUser?.firstName} {currentUser?.lastName}</p>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {currentUser?.firstName?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('reservations')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'reservations'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="mr-3 h-5 w-5" />
                  Rezervasyonlarım
                </button>

                <button
                  onClick={() => setActiveTab('saved')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'saved'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Bookmark className="mr-3 h-5 w-5" />
                  Kaydedilenler
                </button>

                <button
                  onClick={() => setActiveTab('payment')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'payment'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="mr-3 h-5 w-5" />
                  Ödeme Yöntemleri
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <UserIcon className="mr-3 h-5 w-5" />
                  Profil
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'settings'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Ayarlar
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Çıkış Yap
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Content Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeTab === 'reservations' && 'Rezervasyonlarım'}
                  {activeTab === 'saved' && 'Kaydedilen Oteller'}
                  {activeTab === 'payment' && 'Ödeme Yöntemleri'}
                  {activeTab === 'profile' && 'Profil Bilgileri'}
                  {activeTab === 'settings' && 'Ayarlar'}
                </h2>
              </div>

              {/* Content Body */}
              <div className="p-6">
                {/* Reservations Tab */}
                {activeTab === 'reservations' && (
                  <div>
                    <div className="flex space-x-4 mb-6">
                      <button
                        onClick={() => setActiveSubTab('upcoming')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                          activeSubTab === 'upcoming'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Yaklaşan
                      </button>
                      <button
                        onClick={() => setActiveSubTab('completed')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                          activeSubTab === 'completed'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Tamamlanan
                      </button>
                      <button
                        onClick={() => setActiveSubTab('cancelled')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                          activeSubTab === 'cancelled'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        İptal Edilen
                      </button>
                    </div>

                    <div className="space-y-4">
                      {filteredReservations.map((reservation) => (
                        <div key={reservation.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={reservation.image}
                                alt={reservation.hotelName}
                                className="h-20 w-20 object-cover rounded-lg"
                              />
                              <div>
                                <h3 className="font-medium text-gray-900">{reservation.hotelName}</h3>
                                <p className="text-sm text-gray-500 flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {reservation.location}
                                </p>
                                <p className="text-sm text-gray-500">{reservation.roomName}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              {getStatusLabel(reservation.status)}
                              <p className="mt-2 text-lg font-semibold text-gray-900">
                                {reservation.price} TL
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm">
                              <div>
                                <p className="text-gray-600">Giriş: {formatDate(reservation.checkIn)}</p>
                                <p className="text-gray-600">Çıkış: {formatDate(reservation.checkOut)}</p>
                              </div>
                              {reservation.status === 'upcoming' && (
                                <button
                                  onClick={() => handleCancelReservation(reservation.id)}
                                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition"
                                >
                                  Rezervasyonu İptal Et
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredReservations.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500">Rezervasyon bulunamadı.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Saved Hotels Tab */}
                {activeTab === 'saved' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedHotels.map((hotel) => (
                      <div key={hotel.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900">{hotel.name}</h3>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {hotel.location}
                          </p>
                          <div className="flex items-center mt-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="ml-1 text-sm text-gray-600">{hotel.rating}</span>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-900">
                              {hotel.price} TL
                            </span>
                            <button
                              onClick={() => handleToggleSavedHotel(hotel.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Bookmark className="h-5 w-5 fill-current" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {savedHotels.length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">Kaydedilen otel bulunamadı.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Payment Methods Tab */}
                {activeTab === 'payment' && (
                  <div>
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center">
                            <CreditCard className="h-8 w-8 text-blue-600 mr-4" />
                            <div>
                              <p className="font-medium text-gray-900">{method.cardHolder}</p>
                              <p className="text-sm text-gray-500">
                                **** **** **** {method.cardNumber.slice(-4)}
                              </p>
                              <p className="text-sm text-gray-500">Son Kullanma: {method.expiryDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {method.isDefault && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-600 text-sm rounded-md">
                                Varsayılan
                              </span>
                            )}
                            <button
                              onClick={() => handleRemovePaymentMethod(method.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Kartı Sil
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddPaymentMethod} className="mt-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Kart Numarası
                          </label>
                          <input
                            type="text"
                            value={newPaymentMethod.cardNumber}
                            onChange={(e) =>
                              setNewPaymentMethod({
                                ...newPaymentMethod,
                                cardNumber: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Kart Üzerindeki İsim
                          </label>
                          <input
                            type="text"
                            value={newPaymentMethod.cardHolder}
                            onChange={(e) =>
                              setNewPaymentMethod({
                                ...newPaymentMethod,
                                cardHolder: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Ad Soyad"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Son Kullanma Tarihi
                            </label>
                            <input
                              type="text"
                              value={newPaymentMethod.expiryDate}
                              onChange={(e) =>
                                setNewPaymentMethod({
                                  ...newPaymentMethod,
                                  expiryDate: e.target.value,
                                })
                              }
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="MM/YY"
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newPaymentMethod.isDefault}
                            onChange={(e) =>
                              setNewPaymentMethod({
                                ...newPaymentMethod,
                                isDefault: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-700">
                            Varsayılan kart olarak ayarla
                          </label>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          type="submit"
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Kartı Kaydet
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileUpdate}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Ad</label>
                          <input
                            type="text"
                            value={profileForm.firstName}
                            onChange={(e) =>
                              setProfileForm({ ...profileForm, firstName: e.target.value })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Soyad</label>
                          <input
                            type="text"
                            value={profileForm.lastName}
                            onChange={(e) =>
                              setProfileForm({ ...profileForm, lastName: e.target.value })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Telefon Numarası
                        </label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, phone: e.target.value })
                          }
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Yaş</label>
                        <input
                          type="number"
                          value={profileForm.age}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, age: e.target.value })
                          }
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Profili Güncelle
                      </button>
                    </div>
                  </form>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Bildirim Ayarları</h3>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-700">
                            E-posta bildirimleri
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-700">
                            SMS bildirimleri
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Dil ve Bölge</h3>
                      <div className="mt-4">
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                          <option>Türkçe</option>
                          <option>English</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Hesap Güvenliği</h3>
                      <div className="mt-4">
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Şifreyi Değiştir
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;