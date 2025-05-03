import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const BizeUlasin: React.FC = () => {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Burada form gönderimi API'si entegre edilecek
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Bize Ulaşın</h1>
            <p className="text-lg text-gray-600">
              Size yardımcı olmaktan mutluluk duyarız. Lütfen bizimle iletişime geçin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Phone className="text-blue-600 mb-4" size={24} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Telefon</h3>
              <p className="text-gray-600 mb-2">7/24 Müşteri Hizmetleri</p>
              <a href="tel:+1555123-4567" className="text-blue-600 hover:text-blue-700">
                +90 (551) 555-3852
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <Mail className="text-blue-600 mb-4" size={24} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">E-posta</h3>
              <p className="text-gray-600 mb-2">24 saat içinde yanıt</p>
              <a href="mailto:destek@odamhazir.com" className="text-blue-600 hover:text-blue-700">
                destek@odamhazir.com
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <MapPin className="text-blue-600 mb-4" size={24} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Adres</h3>
              <p className="text-gray-600">
                <br />
                İstanbul Maltepe
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">İletişim Formu</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Adınız Soyadınız
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta Adresiniz
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Konu
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="reservation">Rezervasyon</option>
                    <option value="payment">Ödeme</option>
                    <option value="complaint">Şikayet</option>
                    <option value="suggestion">Öneri</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Gönder
                </button>

                {status === 'success' && (
                  <p className="text-green-600 text-sm">Mesajınız başarıyla gönderildi!</p>
                )}
                {status === 'error' && (
                  <p className="text-red-600 text-sm">Bir hata oluştu. Lütfen tekrar deneyin.</p>
                )}
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Canlı Destek</h2>
              <div className="flex items-center mb-6">
                <MessageCircle className="text-blue-600 mr-3" size={24} />
                <div>
                  <p className="text-gray-600">Çalışma Saatleri</p>
                  <p className="font-medium text-gray-900">Pazartesi - Cuma: 09:00 - 18:00</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Hızlı yanıt almak için canlı destek hattımızı kullanabilirsiniz. Temsilcilerimiz size yardımcı olmak için hazır.
              </p>
              <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center">
                <MessageCircle className="mr-2" size={20} />
                Canlı Desteği Başlat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BizeUlasin; 