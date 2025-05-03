import { User } from '../types/user';

const STORAGE_KEY = 'currentUser';
const USERS_KEY = 'users';

export const getUserFromStorage = async (): Promise<User | null> => {
  const userJson = localStorage.getItem(STORAGE_KEY);
  if (!userJson) return null;
  return JSON.parse(userJson);
};

export const updateUserInStorage = async (user: User): Promise<void> => {
  // Mevcut kullanıcıyı güncelle
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  
  // Kullanıcılar listesini de güncelle
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const userIndex = users.findIndex((u: User) => u.id === user.id);
  
  if (userIndex !== -1) {
    users[userIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const removeUserFromStorage = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getAllUsers = async (): Promise<User[]> => {
  const usersJson = localStorage.getItem(USERS_KEY);
  if (!usersJson) return [];
  return JSON.parse(usersJson);
};

export const findUserById = async (userId: string): Promise<User | null> => {
  const users = await getAllUsers();
  return users.find(user => user.id === userId) || null;
};

export const updateUserSettings = async (userId: string, settings: Partial<User>): Promise<User | null> => {
  const users = await getAllUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return null;
  
  users[userIndex] = {
    ...users[userIndex],
    ...settings
  };
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Eğer güncellenen kullanıcı mevcut oturum açmış kullanıcı ise
  const currentUser = await getUserFromStorage();
  if (currentUser && currentUser.id === userId) {
    await updateUserInStorage(users[userIndex]);
  }
  
  return users[userIndex];
}; 