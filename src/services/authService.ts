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
  savedHotels: [],
  paymentMethods: [],
  reservations: [
    {
      id: 'RES123456',
      hotelName: 'Luxury Ocean Resort',
      location: 'Miami, FL',
      roomName: 'Deluxe Ocean View Room',
      checkIn: '2025-07-15',
      checkOut: '2025-07-18',
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
      price: 299,
      status: 'upcoming'
    }
  ]
};

// Kullanıcı state'ini senkronize tutmak için yardımcı fonksiyonlar
const updateLocalStorage = (user: User) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
  authEvents.emit('authChange', true);
};

const getLocalStorageUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
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
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
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

      if (!user.isEmailVerified) {
        throw { code: 'EMAIL_NOT_VERIFIED', message: 'Lütfen email adresinizi doğrulayın' };
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
      const user = getLocalStorageUser();
      if (!user) return null;

      // Test kullanıcısı için özel kontrol
      if (user.id === TEST_USER.id) {
        return TEST_USER;
      }

      return user;
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

      const updatedUser = { ...currentUser, ...userData };
      
      // Test kullanıcısı için özel kontrol
      if (userId === TEST_USER.id) {
        Object.assign(TEST_USER, userData);
        updateLocalStorage(TEST_USER);
        return TEST_USER;
      }

      updateLocalStorage(updatedUser);
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
  updateProfile: (userId: string, data: Partial<User>) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === userId);
      
      if (userIndex === -1) {
        throw { code: 'USER_NOT_FOUND', message: 'Kullanıcı bulunamadı' };
      }

      // Hassas bilgileri güncelleme dışında tut
      const { password, isEmailVerified, createdAt, ...updateData } = data;
      
      users[userIndex] = { ...users[userIndex], ...updateData };
      localStorage.setItem('users', JSON.stringify(users));
      
      if (users[userIndex].id === TEST_USER.id) {
        Object.assign(TEST_USER, updateData);
      }

      return users[userIndex];
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
        updateLocalStorage(TEST_USER);
        return TEST_USER.savedHotels;
      }

      // Normal kullanıcılar için localStorage güncelleme
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].savedHotels = currentUser.savedHotels;
        localStorage.setItem('users', JSON.stringify(users));
      }

      updateLocalStorage(currentUser);
      return currentUser.savedHotels;
    } catch (error) {
      throw error;
    }
  },

  // Ödeme yöntemi ekleme
  addPaymentMethod: (userId: string, paymentMethod: Omit<PaymentMethod, 'id'>) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw { code: 'USER_NOT_FOUND', message: 'Kullanıcı bulunamadı' };
      }

      if (!currentUser.paymentMethods) {
        currentUser.paymentMethods = [];
      }

      const newPaymentMethod = {
        ...paymentMethod,
        id: Date.now().toString()
      };

      currentUser.paymentMethods.push(newPaymentMethod);

      // Test kullanıcısı için özel kontrol
      if (userId === TEST_USER.id) {
        TEST_USER.paymentMethods = currentUser.paymentMethods;
        updateLocalStorage(TEST_USER);
        return newPaymentMethod;
      }

      updateLocalStorage(currentUser);
      return newPaymentMethod;
    } catch (error) {
      throw error;
    }
  },

  // Ödeme yöntemi silme
  removePaymentMethod: (userId: string, paymentMethodId: string) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw { code: 'USER_NOT_FOUND', message: 'Kullanıcı bulunamadı' };
      }

      if (!currentUser.paymentMethods) {
        return false;
      }

      const methodIndex = currentUser.paymentMethods.findIndex(
        (m: PaymentMethod) => m.id === paymentMethodId
      );

      if (methodIndex === -1) {
        throw { code: 'PAYMENT_METHOD_NOT_FOUND', message: 'Ödeme yöntemi bulunamadı' };
      }

      currentUser.paymentMethods.splice(methodIndex, 1);

      // Test kullanıcısı için özel kontrol
      if (userId === TEST_USER.id) {
        TEST_USER.paymentMethods = currentUser.paymentMethods;
        updateLocalStorage(TEST_USER);
        return true;
      }

      updateLocalStorage(currentUser);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Rezervasyon iptal etme
  cancelReservation: (userId: string, reservationId: string) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw { code: 'USER_NOT_FOUND', message: 'Kullanıcı bulunamadı' };
      }

      if (!currentUser.reservations) {
        throw { code: 'NO_RESERVATIONS', message: 'Rezervasyon bulunamadı' };
      }

      const reservationIndex = currentUser.reservations.findIndex(
        (r: Reservation) => r.id === reservationId
      );

      if (reservationIndex === -1) {
        throw { code: 'RESERVATION_NOT_FOUND', message: 'Rezervasyon bulunamadı' };
      }

      currentUser.reservations[reservationIndex].status = 'cancelled';

      // Test kullanıcısı için özel kontrol
      if (userId === TEST_USER.id) {
        TEST_USER.reservations = currentUser.reservations;
        updateLocalStorage(TEST_USER);
        return currentUser.reservations[reservationIndex];
      }

      updateLocalStorage(currentUser);
      return currentUser.reservations[reservationIndex];
    } catch (error) {
      throw error;
    }
  }
};