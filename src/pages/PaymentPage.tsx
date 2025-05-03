import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, User, Lock, AlertCircle, ArrowLeft, Plus, Check, MapPin } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { authService } from '../services/authService';
import Toast from '../components/Toast';
import { bookingService } from '../services/bookingService';
import { hotelService } from '../services/hotelService';
import PaymentPopup from '../components/PaymentPopup';

interface BookingDetails {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  guests: number;
}

interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  isDefault: boolean;
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [savedCards, setSavedCards] = useState<PaymentMethod[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    success: boolean;
    message: string;
  }>({ success: false, message: '' });
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const bookingDetails = location.state?.bookingDetails as BookingDetails;

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    try {
      setLoading(true);
      setError(null);

    if (!currentUser) {
        setError('Kullanıcı oturumu bulunamadı');
        navigate('/login', { state: { returnUrl: location.pathname, bookingDetails } });
        return;
      }

      if (!bookingDetails) {
        setError('Rezervasyon detayları bulunamadı');
        navigate('/hotel');
        return;
      }

      const cards = await authService.getPaymentMethods(currentUser.id);
      setSavedCards(cards);
      const defaultCard = cards.find(card => card.isDefault);
      if (defaultCard) {
        setSelectedCardId(defaultCard.id);
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      // currentUser'ı güncelle
      const freshUser = authService.getCurrentUser();
      setCurrentUser(freshUser);
      // Ödeme işlemi simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Rezervasyon ekle
      if (freshUser && bookingDetails) {
        const hotel = hotelService.getHotelById(bookingDetails.hotelId);
        const room = hotel?.rooms?.find(r => r.id === bookingDetails.roomId);
        await bookingService.createBooking({
          hotelName: hotel?.name || 'Bilinmeyen Otel',
          location: hotel?.location || 'Bilinmiyor',
          roomName: room?.name || 'Bilinmeyen Oda',
          checkIn: bookingDetails.checkIn,
          checkOut: bookingDetails.checkOut,
          image: (room?.images?.[0]) || (hotel?.images?.[0]) || hotel?.image || '/placeholder-hotel.png',
          price: bookingDetails.totalPrice,
          status: 'active'
        });
      }
      // Başarılı ödeme
      setPaymentStatus({
        success: true,
        message: 'Ödemeniz başarıyla tamamlandı. Rezervasyon detaylarınız email adresinize gönderilecektir.'
      });
      setIsPopupOpen(true);
    } catch (error) {
      // Başarısız ödeme
      setPaymentStatus({
        success: false,
        message: 'Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.'
      });
      setIsPopupOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleNewCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!currentUser) {
        setPaymentStatus({ success: false, message: 'Kullanıcı oturumu bulunamadı' });
        setIsPopupOpen(true);
        navigate('/login', { state: { returnUrl: location.pathname, bookingDetails } });
        return;
      }

      setIsProcessing(true);

      // Yeni kartı kaydet
      if (saveCard) {
        const savedCard = await authService.addPaymentMethod(currentUser.id, {
          cardNumber: cardNumber.replace(/\D/g, ''),
          cardHolder: cardName,
          expiryDate: expiryDate,
          isDefault: newCard.isDefault
        });
        setSavedCards([...savedCards, savedCard]);
        setNewCard({ cardNumber: '', cardHolder: '', expiryDate: '', isDefault: false });
        setShowNewCardForm(false);
        setSelectedCardId(savedCard.id);
        // currentUser'ı güncelle
        const updatedUser = authService.getCurrentUser();
        setCurrentUser(updatedUser);
        // Kart başarıyla kaydedildikten sonra otomatik olarak ödeme işlemini başlat
        await handlePayment();
      } else {
        // Kaydetmeden direkt ödeme yap
        await handlePayment();
      }
    } catch (err: any) {
      setPaymentStatus({ success: false, message: err.message || 'Kart kaydedilirken bir hata oluştu.' });
      setIsPopupOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSetDefaultCard = async (cardId: string) => {
    try {
      if (!currentUser) {
        showToast('Kullanıcı oturumu bulunamadı', 'error');
        return;
      }

      await authService.updatePaymentMethod(currentUser.id, cardId, { isDefault: true });
      const updatedCards = savedCards.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }));
      setSavedCards(updatedCards);
      showToast('Varsayılan kart güncellendi', 'success');
    } catch (err: any) {
      showToast(err.message || 'Kart güncellenirken bir hata oluştu', 'error');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      if (!currentUser) {
        setPaymentStatus({ success: false, message: 'Kullanıcı oturumu bulunamadı' });
        setIsPopupOpen(true);
        return;
      }

      await authService.deletePaymentMethod(currentUser.id, cardId);
      setSavedCards(savedCards.filter(card => card.id !== cardId));
      if (selectedCardId === cardId) {
        setSelectedCardId('');
      }
      setPaymentStatus({ success: true, message: 'Kart başarıyla silindi.' });
      setIsPopupOpen(true);
    } catch (err: any) {
      setPaymentStatus({ success: false, message: err.message || 'Kart silinirken bir hata oluştu.' });
      setIsPopupOpen(true);
    }
  };

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    isDefault: false
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sadece rakamları al ve boşlukları kaldır
    const value = e.target.value.replace(/\D/g, '');
    
    // 16 haneden fazla girişi engelle
    if (value.length <= 16) {
      // Her 4 rakamdan sonra boşluk ekle
      const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      setCardNumber(formatted);
    }
  };

  const formatCardNumber = (value: string) => {
    // Boşlukları kaldır ve sadece rakamları al
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    // Her 4 rakamdan sonra boşluk ekle
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    
    return parts.join(' ');
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const maskCardNumber = (number: string) => {
    // Sadece rakamları al
    const digits = number.replace(/\D/g, '');
    const last4 = digits.slice(-4);
    return `**** **** **** ${last4}`;
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      const formatted = formatExpiryDate(value);
      setExpiryDate(formatted);
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    if (paymentStatus.success) {
      navigate('/dashboard', { state: { activeSection: 'reservations' } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Hata</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Hata</h2>
          <p className="text-gray-600 text-center mb-6">Rezervasyon detayları bulunamadı</p>
          <button
            onClick={() => navigate('/hotels')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Otellere Dön
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            Ödeme başarıyla tamamlandı! Rezervasyonlarınıza yönlendiriliyorsunuz...
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Ödeme</h1>

              {/* Rezervasyon Özeti - PROFESYONEL GÖRSEL */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8 flex flex-col md:flex-row gap-6 items-center">
                <img
                  src={hotelService.getHotelById(bookingDetails.hotelId)?.rooms?.find(r => r.id === bookingDetails.roomId)?.images?.[0] || hotelService.getHotelById(bookingDetails.hotelId)?.images?.[0] || hotelService.getHotelById(bookingDetails.hotelId)?.image || '/placeholder-hotel.png'}
                  alt={hotelService.getHotelById(bookingDetails.hotelId)?.name}
                  className="w-32 h-32 object-cover rounded-lg shadow-md border border-gray-200"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{hotelService.getHotelById(bookingDetails.hotelId)?.name || 'Otel Bilgisi'}</h2>
                  <div className="text-gray-600 flex items-center mb-2">
                    <span className="mr-2"><User className="inline w-5 h-5 mr-1" />{bookingDetails.guests} Misafir</span>
                    <span className="mx-2">|</span>
                    <span><Calendar className="inline w-5 h-5 mr-1" />{new Date(bookingDetails.checkIn).toLocaleDateString('tr-TR')} - {new Date(bookingDetails.checkOut).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="text-gray-700 mb-2 flex items-center">
                    <span className="mr-2"><CreditCard className="inline w-5 h-5 mr-1" />{hotelService.getHotelById(bookingDetails.hotelId)?.rooms?.find(r => r.id === bookingDetails.roomId)?.name || 'Oda Bilgisi'}</span>
                    <span className="mx-2">|</span>
                    <span><MapPin className="inline w-5 h-5 mr-1" />{hotelService.getHotelById(bookingDetails.hotelId)?.location}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-lg font-bold text-gray-900 mr-2">Toplam Tutar:</span>
                    <span className="text-2xl font-bold text-blue-600">₺{bookingDetails.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Kayıtlı Kartlar */}
              {savedCards.length > 0 && !showNewCardForm && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Kayıtlı Kartlarım</h2>
                  <div className="space-y-3">
                    {savedCards.map(card => (
                      <label key={card.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedCardId === card.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          name="selectedCard"
                          value={card.id}
                          checked={selectedCardId === card.id}
                          onChange={() => setSelectedCardId(card.id)}
                          className="mr-4 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-gray-900">{card.cardHolder}</div>
                            {card.isDefault && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                Varsayılan
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-sm text-gray-600 font-mono">
                            {maskCardNumber(card.cardNumber)} | {formatExpiryDate(card.expiryDate)}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    className="mt-4 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-all duration-200 flex items-center"
                    onClick={() => setShowNewCardForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Kart ile Öde
                  </button>
                </div>
              )}

              {/* Yeni Kart Ekleme Formu */}
              {(showNewCardForm || savedCards.length === 0) && (
                <form onSubmit={handleNewCardSubmit} className="space-y-6 mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Kart ile Öde</h2>
                  {/* Kart Görseli */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-96 h-56" style={{ perspective: '1000px' }}>
                      <div
                        className="w-full h-full relative"
                        style={{
                          transition: 'transform 0.5s',
                          transformStyle: 'preserve-3d',
                          transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                        }}
                      >
                        {/* Ön Yüz */}
                        <div
                          className="absolute w-full h-full bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl shadow-lg p-6 text-white"
                          style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            MozBackfaceVisibility: 'hidden',
                            transform: 'rotateY(0deg)'
                          }}
                        >
                          <div className="absolute top-4 right-6 text-lg font-bold tracking-widest">VISA</div>
                          <div className="mt-10 mb-6 text-2xl tracking-widest font-mono">
                            {formatCardNumber(cardNumber) || '**** **** **** ****'}
                          </div>
                          <div className="flex justify-between items-end">
                            <div>
                              <div className="text-xs uppercase">Kart Sahibi</div>
                              <div className="font-semibold tracking-wide">{cardName ? cardName.toUpperCase() : 'AD SOYAD'}</div>
                            </div>
                            <div>
                              <div className="text-xs uppercase">Son Kullanma</div>
                              <div className="font-semibold tracking-wide">{expiryDate ? expiryDate : 'MM/YY'}</div>
                            </div>
                          </div>
                        </div>
                        {/* Arka Yüz */}
                        <div
                          className="absolute w-full h-full bg-gray-800 rounded-2xl shadow-lg p-6 text-white"
                          style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            MozBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                          }}
                        >
                          <div className="w-full h-10 bg-gray-900 mt-4 mb-8 rounded"></div>
                          <div className="flex flex-col items-end mt-8">
                            <div className="w-3/4 h-8 bg-white rounded flex items-center px-4 text-gray-900 font-mono text-lg tracking-widest">
                              {cvv ? cvv : 'CVV'}
                            </div>
                            <div className="text-xs text-gray-300 mt-2">Güvenlik Kodu</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Kart Formu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kart Üzerindeki İsim</label>
                    <input
                      type="text"
                      value={cardName}
                      onFocus={() => setIsCardFlipped(false)}
                      onBlur={() => setIsCardFlipped(false)}
                      onChange={e => setCardName(e.target.value.replace(/[^a-zA-ZğüşöçıİĞÜŞÖÇ\s]/g, ''))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="İsim Soyisim"
                      required
                      autoCapitalize="words"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kart Numarası</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onFocus={() => setIsCardFlipped(false)}
                      onBlur={() => setIsCardFlipped(false)}
                      onChange={handleCardNumberChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                      inputMode="numeric"
                      pattern="[0-9\s]*"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Son Kullanma Tarihi</label>
                      <input
                        type="text"
                        value={expiryDate}
                        onFocus={() => setIsCardFlipped(false)}
                        onBlur={() => setIsCardFlipped(false)}
                        onChange={handleExpiryDateChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        value={cvv}
                        onFocus={() => setIsCardFlipped(true)}
                        onBlur={() => setIsCardFlipped(false)}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saveCard"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
                      Kart bilgilerimi kaydet
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'İşleniyor...' : 'Bu Kart ile Öde'}
                    </button>
                    {savedCards.length > 0 && (
                      <button
                        type="button"
                        className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300"
                        onClick={() => setShowNewCardForm(false)}
                      >
                        Kayıtlı Kartlara Dön
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Kayıtlı kart seçiliyse ödeme butonu */}
              {savedCards.length > 0 && !showNewCardForm && (
                <form onSubmit={handlePayment} className="space-y-6">
                  <button
                    type="submit"
                    disabled={loading || !selectedCardId}
                    className={`w-full bg-blue-600 text-white py-4 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading || !selectedCardId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'İşleniyor...' : (
                      <div className="flex items-center justify-center">
                        <CreditCard size={20} className="mr-2" />
                        ₺{bookingDetails.totalPrice} Öde
                      </div>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <PaymentPopup
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        isSuccess={paymentStatus.success}
        message={paymentStatus.message}
      />
    </div>
  );
};

export default PaymentPage;