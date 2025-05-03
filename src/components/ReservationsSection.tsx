import React, { useState } from 'react';
import { User, Reservation } from '../types/user';
import { MapPin } from 'lucide-react';

interface ReservationsSectionProps {
  user: User;
  onUpdate: (user: User) => void;
}

const ReservationsSection: React.FC<ReservationsSectionProps> = ({ user, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  const filteredReservations = user.reservations?.filter((reservation: Reservation) => {
    switch (activeTab) {
      case 'upcoming':
        return reservation.status === 'active';
      case 'completed':
        return reservation.status === 'completed';
      case 'cancelled':
        return reservation.status === 'cancelled';
      default:
        return true;
    }
  });

  const today = new Date();
  const reservationsWithStatus = filteredReservations?.map(res => {
    if (res.status === 'active' && res.checkOut && new Date(res.checkOut) < today) {
      return { ...res, status: 'completed' as const };
    }
    return res;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Yaklaşan';
      case 'completed':
        return 'Tamamlanan';
      case 'cancelled':
        return 'İptal Edilen';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      const updatedReservations = user.reservations?.map(res => 
        res.id === reservationId ? { ...res, status: 'cancelled' as const } : res
      );
      
      const updatedUser = {
        ...user,
        reservations: updatedReservations
      };
      
      onUpdate(updatedUser);
    } catch (error) {
      console.error('Rezervasyon iptal edilirken hata:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Rezervasyonlarım</h2>
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Yaklaşan
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Tamamlanan
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'cancelled' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          İptal Edilen
        </button>
      </div>
      <div className="space-y-4 mt-4">
        {reservationsWithStatus && reservationsWithStatus.length > 0 ? (
          reservationsWithStatus.map((reservation: Reservation) => (
            <div key={reservation.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={reservation.image || '/placeholder-hotel.png'}
                    alt={reservation.hotelName}
                    className="h-24 w-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{reservation.hotelName}</h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {reservation.location}
                    </p>
                    <p className="text-base text-gray-600 mt-1">{reservation.roomName}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${reservation.status === 'cancelled' ? 'bg-red-50 text-red-600' : reservation.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{getStatusText(reservation.status)}</span>
                  <p className="text-2xl font-bold text-gray-900">{reservation.price ? `${reservation.price} TL` : '-'}</p>
                </div>
              </div>
              <hr className="my-4" />
              <div className="flex items-center justify-between text-base">
                <div>
                  <p className="text-gray-600">Giriş: {reservation.checkIn ? formatDate(reservation.checkIn) : 'Belirtilmedi'}</p>
                  <p className="text-gray-600">Çıkış: {reservation.checkOut ? formatDate(reservation.checkOut) : 'Belirtilmedi'}</p>
                </div>
                {reservation.status === 'active' && (
                  <button
                    onClick={() => handleCancelReservation(reservation.id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition"
                  >
                    Rezervasyonu İptal Et
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Bu kategoride rezervasyonunuz yok.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsSection; 