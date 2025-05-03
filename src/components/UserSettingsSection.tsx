import React, { useState } from 'react';
import { User } from '../types/user';

interface UserSettingsSectionProps {
  user: User | null;
  onUpdate: (data: Partial<User>) => Promise<void>;
}

const UserSettingsSection: React.FC<UserSettingsSectionProps> = ({ user, onUpdate }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      mobile: true
    },
    preferences: {
      language: 'tr',
      currency: 'TRY',
      timezone: 'Europe/Istanbul'
    }
  });

  const handleNotificationChange = (type: 'email' | 'sms' | 'mobile') => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handlePreferenceChange = (
    type: 'language' | 'currency' | 'timezone',
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [type]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      await onUpdate({ settings });
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-8">
        {/* Bildirim Ayarları */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Bildirim Ayarları</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">E-posta Bildirimleri</p>
                <p className="text-sm text-gray-500">
                  Özel teklifler ve güncellemeler hakkında e-posta alın
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={() => handleNotificationChange('email')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">SMS Bildirimleri</p>
                <p className="text-sm text-gray-500">
                  Rezervasyon durumu ve önemli bilgilendirmeler için SMS alın
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={() => handleNotificationChange('sms')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Mobil Bildirimler</p>
                <p className="text-sm text-gray-500">
                  Anlık bildirimler ve özel fırsatlar için mobil bildirimler alın
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.mobile}
                  onChange={() => handleNotificationChange('mobile')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Dil ve Bölge Ayarları */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Dil ve Bölge</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Dil</label>
              <select
                value={settings.preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Para Birimi</label>
              <select
                value={settings.preferences.currency}
                onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="TRY">Türk Lirası (₺)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Saat Dilimi</label>
              <select
                value={settings.preferences.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="Europe/Istanbul">İstanbul (UTC+03:00)</option>
                <option value="Europe/London">London (UTC+00:00)</option>
                <option value="America/New_York">New York (UTC-05:00)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ayarları Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsSection; 