import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  message: string;
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({ isOpen, onClose, isSuccess, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative mt-24">
        <div className="flex flex-col items-center">
          {isSuccess ? (
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
          )}
          
          <h2 className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {isSuccess ? 'Ödeme Başarılı!' : 'Ödeme Başarısız!'}
          </h2>
          
          <p className="text-gray-600 text-center mb-6">{message}</p>
          
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              isSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isSuccess ? 'Tamam' : 'Tekrar Dene'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup; 