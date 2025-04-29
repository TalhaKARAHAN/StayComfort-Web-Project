import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, User, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { authService } from '../services/authService';

interface PaymentInfo {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholderName: string;
  saveCard: boolean;
}

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reservationData = location.state || {};
  const currentUser = authService.getCurrentUser();
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: '',
    saveCard: false
  });
  
  const [billingAddress, setBillingAddress] = useState<Address>({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'TR'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Ensure the user is logged in before proceeding
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingAddress(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Kart numarası kontrolü
    if (!paymentInfo.cardNumber) {
      newErrors.cardNumber = 'Kart numarası gereklidir';
    } else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Geçerli bir kart numarası girin';
    }
    
    // Son kullanma tarihi kontrolü
    if (!paymentInfo.expiry) {
      newErrors.expiry = 'Son kullanma tarihi gereklidir';
    } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paymentInfo.expiry)) {
      newErrors.expiry = 'MM/YY formatında girin';
    }
    
    // CVV kontrolü
    if (!paymentInfo.cvv) {
      newErrors.cvv = 'CVV gereklidir';
    } else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      newErrors.cvv = 'Geçerli bir CVV girin';
    }
    
    // Kart sahibi adı kontrolü
    if (!paymentInfo.cardholderName) {
      newErrors.cardholderName = 'Kart sahibi adı gereklidir';
    }
    
    // Adres kontrolü
    if (!billingAddress.address) {
      newErrors.address = 'Adres gereklidir';
    }
    if (!billingAddress.city) {
      newErrors.city = 'Şehir gereklidir';
    }
    if (!billingAddress.state) {
      newErrors.state = 'İlçe gereklidir';
    }
    if (!billingAddress.zip) {
      newErrors.zip = 'Posta kodu gereklidir';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Start the payment process
      const payment = paymentService.createPayment({
        userId: currentUser?.id || '',
        amount: reservationData.totalPrice || 0,
        status: 'pending',
        paymentMethod: 'credit_card',
        reservationId: reservationData.id || ''
      });

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update payment status to completed
      paymentService.updatePaymentStatus(payment.id, 'completed');

      // Redirect to reservation summary page
      navigate('/reservation-summary', {
        state: {
          ...reservationData,
          paymentId: payment.id,
          paymentStatus: 'completed'
        }
      });
    } catch (error) {
      setErrors({
        payment: 'An error occurred during the payment process. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatExpiryDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    setPaymentInfo(prev => ({
      ...prev,
      expiry: value
    }));
  };
  
  const handleBlurExpiry = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length === 2) {
      setPaymentInfo(prev => ({
        ...prev,
        expiry: value + '/'
      }));
    }
  };
  
  const calculateNights = () => {
    if (!reservationData.checkIn || !reservationData.checkOut) return 1;
    
    const checkInDate = new Date(reservationData.checkIn);
    const checkOutDate = new Date(reservationData.checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 1;
  };
  
  const nights = calculateNights();
  const totalPrice = Math.round((reservationData.price || 0) * nights * 1.1);
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={20} className="mr-2" />
              Geri Dön
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Ödeme Bilgileri</h1>
              
              {errors.payment && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-start">
                  <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                  <span>{errors.payment}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Kart Bilgileri</h2>
                    
                    <div className="space-y-4">
                      <div className="input-group">
                        <label htmlFor="cardNumber" className="input-label">
                          Kart Numarası
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            id="cardNumber"
                            type="text"
                            name="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={handlePaymentChange}
                            className={`input-field pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </div>
                        {errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="input-group">
                          <label htmlFor="expiry" className="input-label">
                            Son Kullanma Tarihi
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              id="expiry"
                              type="text"
                              name="expiry"
                              value={paymentInfo.expiry}
                              onChange={formatExpiryDate}
                              onBlur={handleBlurExpiry}
                              className={`input-field pl-10 ${errors.expiry ? 'border-red-500' : ''}`}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </div>
                          {errors.expiry && (
                            <p className="mt-1 text-sm text-red-500">{errors.expiry}</p>
                          )}
                        </div>
                        
                        <div className="input-group">
                          <label htmlFor="cvv" className="input-label">
                            CVV
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              id="cvv"
                              type="text"
                              name="cvv"
                              value={paymentInfo.cvv}
                              onChange={handlePaymentChange}
                              className={`input-field pl-10 ${errors.cvv ? 'border-red-500' : ''}`}
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                          {errors.cvv && (
                            <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="input-group">
                        <label htmlFor="cardholderName" className="input-label">
                          Kart Sahibi Adı
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            id="cardholderName"
                            type="text"
                            name="cardholderName"
                            value={paymentInfo.cardholderName}
                            onChange={handlePaymentChange}
                            className={`input-field pl-10 ${errors.cardholderName ? 'border-red-500' : ''}`}
                            placeholder="Ad Soyad"
                          />
                        </div>
                        {errors.cardholderName && (
                          <p className="mt-1 text-sm text-red-500">{errors.cardholderName}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="saveCard"
                          type="checkbox"
                          name="saveCard"
                          checked={paymentInfo.saveCard}
                          onChange={handlePaymentChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
                          Kart bilgilerimi kaydet
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Fatura Adresi</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="input-group">
                          <label htmlFor="firstName" className="input-label">
                            Ad
                          </label>
                          <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={billingAddress.firstName}
                            onChange={handleAddressChange}
                            className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                            required
                          />
                        </div>
                        
                        <div className="input-group">
                          <label htmlFor="lastName" className="input-label">
                            Soyad
                          </label>
                          <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={billingAddress.lastName}
                            onChange={handleAddressChange}
                            className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="input-group">
                        <label htmlFor="email" className="input-label">
                          E-posta
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={billingAddress.email}
                          onChange={handleAddressChange}
                          className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                          required
                        />
                      </div>
                      
                      <div className="input-group">
                        <label htmlFor="phone" className="input-label">
                          Telefon
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={billingAddress.phone}
                          onChange={handleAddressChange}
                          className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                          required
                        />
                      </div>
                      
                      <div className="input-group">
                        <label htmlFor="address" className="input-label">
                          Adres
                        </label>
                        <input
                          id="address"
                          type="text"
                          name="address"
                          value={billingAddress.address}
                          onChange={handleAddressChange}
                          className={`input-field ${errors.address ? 'border-red-500' : ''}`}
                          required
                        />
                        {errors.address && (
                          <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="input-group">
                          <label htmlFor="city" className="input-label">
                            Şehir
                          </label>
                          <input
                            id="city"
                            type="text"
                            name="city"
                            value={billingAddress.city}
                            onChange={handleAddressChange}
                            className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                            required
                          />
                          {errors.city && (
                            <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                          )}
                        </div>
                        
                        <div className="input-group">
                          <label htmlFor="state" className="input-label">
                            İlçe
                          </label>
                          <input
                            id="state"
                            type="text"
                            name="state"
                            value={billingAddress.state}
                            onChange={handleAddressChange}
                            className={`input-field ${errors.state ? 'border-red-500' : ''}`}
                            required
                          />
                          {errors.state && (
                            <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="input-group">
                          <label htmlFor="zip" className="input-label">
                            Posta Kodu
                          </label>
                          <input
                            id="zip"
                            type="text"
                            name="zip"
                            value={billingAddress.zip}
                            onChange={handleAddressChange}
                            className={`input-field ${errors.zip ? 'border-red-500' : ''}`}
                            required
                          />
                          {errors.zip && (
                            <p className="mt-1 text-sm text-red-500">{errors.zip}</p>
                          )}
                        </div>
                        
                        <div className="input-group">
                          <label htmlFor="country" className="input-label">
                            Ülke
                          </label>
                          <select
                            id="country"
                            name="country"
                            value={billingAddress.country}
                            onChange={handleAddressChange}
                            className="input-field"
                          >
                            <option value="TR">Türkiye</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Rezervasyon Özeti</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Otel:</span>
                      <span className="font-medium">{reservationData.hotelName}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Oda:</span>
                      <span className="font-medium">{reservationData.roomName}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giriş Tarihi:</span>
                      <span className="font-medium">{reservationData.checkIn}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Çıkış Tarihi:</span>
                      <span className="font-medium">{reservationData.checkOut}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gece Sayısı:</span>
                      <span className="font-medium">{nights}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Oda Fiyatı:</span>
                      <span className="font-medium">{reservationData.price} TL</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vergi (%10):</span>
                      <span className="font-medium">{Math.round(reservationData.price * nights * 0.1)} TL</span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">Toplam:</span>
                        <span className="text-lg font-semibold">{totalPrice} TL</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Lock size={16} className="mr-2" />
                    <span>Güvenli ödeme</span>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;