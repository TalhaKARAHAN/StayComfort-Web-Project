import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User } from '../types/user';
import UserDashboardHeader from '../components/UserDashboardHeader';
import UserProfileSection from '../components/UserProfileSection';
import UserPaymentSection from '../components/UserPaymentSection';
import UserSettingsSection from '../components/UserSettingsSection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SavedHotelsSection from '../components/SavedHotelsSection';
import { hotelService } from '../services/hotelService';
import { BaseHotel } from '../types/hotel';
import { Reservation, PaymentMethod } from '../types/user';
import ReservationsSection from '../components/ReservationsSection';

const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'profile' | 'payment' | 'settings' | 'saved' | 'reservations'>('profile');
  const [savedHotels, setSavedHotels] = useState<BaseHotel[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  useEffect(() => {
    const loadUserData = () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!user || !user.id) {
        navigate('/login');
        return;
      }
      setUser(user);
      setSavedHotels(hotelService.getHotelsByIds(user.savedHotels || []));
      setReservations(user.reservations || []);
      setPaymentMethods(user.paymentMethods || []);
      setLoading(false);
    };

    loadUserData();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      setReservations(user.reservations || []);
    }
  }, [user]);

  const handleUpdateUser = async (updatedData: Partial<User>) => {
    try {
      if (!user) return;
      const updatedUser = await authService.updateUser(user.id, updatedData);
      setUser(updatedUser);
    } catch (err) {
      setError('Kullanıcı bilgileri güncellenirken bir hata oluştu.');
      console.error('Kullanıcı güncellenirken hata:', err);
    }
  };

  const handleToggleSavedHotel = async (hotelId: string) => {
    try {
      if (!user) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }
      await authService.toggleSavedHotel(user.id, hotelId);
      const updatedUser = await authService.getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
        setSavedHotels(hotelService.getHotelsByIds(updatedUser.savedHotels || []));
      }
    } catch (err: any) {
      setError(err.message || 'Otel kaydedilirken bir hata oluştu');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <UserProfileSection user={user} onUpdate={handleUpdateUser} />;
      case 'payment':
        return <UserPaymentSection user={user} onUpdate={handleUpdateUser} />;
      case 'settings':
        return <UserSettingsSection user={user} onUpdate={handleUpdateUser} />;
      case 'saved':
        return (
          <SavedHotelsSection
            savedHotels={savedHotels}
            onRemoveHotel={(hotel) => handleToggleSavedHotel(hotel.id)}
          />
        );
      case 'reservations':
        return <ReservationsSection user={user!} onUpdate={setUser} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
      <UserDashboardHeader user={user} />
        
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="col-span-3">
          <nav className="space-y-1">
            {[
              { id: 'reservations', label: 'Rezervasyonlarım', icon: 'calendar' },
              { id: 'saved', label: 'Kaydedilenler', icon: 'bookmark' },
              { id: 'payment', label: 'Ödeme Yöntemleri', icon: 'credit-card' },
              { id: 'profile', label: 'Profil', icon: 'user' },
              { id: 'settings', label: 'Ayarlar', icon: 'cog' }
            ].map((item) => (
                    <button
                key={item.id}
                onClick={() => setActiveSection(item.id as typeof activeSection)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                      }`}
              >
                <span className="truncate">{item.label}</span>
                    </button>
            ))}
                    </nav>
                  </div>
                  
        {/* Ana İçerik */}
        <div className="col-span-9">
          <div className="bg-white rounded-lg shadow-sm">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;