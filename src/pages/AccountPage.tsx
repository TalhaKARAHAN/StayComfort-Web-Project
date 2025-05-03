import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Bookmark, CreditCard, User, Settings } from 'lucide-react';
import { authService } from '../services/authService';
import { hotelService } from '../services/hotelService';
import ReservationsSection from '../components/ReservationsSection';
import SavedHotelsSection from '../components/SavedHotelsSection';
import PaymentMethodsSection from '../components/PaymentMethodsSection';
import ProfileSection from '../components/ProfileSection';
import SettingsSection from '../components/SettingsSection';

const AccountPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'reservations' | 'saved' | 'payment' | 'profile' | 'settings'>(
    location.state?.activeTab || 'reservations'
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    // Update active tab when location state changes
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleUpdateUser = async (updatedData: any) => {
    try {
      if (user) {
        const updatedUser = await authService.updateUser(user.id, updatedData);
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleRemoveSavedHotel = async (hotelId: string) => {
    try {
      if (user) {
        await authService.toggleSavedHotel(user.id, hotelId);
        const updatedUser = authService.getCurrentUser();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error removing saved hotel:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const savedHotelDetails = hotelService.getHotelsByIds(user.savedHotels || []);

  const tabs = [
    {
      id: 'reservations',
      label: 'Rezervasyonlarım',
      icon: Calendar
    },
    {
      id: 'saved',
      label: 'Kaydedilenler',
      icon: Bookmark
    },
    {
      id: 'payment',
      label: 'Ödeme Yöntemleri',
      icon: CreditCard
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User
    },
    {
      id: 'settings',
      label: 'Ayarlar',
      icon: Settings
    }
  ];

  const renderSection = () => {
    switch (activeTab) {
      case 'reservations':
        return <ReservationsSection user={user} onUpdate={handleUpdateUser} />;
      case 'saved':
        return <SavedHotelsSection hotels={savedHotelDetails} onRemoveHotel={handleRemoveSavedHotel} />;
      case 'payment':
        return <PaymentMethodsSection user={user} onUpdate={handleUpdateUser} />;
      case 'profile':
        return <ProfileSection user={user} onUpdate={handleUpdateUser} />;
      case 'settings':
        return <SettingsSection user={user} onUpdate={handleUpdateUser} onLogout={handleLogout} />;
      default:
        return <ReservationsSection user={user} onUpdate={handleUpdateUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-12">
              {/* Sidebar */}
              <div className="col-span-12 md:col-span-3 border-r border-gray-200">
                <nav className="p-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-2 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Main Content */}
              <div className="col-span-12 md:col-span-9">
                {renderSection()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 