import React from 'react';
import { User } from '../types/user';

interface UserDashboardHeaderProps {
  user: User | null;
}

const UserDashboardHeader: React.FC<UserDashboardHeaderProps> = ({ user }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Hesabım</h1>
            {user?.isEmailVerified && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Doğrulanmış Hesap
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-4">
            <p className="text-gray-600">Son giriş: {formatDate(user?.lastLogin || '')}</p>
            <p className="text-gray-600">•</p>
            <p className="text-gray-600">Üyelik: {formatDate(user?.createdAt || '')}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <div className="relative">
            <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-semibold shadow-sm">
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
            </div>
            {user?.isEmailVerified && (
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardHeader; 