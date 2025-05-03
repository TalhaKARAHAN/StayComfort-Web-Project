import { User as UserType, PaymentMethod, Reservation } from '../types/user';
import { BaseHotel } from '../types/hotel';
import { updateUserSettings } from './userSettingsService';
import { hotelService } from './hotelService';

// Replace EventEmitter with a custom event system for browser compatibility
const authEvents = {
  listeners: [] as Array<(isLoggedIn: boolean) => void>,

  emit(event: 'authChange', isLoggedIn: boolean) {
    if (event === 'authChange') {
      this.listeners.forEach((listener) => listener(isLoggedIn));
    }
  },

  on(event: 'authChange', callback: (isLoggedIn: boolean) => void) {
    if (event === 'authChange') {
      this.listeners.push(callback);
    }
  },
};

interface User {
  id: string;
  email: string;
  password: string;
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

// Test kullanıcısı
const TEST_USER: User = {
  id: '1',
  email: 'test@test.com',
  password: '123456',
  firstName: 'Test',
  lastName: 'Kullanıcı',
  phone: '5551234567',
  age: '25',
  isEmailVerified: true,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  savedHotels: ['hotel1', 'hotel2', 'hotel3'],
  paymentMethods: [],
  reservations: []
};

// Kullanıcı state'ini senkronize tutmak için yardımcı fonksiyonlar
const getUserFromStorage = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return {
      ...user,
      savedHotels: user.savedHotels || [],
      paymentMethods: user.paymentMethods || [],
      reservations: user.reservations || []
    };
  } catch {
    return null;
  }
};

const updateUserInStorage = (user: User) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
  authEvents.emit('authChange', true);
};

