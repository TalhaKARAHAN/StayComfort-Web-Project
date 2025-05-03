import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const socialLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={24} />,
      url: 'https://facebook.com/staycomfort',
      color: 'hover:text-[#1877F2]'
    },
    {
      name: 'Twitter',
      icon: <Twitter size={24} />,
      url: 'https://twitter.com/staycomfort',
      color: 'hover:text-[#1DA1F2]'
    },
    {
      name: 'Instagram',
      icon: <Instagram size={24} />,
      url: 'https://instagram.com/staycomfort',
      color: 'hover:text-[#E4405F]'
    },
    {
      name: 'Youtube',
      icon: <Youtube size={24} />,
      url: 'https://youtube.com/staycomfort',
      color: 'hover:text-[#FF0000]'
    }
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Burada gerçek bir API çağrısı yapılacak
      setSubscribeStatus('success');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
      setEmail('');
    } catch (error) {
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div>
            <div className="flex items-center mb-4">
              <div className="text-blue-500 mr-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </div>
              <span className="text-xl font-bold">StayComfort</span>
            </div>
            <p className="text-gray-400 mb-4">
              Mükemmel konaklamanızı StayComfort ile bulun. Dünyanın en iyi otel fırsatlarını sunuyoruz.
            </p>
            <div className="flex items-center text-gray-400 mb-2">
              <Phone size={18} className="mr-2" />
              <a href="tel:+1555123-4567" className="hover:text-white transition">+90 (551) 555 3852</a>
              </div>
            <div className="flex items-center text-gray-400 mb-2">
              <Mail size={18} className="mr-2" />
              <a href="mailto:contact@staycomfort.com" className="hover:text-white transition">contact@staycomfort.com</a>
              </div>
            <div className="flex items-center text-gray-400">
              <MapPin size={18} className="mr-2" />
              <span>İstanbul, Türkiye</span>
            </div>
          </div>
          
          {/* Hızlı Bağlantılar */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">Ana Sayfa</Link>
              </li>
              <li>
                <Link to="/hotels" className="text-gray-400 hover:text-white transition">Otel Bul</Link>
              </li>
            </ul>
          </div>
          
          {/* Müşteri Desteği */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Müşteri Desteği</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sss" className="text-gray-400 hover:text-white transition">SSS</Link>
              </li>
              <li>
                <Link to="/yardim-merkezi" className="text-gray-400 hover:text-white transition">Yardım Merkezi</Link>
              </li>
              <li>
                <Link to="/bize-ulasin" className="text-gray-400 hover:text-white transition">Bize Ulaşın</Link>
              </li>
              <li>
                <Link to="/kullanim-sartlari" className="text-gray-400 hover:text-white transition">Kullanım Şartları</Link>
              </li>
              <li>
                <Link to="/gizlilik-politikasi" className="text-gray-400 hover:text-white transition">Gizlilik Politikası</Link>
              </li>
            </ul>
          </div>
          
          {/* Bülten */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Bülten</h3>
            <p className="text-gray-400 mb-4">
              En son teklifler ve güncellemeler için bültenimize abone olun.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta Adresiniz" 
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Abone Ol
              </button>
              {subscribeStatus === 'success' && (
                <p className="text-green-500 text-sm">Bültene başarıyla abone oldunuz!</p>
              )}
              {subscribeStatus === 'error' && (
                <p className="text-red-500 text-sm">Bir hata oluştu. Lütfen tekrar deneyin.</p>
              )}
            </form>
          </div>
        </div>
        
        {/* Alt Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} StayComfort. Tüm hakları saklıdır.
            </div>
            <div className="flex space-x-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transform hover:scale-110 transition-all duration-300`}
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;