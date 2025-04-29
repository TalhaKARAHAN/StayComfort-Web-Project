import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Bookmark, CreditCard, LogOut, Calendar, MapPin, Star, Mail, Phone, ChevronRight, ChevronDown } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('reservations');
  const [activeSubTab, setActiveSubTab] = useState('upcoming');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    // Simulated API call to get user data
    setTimeout(() => {
      const mockReservations: Reservation[] = [
        {
          id: 'RES123456',
          hotelName: 'Luxury Ocean Resort',
          location: 'Miami, FL',
          roomName: 'Deluxe Ocean View Room',
          checkIn: '2025-07-15',
          checkOut: '2025-07-18',
          image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          price: 299,
          status: 'upcoming'
        },
        {
          id: 'RES789012',
          hotelName: 'Mountain View Lodge',
          location: 'Aspen, CO',
          roomName: 'Premium Suite',
          checkIn: '2025-08-10',
          checkOut: '2025-08-15',
          image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          price: 199,
          status: 'upcoming'
        },
        {
          id: 'RES345678',
          hotelName: 'Urban Boutique Hotel',
          location: 'New York, NY',
          roomName: 'Standard Double Room',
          checkIn: '2025-01-05',
          checkOut: '2025-01-08',
          image: 'https://images.pexels.com/photos/2869215/pexels-photo-2869215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          price: 249,
          status: 'completed'
        },
        {
          id: 'RES901234',
          hotelName: 'Beachfront Paradise Resort',
          location: 'Honolulu, HI',
          roomName: 'Family Suite',
          checkIn: '2024-12-20',
          checkOut: '2024-12-27',
          image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          price: 399,
          status: 'cancelled'
        }
      ];
      
      setReservations(mockReservations);
      setLoading(false);
    }, 1000);
  }, []);
  
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
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Hesabım</h1>
          <p className="text-lg text-gray-600">Profilinizi, rezervasyonlarınızı ve tercihlerinizi yönetin.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 bg-blue-600 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                    <User size={32} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">John Doe</h2>
                    <p className="text-blue-100">Premium Üye</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <button
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                        activeTab === 'reservations'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab('reservations')}
                      aria-current={activeTab === 'reservations' ? 'page' : undefined}
                    >
                      <Calendar size={20} />
                      <span>Rezervasyonlarım</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                        activeTab === 'profile'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab('profile')}
                      aria-current={activeTab === 'profile' ? 'page' : undefined}
                    >
                      <User size={20} />
                      <span>Profil Bilgileri</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                        activeTab === 'saved'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab('saved')}
                      aria-current={activeTab === 'saved' ? 'page' : undefined}
                    >
                      <Bookmark size={20} />
                      <span>Kaydedilen Oteller</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                        activeTab === 'payment'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab('payment')}
                      aria-current={activeTab === 'payment' ? 'page' : undefined}
                    >
                      <CreditCard size={20} />
                      <span>Ödeme Yöntemleri</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                        activeTab === 'settings'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab('settings')}
                      aria-current={activeTab === 'settings' ? 'page' : undefined}
                    >
                      <Settings size={20} />
                      <span>Hesap Ayarları</span>
                    </button>
                  </li>
                </ul>
                
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                    aria-label="Hesabınızdan çıkış yapın"
                  >
                    <LogOut size={20} />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden mb-4 bg-white rounded-xl shadow-md p-4">
            <button
              onClick={toggleMobileMenu}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg text-gray-800 transition"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Menü navigasyonunu aç/kapat"
            >
              <div className="flex items-center">
                <User size={20} className="mr-2" />
                <span className="font-medium">Hesap Menüsü</span>
              </div>
              {isMenuOpen ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
            
            {isMenuOpen && (
              <nav id="mobile-menu" className="mt-2 border-t border-gray-200 pt-2">
                <ul className="space-y-1">
                  <li>
                    <button
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                        activeTab === 'reservations'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setActiveTab('reservations');
                        setIsMenuOpen(false);
                      }}
                      aria-current={activeTab === 'reservations' ? 'page' : undefined}
                    >
                      <Calendar size={20} />
                      <span>Rezervasyonlarım</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                        activeTab === 'profile'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setActiveTab('profile');
                        setIsMenuOpen(false);
                      }}
                      aria-current={activeTab === 'profile' ? 'page' : undefined}
                    >
                      <User size={20} />
                      <span>Profil Bilgileri</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                        activeTab === 'saved'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setActiveTab('saved');
                        setIsMenuOpen(false);
                      }}
                      aria-current={activeTab === 'saved' ? 'page' : undefined}
                    >
                      <Bookmark size={20} />
                      <span>Kaydedilen Oteller</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                        activeTab === 'payment'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setActiveTab('payment');
                        setIsMenuOpen(false);
                      }}
                      aria-current={activeTab === 'payment' ? 'page' : undefined}
                    >
                      <CreditCard size={20} />
                      <span>Ödeme Yöntemleri</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                        activeTab === 'settings'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setActiveTab('settings');
                        setIsMenuOpen(false);
                      }}
                      aria-current={activeTab === 'settings' ? 'page' : undefined}
                    >
                      <Settings size={20} />
                      <span>Hesap Ayarları</span>
                    </button>
                  </li>
                  <li className="pt-2 mt-2 border-t border-gray-200">
                    <button
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                      aria-label="Hesabınızdan çıkış yapın"
                    >
                      <LogOut size={20} />
                      <span>Çıkış Yap</span>
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <div>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="border-b border-gray-200">
                    <nav className="flex overflow-x-auto" aria-label="Rezervasyon sekmeleri">
                      <button
                        className={`px-6 py-4 text-lg font-medium transition-colors ${
                          activeSubTab === 'upcoming'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setActiveSubTab('upcoming')}
                        aria-current={activeSubTab === 'upcoming' ? 'page' : undefined}
                      >
                        Yaklaşan
                      </button>
                      <button
                        className={`px-6 py-4 text-lg font-medium transition-colors ${
                          activeSubTab === 'completed'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setActiveSubTab('completed')}
                        aria-current={activeSubTab === 'completed' ? 'page' : undefined}
                      >
                        Tamamlanan
                      </button>
                      <button
                        className={`px-6 py-4 text-lg font-medium transition-colors ${
                          activeSubTab === 'cancelled'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setActiveSubTab('cancelled')}
                        aria-current={activeSubTab === 'cancelled' ? 'page' : undefined}
                      >
                        İptal Edilen
                      </button>
                    </nav>
                  </div>
                  
                  <div className="p-6">
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
                      </div>
                    ) : filteredReservations.length > 0 ? (
                      <div className="space-y-6">
                        {filteredReservations.map((reservation) => (
                          <div
                            key={reservation.id}
                            className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md"
                          >
                            <div className="md:flex">
                              <div className="md:w-1/4 h-48 md:h-auto relative">
                                <img
                                  src={reservation.image}
                                  alt={reservation.hotelName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              <div className="p-6 md:w-3/4 flex flex-col">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                  <div>
                                    <div className="flex items-start">
                                      <h3 className="text-xl font-bold text-gray-900 mr-3">{reservation.hotelName}</h3>
                                      {getStatusLabel(reservation.status)}
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600 mt-1">
                                      <MapPin size={16} className="mr-1" />
                                      <span>{reservation.location}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 md:mt-0 text-right">
                                    <div className="text-gray-600">Onay Numarası:</div>
                                    <div className="font-medium">{reservation.id}</div>
                                  </div>
                                </div>
                                
                                <div className="flex-1">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <div className="text-gray-600">Oda Türü:</div>
                                      <div className="font-medium">{reservation.roomName}</div>
                                    </div>
                                    
                                    <div>
                                      <div className="text-gray-600">Süre:</div>
                                      <div className="font-medium">
                                        {calculateNights(reservation.checkIn, reservation.checkOut)} gece
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <div className="text-gray-600">Giriş:</div>
                                      <div className="font-medium">{formatDate(reservation.checkIn)}</div>
                                    </div>
                                    
                                    <div>
                                      <div className="text-gray-600">Çıkış:</div>
                                      <div className="font-medium">{formatDate(reservation.checkOut)}</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                  {reservation.status === 'upcoming' && (
                                    <>
                                      <button className="btn btn-outline">
                                        Değiştir
                                      </button>
                                      <button className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50">
                                        İptal Et
                                      </button>
                                    </>
                                  )}
                                  
                                  <Link to={`/reservation-summary?id=${reservation.id}`} className="btn btn-primary">
                                    Detayları Görüntüle
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Rezervasyon bulunamadı</h3>
                        <p className="text-gray-600 mb-6">
                          {activeSubTab === 'upcoming' 
                            ? "Yaklaşan rezervasyonunuz yok." 
                            : activeSubTab === 'completed'
                              ? "Henüz tamamlanmış konaklamanız yok."
                              : "İptal edilen rezervasyonunuz yok."}
                        </p>
                        <Link to="/search" className="btn btn-primary">
                          Konaklama Rezervasyonu Yap
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profil Bilgileri</h2>
                
                <form className="space-y-6">
                  <div className="flex flex-col md:flex-row items-center mb-6 pb-6 border-b border-gray-200">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                      <User size={40} className="text-gray-500" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-medium text-gray-900">John Doe</h3>
                      <p className="text-gray-500">Ocak 2023'ten beri üye</p>
                      <button className="btn btn-outline mt-3">
                        Fotoğrafı Değiştir
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-lg font-medium text-gray-700 mb-1">
                        Ad
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        defaultValue="John"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-lg font-medium text-gray-700 mb-1">
                        Soyad
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        defaultValue="Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-1">
                        E-posta Adresi
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          id="email"
                          defaultValue="john.doe@example.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-1">
                        Telefon Numarası
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="tel"
                          id="phone"
                          defaultValue="(555) 123-4567"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-lg font-medium text-gray-700 mb-1">
                      Adres
                    </label>
                    <input
                      type="text"
                      id="address"
                      defaultValue="123 Main Street"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="col-span-2">
                      <label htmlFor="city" className="block text-lg font-medium text-gray-700 mb-1">
                        Şehir
                      </label>
                      <input
                        type="text"
                        id="city"
                        defaultValue="New York"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-lg font-medium text-gray-700 mb-1">
                        Eyalet
                      </label>
                      <input
                        type="text"
                        id="state"
                        defaultValue="NY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zip" className="block text-lg font-medium text-gray-700 mb-1">
                        Posta Kodu
                      </label>
                      <input
                        type="text"
                        id="zip"
                        defaultValue="10001"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button type="submit" className="btn btn-primary btn-lg">
                      Değişiklikleri Kaydet
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Saved Hotels Tab */}
            {activeTab === 'saved' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Kaydedilen Oteller</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      id: 1,
                      name: "Luxury Ocean Resort",
                      location: "Miami, FL",
                      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                      price: 299,
                      rating: 4.8
                    },
                    {
                      id: 2,
                      name: "Mountain View Lodge",
                      location: "Aspen, CO",
                      image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                      price: 199,
                      rating: 4.6
                    }
                  ].map((hotel) => (
                    <div key={hotel.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all">
                      <div className="relative h-48">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                          aria-label={`Kaydedilen otellerden ${hotel.name} kaldır`}
                        >
                          <Bookmark size={20} className="text-blue-600" fill="currentColor" />
                        </button>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
                            <div className="flex items-center text-gray-600">
                              <MapPin size={16} className="mr-1" />
                              <span>{hotel.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-500 mr-1" fill="currentColor" />
                            <span className="font-medium">{hotel.rating}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold text-blue-600">${hotel.price}</span>
                            <span className="text-gray-500 ml-1">gecelik</span>
                          </div>
                          <Link to={`/hotels/${hotel.id}`} className="btn btn-primary">
                            Detayları Görüntüle
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ödeme Yöntemleri</h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-blue-100 rounded mr-4"></div>
                        <div>
                          <p className="font-medium">Visa sonu 4242</p>
                          <p className="text-gray-500 text-sm">Son kullanma tarihi 12/2025</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-sm font-medium mr-3">Varsayılan</span>
                        <button className="text-gray-500 hover:text-gray-700">
                          <Settings size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-red-100 rounded mr-4"></div>
                        <div>
                          <p className="font-medium">Mastercard sonu 8888</p>
                          <p className="text-gray-500 text-sm">Son kullanma tarihi 10/2024</p>
                        </div>
                      </div>
                      <div>
                        <button className="text-gray-500 hover:text-gray-700">
                          <Settings size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button className="btn btn-outline w-full flex items-center justify-center">
                    <CreditCard size={20} className="mr-2" />
                    <span>Yeni Ödeme Yöntemi Ekle</span>
                  </button>
                </div>
              </div>
            )}
            
            {/* Account Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Hesap Ayarları</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-4">Şifre</h3>
                    <button className="btn btn-outline">
                      Şifreyi Değiştir
                    </button>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">Bildirimler</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">E-posta Bildirimleri</p>
                          <p className="text-gray-500 text-sm">Rezervasyon onayları ve güncellemeler alın</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS Bildirimleri</p>
                          <p className="text-gray-500 text-sm">Önemli güncellemeler için kısa mesajlar alın</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Özel Teklifler</p>
                          <p className="text-gray-500 text-sm">Özel fırsatlar ve promosyonlar alın</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">Gizlilik ve Güvenlik</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">İki Faktörlü Kimlik Doğrulama</p>
                          <p className="text-gray-500 text-sm">Hesabınıza ekstra bir güvenlik katmanı ekleyin</p>
                        </div>
                        <button className="btn btn-outline">
                          Etkinleştir
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Gizlilik Ayarları</p>
                          <p className="text-gray-500 text-sm">Bilgilerinizin nasıl kullanıldığını yönetin</p>
                        </div>
                        <button className="btn btn-outline">
                          Yönet
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-medium text-red-600 mb-4">Hesabı Sil</h3>
                    <p className="text-gray-600 mb-4">
                      Hesabınızı sildikten sonra geri dönüş yoktur. Lütfen emin olun.
                    </p>
                    <button className="btn btn-outline border-red-300 text-red-600 hover:bg-red-50">
                      Hesabımı Sil
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;