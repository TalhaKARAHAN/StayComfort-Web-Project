import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, User, Lock, AlertCircle, ArrowLeft, Plus, Check, ChevronDown } from 'lucide-react';
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

interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  isDefault: boolean;
}

interface LocationState {
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomName: string;
  price: number;
  checkIn?: string;
  checkOut?: string;
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = authService.getCurrentUser();
  const bookingDetails = location.state as LocationState;

  // Calculate nights
  const calculateNights = () => {
    if (!bookingDetails?.checkIn || !bookingDetails?.checkOut) return 1;
    
    const checkInDate = new Date(bookingDetails.checkIn);
    const checkOutDate = new Date(bookingDetails.checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const totalPrice = Math.round((bookingDetails?.price || 0) * nights * 1.1); // Price + 10% tax

  // Payment states
  const [savedCards, setSavedCards] = useState<PaymentMethod[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  // New card form state
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    isDefault: false
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!bookingDetails) {
      navigate('/hotels');
      return;
    }

    // Kayıtlı kartları yükle
    const loadSavedCards = async () => {
      try {
        setLoading(true);
        const userCards = currentUser.paymentMethods || [];
        setSavedCards(userCards);
        
        // Varsayılan kartı seç
        const defaultCard = userCards.find((card: PaymentMethod) => card.isDefault);
        if (defaultCard) {
          setSelectedCardId(defaultCard.id);
        }
      } catch (err: any) {
        setError(err.message || 'Kayıtlı kartlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadSavedCards();
  }, [currentUser, navigate, bookingDetails]);

  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
    setShowNewCardForm(false);
  };

  const handleNewCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!currentUser) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      // Yeni kartı kaydet
      if (saveCard) {
        const savedCard = await authService.addPaymentMethod(currentUser.id, {
          cardNumber: newCard.cardNumber,
          cardHolder: newCard.cardHolder,
          expiryDate: newCard.expiryDate,
          isDefault: newCard.isDefault
        });
        setSavedCards([...savedCards, savedCard]);
        setSelectedCardId(savedCard.id);
      }

      // Ödeme işlemini gerçekleştir ve rezervasyonu tamamla
      navigate('/reservation-confirmation', {
        state: {
          ...bookingDetails,
          paymentMethod: saveCard ? 'saved' : 'new',
          cardId: selectedCardId,
          totalPrice: totalPrice
        }
      });
    } catch (err: any) {
      setError(err.message || 'Ödeme işlemi sırasında bir hata oluştu');
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Ödeme</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Rezervasyon Özeti */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Rezervasyon Özeti</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Otel:</span>
                <span className="font-medium text-gray-900">{bookingDetails.hotelName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Oda:</span>
                <span className="font-medium text-gray-900">{bookingDetails.roomName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Giriş Tarihi:</span>
                <span className="font-medium text-gray-900">{bookingDetails.checkIn}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Çıkış Tarihi:</span>
                <span className="font-medium text-gray-900">{bookingDetails.checkOut}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Gece Sayısı:</span>
                <span className="font-medium text-gray-900">{nights}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Oda Fiyatı:</span>
                <span className="font-medium text-gray-900">{bookingDetails.price} TL</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vergi (%10):</span>
                <span className="font-medium text-gray-900">{Math.round(bookingDetails.price * nights * 0.1)} TL</span>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Toplam:</span>
                  <span className="text-lg font-semibold text-blue-600">{totalPrice} TL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ödeme Yöntemi */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Ödeme Yöntemi</h2>

            {/* Kayıtlı Kartlar */}
            {savedCards.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Kayıtlı Kartlar</h3>
                <div className="space-y-3">
                  {savedCards.map((card) => (
                    <div
                      key={card.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                        selectedCardId === card.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleCardSelect(card.id)}
                    >
                      <div className="flex items-center">
                        <CreditCard className="text-blue-600 mr-3" size={24} />
                        <div>
                          <p className="font-medium text-gray-900">{card.cardHolder}</p>
                          <p className="text-sm text-gray-500">**** **** **** {card.cardNumber.slice(-4)}</p>
                        </div>
                      </div>
                      {selectedCardId === card.id && (
                        <Check className="text-blue-600" size={24} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Yeni Kart Formu */}
            <div className={savedCards.length > 0 ? 'mt-8 pt-8 border-t' : ''}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {savedCards.length > 0 ? 'Yeni Kart Ekle' : 'Kart Bilgileri'}
                </h3>
                {savedCards.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowNewCardForm(!showNewCardForm)}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    {showNewCardForm ? (
                      <ChevronDown className="h-5 w-5 mr-1" />
                    ) : (
                      <Plus className="h-5 w-5 mr-1" />
                    )}
                    {showNewCardForm ? 'Gizle' : 'Yeni Kart'}
                  </button>
                )}
              </div>

              {(!savedCards.length || showNewCardForm) && (
                <form onSubmit={handleNewCardSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kart Numarası
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newCard.cardNumber}
                        onChange={(e) =>
                          setNewCard({ ...newCard, cardNumber: e.target.value })
                        }
                        className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="1234 5678 9012 3456"
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kart Üzerindeki İsim
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newCard.cardHolder}
                        onChange={(e) =>
                          setNewCard({ ...newCard, cardHolder: e.target.value })
                        }
                        className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Ad Soyad"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Son Kullanma Tarihi
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={newCard.expiryDate}
                          onChange={(e) =>
                            setNewCard({ ...newCard, expiryDate: e.target.value })
                          }
                          className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="MM/YY"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={newCard.cvv}
                          onChange={(e) =>
                            setNewCard({ ...newCard, cvv: e.target.value })
                          }
                          className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="123"
                          maxLength={3}
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {savedCards.length > 0 && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Bu kartı kaydet
                      </label>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newCard.isDefault}
                      onChange={(e) =>
                        setNewCard({ ...newCard, isDefault: e.target.checked })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Varsayılan kart olarak ayarla
                    </label>
                  </div>
                </form>
              )}
            </div>

            {/* Ödeme Butonu */}
            <div className="mt-8">
              <button
                type="button"
                onClick={handleNewCardSubmit}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {totalPrice} TL Öde
              </button>
              <p className="mt-2 text-xs text-center text-gray-500">
                Ödemeyi tamamlayarak{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  kullanım koşullarını
                </a>{' '}
                kabul etmiş olursunuz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;