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
}

export const authService = {
  // Kullanıcı kaydı
  register: (userData: Omit<User, 'id'>) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
      ...userData,
      id: Date.now().toString()
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  },

  // Kullanıcı girişi
  login: (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      authEvents.emit('authChange', true);
      return user;
    }
    return null;
  },

  // Çıkış yapma
  logout: () => {
    localStorage.removeItem('currentUser');
    authEvents.emit('authChange', false);
  },

  // Mevcut kullanıcıyı getirme
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  onAuthChange: (callback: (isLoggedIn: boolean) => void) => {
    authEvents.on('authChange', callback);
  }
};