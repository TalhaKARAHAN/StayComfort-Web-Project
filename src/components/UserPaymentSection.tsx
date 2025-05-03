import React, { useState } from 'react';
import { User, PaymentMethod } from '../types/user';
import { CheckCircle, Trash2, Star, AlertCircle } from 'lucide-react';

interface UserPaymentSectionProps {
  user: User | null;
  onUpdate: (data: Partial<User>) => Promise<void>;
}

const UserPaymentSection: React.FC<UserPaymentSectionProps> = ({ user, onUpdate }) => {
  const [newCard, setNewCard] = useState<Omit<PaymentMethod, 'id'> & { cvv?: string}>(
    {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      isDefault: false,
      cvv: ''
    }
  );
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showAddCardForm, setShowAddCardForm] = useState(false);

  // Otomatik kart numarası formatlama
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(.{4})/g, '$1 ').trim();
  };

  // Otomatik tarih formatlama MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) return v.slice(0, 2) + '/' + v.slice(2, 4);
    return v;
  };

  const validateCard = () => {
    if (!newCard.cardHolder.trim()) return 'Kart üzerindeki isim boş olamaz.';
    const cardNum = newCard.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cardNum)) return 'Kart numarası 16 haneli olmalı.';
    if (!/^\d{2}\/\d{2}$/.test(newCard.expiryDate)) return 'Son kullanma tarihi MM/YY formatında olmalı.';
    // Tarih geçmiş mi kontrolü
    const [mm, yy] = newCard.expiryDate.split('/');
    const now = new Date();
    const expDate = new Date(Number('20' + yy), Number(mm) - 1);
    if (expDate < new Date(now.getFullYear(), now.getMonth())) return 'Kartın son kullanma tarihi geçmiş.';
    return null;
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validateCard();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      if (!user) return;
      let updatedPaymentMethods = [...(user.paymentMethods || [])];
      // Varsayılan kart seçildiyse diğerlerini sıfırla
      if (newCard.isDefault) {
        updatedPaymentMethods = updatedPaymentMethods.map(card => ({ ...card, isDefault: false }));
      }
      const cardToAdd: PaymentMethod = {
        ...newCard,
        cardNumber: newCard.cardNumber.replace(/\s/g, ''),
        id: Date.now().toString()
      };
      updatedPaymentMethods.push(cardToAdd);
      await onUpdate({ paymentMethods: updatedPaymentMethods });
      setNewCard({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        isDefault: false,
        cvv: ''
      });
      setToast('Kart başarıyla eklendi!');
      setTimeout(() => setToast(null), 2000);
      setShowAddCardForm(false);
    } catch (error) {
      setToast('Kart eklenirken hata oluştu!');
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    try {
      if (!user?.paymentMethods) return;
      const updatedPaymentMethods = user.paymentMethods.filter(card => card.id !== cardId);
      await onUpdate({ paymentMethods: updatedPaymentMethods });
      setToast('Kart silindi!');
      setTimeout(() => setToast(null), 2000);
    } catch (error) {
      setToast('Kart silinirken hata oluştu!');
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleSetDefault = async (cardId: string) => {
    try {
      if (!user?.paymentMethods) return;
      const updatedPaymentMethods = user.paymentMethods.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }));
      await onUpdate({ paymentMethods: updatedPaymentMethods });
      setToast('Varsayılan kart güncellendi!');
      setTimeout(() => setToast(null), 2000);
    } catch (error) {
      setToast('Varsayılan kart ayarlanırken hata oluştu!');
      setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Kayıtlı Kartlar</h2>
        {!showAddCardForm && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.paymentMethods?.length === 0 && (
                <div className="text-gray-500">Kayıtlı kartınız yok.</div>
              )}
              {user?.paymentMethods?.map(card => (
                <div
                  key={card.id}
                  className={`relative flex flex-col justify-between p-6 border rounded-2xl shadow-lg bg-gradient-to-tr from-blue-50 to-white ${card.isDefault ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} min-h-[120px] mb-4 transition-all duration-200`}
                  style={{ maxWidth: 400 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="5" width="20" height="14" rx="3" fill="#e5e7eb" stroke="#3b82f6" strokeWidth="1.5"/><rect x="2" y="9" width="20" height="2" fill="#3b82f6"/></svg>
                    <span className="font-mono text-xl tracking-widest text-gray-800">{'**** **** **** ' + (card.cardNumber ? card.cardNumber.slice(-4) : '0000')}</span>
                    <span className="text-gray-400 text-xl mx-2">|</span>
                    <span className="text-lg text-gray-700 font-semibold">{formatExpiryDate(card.expiryDate) || 'MM/YY'}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-medium text-base text-gray-900 flex items-center gap-2">
                      {card.cardHolder}
                      {card.isDefault && (
                        <span className="flex items-center text-xs text-blue-600 font-semibold ml-2"><Star className="w-4 h-4 mr-1" /> Varsayılan</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!card.isDefault && (
                        <button
                          onClick={() => handleSetDefault(card.id)}
                          className="flex items-center px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 border border-blue-100"
                        >
                          <Star className="w-4 h-4 mr-1" /> Varsayılan Yap
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveCard(card.id)}
                        className="flex items-center px-3 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 border border-red-100"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              onClick={() => setShowAddCardForm(true)}
            >
              + Yeni Kart Ekle
            </button>
          </>
        )}
        {showAddCardForm && (
          <div className="max-w-md mx-auto bg-gray-50 rounded-xl shadow p-6">
            <button
              className="mb-4 text-blue-600 hover:underline text-sm"
              onClick={() => setShowAddCardForm(false)}
            >
              ← Geri
            </button>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni Kart Ekle</h3>
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
                      {formatCardNumber(newCard.cardNumber) || '**** **** **** ****'}
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs uppercase">Kart Sahibi</div>
                        <div className="font-semibold tracking-wide">{newCard.cardHolder ? newCard.cardHolder.toUpperCase() : 'AD SOYAD'}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase">Son Kullanma</div>
                        <div className="font-semibold tracking-wide">{formatExpiryDate(newCard.expiryDate) || 'MM/YY'}</div>
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
                        {newCard.cvv ? newCard.cvv : 'CVV'}
                      </div>
                      <div className="text-xs text-gray-300 mt-2">Güvenlik Kodu</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kart Üzerindeki İsim</label>
                <input
                  type="text"
                  value={newCard.cardHolder}
                  onFocus={() => setIsCardFlipped(false)}
                  onBlur={() => setIsCardFlipped(false)}
                  onChange={e => setNewCard({ ...newCard, cardHolder: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kart Numarası</label>
                <input
                  type="text"
                  value={newCard.cardNumber}
                  onFocus={() => setIsCardFlipped(false)}
                  onBlur={() => setIsCardFlipped(false)}
                  onChange={e => setNewCard({ ...newCard, cardNumber: e.target.value.replace(/\D/g, '') })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  maxLength={16}
                  placeholder="1234567812345678"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Son Kullanma Tarihi</label>
                  <input
                    type="text"
                    value={newCard.expiryDate}
                    onFocus={() => setIsCardFlipped(false)}
                    onBlur={() => setIsCardFlipped(false)}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                      setNewCard({ ...newCard, expiryDate: v });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CVV</label>
                  <input
                    type="text"
                    value={newCard.cvv || ''}
                    onFocus={() => setIsCardFlipped(true)}
                    onBlur={() => setIsCardFlipped(false)}
                    onChange={e => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    placeholder="123"
                    maxLength={3}
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newCard.isDefault}
                  onChange={e => setNewCard({ ...newCard, isDefault: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                  Varsayılan kart olarak ayarla
                </label>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Kartı Kaydet
              </button>
            </form>
            {error && (
              <div className="mt-4 text-center text-sm text-red-600 bg-red-50 rounded p-2">
                <AlertCircle className="inline w-4 h-4 mr-1" /> {error}
              </div>
            )}
            {toast && (
              <div className="mt-4 text-center text-sm text-green-600 bg-green-50 rounded p-2">
                <CheckCircle className="inline w-4 h-4 mr-1" /> {toast}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPaymentSection; 