export const authService = {
  // Kullanıcı kaydı
  register: (userData: Omit<User, 'id' | 'isEmailVerified' | 'createdAt' | 'lastLogin'>) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Email kontrolü
      if (users.some((u: User) => u.email === userData.email)) {
        throw { code: 'EMAIL_EXISTS', message: 'Bu email adresi zaten kullanımda' };
      }

      const newUser = {
        ...userData,
        id: Date.now().toString(),
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Kullanıcıyı otomatik olarak giriş yap
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      authEvents.emit('authChange', true);
      
      // Email doğrulama gönderimi simülasyonu
      console.log('Email doğrulama bağlantısı gönderildi');
      
      return newUser;
    } catch (error) {
      throw error;
    }
  },

  // Kullanıcı girişi
  login: (email: string, password: string) => {
    try {
      // Test kullanıcısı kontrolü
      if (email === TEST_USER.email && password === TEST_USER.password) {
        localStorage.setItem('currentUser', JSON.stringify(TEST_USER));
        authEvents.emit('authChange', true);
        return TEST_USER;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === email && u.password === password);
      
      if (!user) {
        throw { code: 'INVALID_CREDENTIALS', message: 'Geçersiz email veya şifre' };
      }

      // Son giriş zamanını güncelle
      user.lastLogin = new Date().toISOString();
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(user));
      authEvents.emit('authChange', true);
      
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Çıkış yapma
  logout: () => {
    try {
      localStorage.removeItem('currentUser');
      authEvents.emit('authChange', false);
    } catch (error) {
      throw { code: 'LOGOUT_ERROR', message: 'Çıkış yapılırken bir hata oluştu' };
    }
  },

  // Mevcut kullanıcıyı getirme
  getCurrentUser: () => {
    try {
      const user = getUserFromStorage();
      if (!user) return null;

      // Test kullanıcısı için özel kontrol
      if (user.id === TEST_USER.id) {
        return {
          ...TEST_USER,
          savedHotels: TEST_USER.savedHotels || [],
          paymentMethods: TEST_USER.paymentMethods || [],
          reservations: TEST_USER.reservations || []
        };
      }

      return {
        ...user,
        savedHotels: user.savedHotels || [],
        paymentMethods: user.paymentMethods || [],
        reservations: user.reservations || []
      };
    } catch (error) {
      console.error('Kullanıcı bilgileri alınırken bir hata oluştu:', error);
      return null;
    }
  },

  // Kullanıcı bilgilerini güncelleme
  updateUser: (userId: string, userData: Partial<User>) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw { code: 'USER_NOT_FOUND', message: 'Kullanıcı bulunamadı' };
      }

      const updatedUser = {
        ...currentUser,
        ...userData,
        reservations: userData.reservations !== undefined ? userData.reservations : currentUser.reservations
      };

      // Test kullanıcısı için özel kontrol
      if (userId === TEST_USER.id) {
        Object.assign(TEST_USER, userData);
        updateUserInStorage(TEST_USER);
        return TEST_USER;
      }

      updateUserInStorage(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  // Şifre sıfırlama
  requestPasswordReset: (email: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === email);
      
      if (!user) {
        throw { code: 'USER_NOT_FOUND', message: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı' };
      }

      // Şifre sıfırlama bağlantısı gönderimi simülasyonu
      console.log('Şifre sıfırlama bağlantısı gönderildi');
      
      return true;
    } catch (error) {
      throw error;
    }
  },

  onAuthChange: (callback: (isLoggedIn: boolean) => void) => {
    authEvents.on('authChange', callback);
  },

  // Kullanıcı profil bilgilerini güncelleme
  updateProfile: async (userId: string, data: Partial<User>) => {
    try {
      const currentUser = await getUserFromStorage();
      if (!currentUser || currentUser.id !== userId) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      // Test kullanıcısı için özel kontrol
      if (userId === TEST_USER.id) {
        const updatedUser = { ...TEST_USER, ...data };
        await updateUserInStorage(updatedUser);
        return updatedUser;
      }

      const updatedUser = await updateUserSettings(userId, data);
      if (!updatedUser) {
        throw new Error('Kullanıcı güncellenirken bir hata oluştu');
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  // Otel kaydetme/kayıt kaldırma
  toggleSavedHotel: (userId: string, hotelId: string) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw { code: 'USER_NOT_FOUND', message: 'Kullanıcı bulunamadı' };
      }
      if (!currentUser.savedHotels) {
        currentUser.savedHotels = [];
      }
      const hotelIndex = currentUser.savedHotels.indexOf(hotelId);
      if (hotelIndex === -1) {
        currentUser.savedHotels.push(hotelId);
      } else {
        currentUser.savedHotels.splice(hotelIndex, 1);
      }
      // Test kullanıcısı için özel kontrol
      if (userId === TEST_USER.id) {
        TEST_USER.savedHotels = currentUser.savedHotels;
        updateUserInStorage(TEST_USER);
        return TEST_USER.savedHotels;
      }
      // Normal kullanıcılar için localStorage güncelleme
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].savedHotels = currentUser.savedHotels;
        localStorage.setItem('users', JSON.stringify(users));
      }
      updateUserInStorage(currentUser);
      return currentUser.savedHotels;
    } catch (error) {
      throw error;
    }
  },

  // Ödeme yöntemi ekleme
  addPaymentMethod: async (userId: string, cardData: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
    try {
      const currentUser = getUserFromStorage();
      if (!currentUser || currentUser.id !== userId) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      const newCard: PaymentMethod = {
        ...cardData,
        id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      if (!currentUser.paymentMethods) {
        currentUser.paymentMethods = [];
      }

      if (cardData.isDefault) {
        currentUser.paymentMethods = currentUser.paymentMethods.map(card => ({
          ...card,
          isDefault: false
        }));
      }

      currentUser.paymentMethods.push(newCard);
      updateUserInStorage(currentUser);

      return newCard;
    } catch (error) {
      console.error('Ödeme yöntemi eklenirken hata:', error);
      throw error;
    }
  },

  // Ödeme yöntemi silme
  deletePaymentMethod: async (userId: string, cardId: string): Promise<void> => {
    try {
      const currentUser = getUserFromStorage();
      if (!currentUser || currentUser.id !== userId) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      if (!currentUser.paymentMethods) {
        throw new Error('Ödeme yöntemi bulunamadı');
      }

      currentUser.paymentMethods = currentUser.paymentMethods.filter(card => card.id !== cardId);
      updateUserInStorage(currentUser);
    } catch (error) {
      console.error('Ödeme yöntemi silinirken hata:', error);
      throw error;
    }
  },

  // Ödeme yöntemlerini getirme
  getPaymentMethods: async (userId: string): Promise<PaymentMethod[]> => {
    try {
      const currentUser = getUserFromStorage();
      if (!currentUser || currentUser.id !== userId) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }
      return currentUser.paymentMethods || [];
    } catch (error) {
      console.error('Ödeme yöntemleri getirilirken hata:', error);
      throw error;
    }
  },

  // Ödeme yöntemi güncelleme
  updatePaymentMethod: async (userId: string, cardId: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    try {
      const currentUser = getUserFromStorage();
      if (!currentUser || currentUser.id !== userId) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      if (!currentUser.paymentMethods) {
        throw new Error('Ödeme yöntemi bulunamadı');
      }

      const updatedCards = currentUser.paymentMethods.map(card => {
        if (card.id === cardId) {
          return { ...card, ...updates };
        }
        if (updates.isDefault) {
          return { ...card, isDefault: false };
        }
        return card;
      });

      currentUser.paymentMethods = updatedCards;
      updateUserInStorage(currentUser);

      const updatedCard = updatedCards.find(card => card.id === cardId);
      if (!updatedCard) {
        throw new Error('Kart bulunamadı');
      }

      return updatedCard;
    } catch (error) {
      console.error('Ödeme yöntemi güncellenirken hata:', error);
      throw error;
    }
  },

  // Kullanıcı ayarlarını güncelleme
  updateUserSettings: async (userId: string, settings: any) => {
    try {
      const currentUser = await getUserFromStorage();
      if (!currentUser || currentUser.id !== userId) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      const updatedUser = await updateUserSettings(userId, settings);
      if (!updatedUser) {
        throw new Error('Ayarlar güncellenirken bir hata oluştu');
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  // Kullanıcı rezervasyonunu iptal etme
  cancelReservation: async (userId: string, reservationId: string) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) throw new Error('Kullanıcı bulunamadı');
    const updatedReservations = (currentUser.reservations || []).map(res =>
      res.id === reservationId ? { ...res, status: 'cancelled' as const } : res
    );
    currentUser.reservations = updatedReservations;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return updatedReservations;
  },

  // Otel detaylarını ID'ler ile çek
  getSavedHotels: async (userId: string): Promise<BaseHotel[]> => {
    try {
      const currentUser = getUserFromStorage();
      if (!currentUser || currentUser.id !== userId) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }
      const savedHotels = hotelService.getHotelsByIds(currentUser.savedHotels || []);
      return savedHotels;
    } catch (error) {
      console.error('Kaydedilen oteller getirilirken hata:', error);
      throw error;
    }
  }
};