import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Hotel, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 text-2xl font-bold mb-4">
              <Hotel className="text-blue-400" size={28} />
              <span>StayComfort</span>
            </div>
            <p className="text-gray-300 mb-4">
              Mükemmel konaklamanızı StayComfort ile bulun. Dünyanın en iyi otel fırsatlarını sunuyoruz.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-blue-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-blue-400" />
                <span className="text-gray-300">contact@staycomfort.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-blue-400" />
                <span className="text-gray-300">123 Hotel Street, City, Country</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-300 hover:text-blue-400 transition">
                  Otel Bul
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="text-gray-300 hover:text-blue-400 transition">
                  Özel Teklifler
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-blue-400 transition">
                  Hesabım
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-blue-400 transition">
                  Şimdi Katıl
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Support */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Müşteri Desteği</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition">
                  SSS
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition">
                  Yardım Merkezi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition">
                  Bize Ulaşın
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition">
                  Kullanım Şartları
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition">
                  Gizlilik Politikası
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Bülten</h3>
            <p className="text-gray-300 mb-4">
              En son teklifler ve güncellemeler için bültenimize abone olun.
            </p>
            <form className="space-y-3">
              <div>
                <input 
                  type="email" 
                  placeholder="E-posta Adresiniz" 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  aria-label="Bülten için e-posta"
                />
              </div>
              <button 
                type="submit" 
                className="w-full btn btn-primary"
                aria-label="Bültene abone ol"
              >
                Abone Ol
              </button>
            </form>
          </div>
        </div>
        
        {/* Social Media & Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition" aria-label="Bizi Facebook'ta takip edin">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition" aria-label="Bizi Twitter'da takip edin">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition" aria-label="Bizi Instagram'da takip edin">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition" aria-label="YouTube kanalımızı ziyaret edin">
              <Youtube size={24} />
            </a>
          </div>
          <div className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} StayComfort. Tüm hakları saklıdır.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;