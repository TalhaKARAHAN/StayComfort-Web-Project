import { Reservation } from '../types/user';

class BookingService {
  async createBooking(booking: Omit<Reservation, 'id'>) {
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Rezervasyonu localStorage'a ekle
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        const newReservation = {
          ...booking,
          id: `booking_${Date.now()}`
        };
        
        if (!currentUser.reservations) {
          currentUser.reservations = [];
        }
        
        currentUser.reservations.push(newReservation);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return newReservation;
      }
      throw new Error('Kullanıcı bulunamadı');
    } catch (error) {
      console.error('Rezervasyon oluşturulurken hata:', error);
      throw error;
    }
  }

  async getBookings(userId: string): Promise<Reservation[]> {
    try {
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        return currentUser.reservations || [];
      }
      return [];
    } catch (error) {
      console.error('Rezervasyonlar getirilirken hata:', error);
      return [];
    }
  }

  async cancelBooking(userId: string, bookingId: string): Promise<void> {
    try {
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.reservations) {
          currentUser.reservations = currentUser.reservations.map((res: Reservation) =>
            res.id === bookingId ? { ...res, status: 'cancelled' as const } : res
          );
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
      }
    } catch (error) {
      console.error('Rezervasyon iptal edilirken hata:', error);
      throw error;
    }
  }
}

export const bookingService = new BookingService(); 