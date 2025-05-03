import { User } from '../types/user';
import { getUserFromStorage, updateUserInStorage } from './storageService';

export const updateUserSettings = async (userId: string, settings: Partial<User>): Promise<User | null> => {
  try {
    const currentUser = await getUserFromStorage();
    if (!currentUser || currentUser.id !== userId) {
      throw new Error('Kullanıcı oturumu bulunamadı');
    }

    const updatedUser = {
      ...currentUser,
      ...settings
    };

    await updateUserInStorage(updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Kullanıcı ayarları güncellenirken hata:', error);
    return null;
  }
}; 