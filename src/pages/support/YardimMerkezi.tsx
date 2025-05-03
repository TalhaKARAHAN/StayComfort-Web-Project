import React from 'react';
import { Search, Book, MessageCircle, Phone, Mail, Clock, User, Star, AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const YardimMerkezi: React.FC = () => {
  const categories = [
    {
      title: "Rezervasyon İşlemleri",
      description: "Rezervasyon yapma, iptal etme ve değişiklik işlemleri hakkında bilgi alın.",
      icon: <Book className="w-6 h-6" />,
      link: "/help/reservations",
      subCategories: [
        "Yeni Rezervasyon Oluşturma",
        "Rezervasyon İptali",
        "Rezervasyon Değişikliği",
        "Grup Rezervasyonları",
        "Özel İstekler"
      ]
    },
    {
      title: "Ödeme ve Faturalama",
      description: "Ödeme seçenekleri, fatura talebi ve iade işlemleri hakkında bilgi alın.",
      icon: <MessageCircle className="w-6 h-6" />,
      link: "/help/payments",
      subCategories: [
        "Ödeme Yöntemleri",
        "Fatura Talebi",
        "İade İşlemleri",
        "Taksit Seçenekleri",
        "Ödeme Güvenliği"
      ]
    },
    {
      title: "Otel Hizmetleri",
      description: "Otellerin sunduğu hizmetler ve politikalar hakkında bilgi alın.",
      icon: <Clock className="w-6 h-6" />,
      link: "/help/services",
      subCategories: [
        "Check-in/Check-out",
        "Oda Servisi",
        "Spa ve Wellness",
        "Restoran Rezervasyonu",
        "Transfer Hizmetleri"
      ]
    },
    {
      title: "Hesap İşlemleri",
      description: "Üyelik hesabınız ile ilgili tüm işlemler için yardım alın.",
      icon: <User className="w-6 h-6" />,
      link: "/help/account",
      subCategories: [
        "Hesap Oluşturma",
        "Şifre İşlemleri",
        "Profil Güncelleme",
        "E-posta Tercihleri",
        "Hesap Güvenliği"
      ]
    },
    {
      title: "Özel Hizmetler",
      description: "VIP hizmetler ve özel talepler için bilgi alın.",
      icon: <Star className="w-6 h-6" />,
      link: "/help/special-services",
      subCategories: [
        "VIP Transfer",
        "Özel Etkinlikler",
        "Balayı Paketleri",
        "İş Seyahati Hizmetleri",
        "Concierge Servisi"
      ]
    },
    {
      title: "Sorun Bildirimi",
      description: "Yaşadığınız sorunları bildirin ve çözüm için yardım alın.",
      icon: <AlertCircle className="w-6 h-6" />,
      link: "/help/issues",
      subCategories: [
        "Teknik Sorunlar",
        "Rezervasyon Sorunları",
        "Ödeme Sorunları",
        "Otel Şikayetleri",
        "Geri Bildirim"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Yardım Merkezi</h1>
            <p className="text-lg text-gray-600">
              Size nasıl yardımcı olabileceğimizi seçin veya arama yapın
            </p>
          </div>
          
          {/* Arama Bölümü */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Nasıl yardımcı olabiliriz?"
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Popüler aramalar:</span>
              <button className="text-sm text-blue-600 hover:text-blue-700">rezervasyon iptali</button>
              <button className="text-sm text-blue-600 hover:text-blue-700">ödeme seçenekleri</button>
              <button className="text-sm text-blue-600 hover:text-blue-700">fatura talebi</button>
            </div>
          </div>
          
          {/* Yardım Kategorileri */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <Link to={category.link} className="block">
                  <div className="text-blue-600 mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <ul className="space-y-2">
                    {category.subCategories.map((sub, idx) => (
                      <li key={idx} className="text-sm text-gray-500 hover:text-blue-600 transition">
                        • {sub}
                      </li>
                    ))}
                  </ul>
                </Link>
              </div>
            ))}
          </div>
          
          {/* İletişim Bilgileri */}
          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Hala yardıma mı ihtiyacınız var?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <Phone className="text-blue-600 mr-3" size={24} />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">7/24 Destek Hattı</h3>
                  <p className="text-gray-600 mb-1">Hemen Arayın</p>
                  <a href="tel:+1555123-4567" className="text-blue-600 hover:text-blue-700 font-medium">
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="text-blue-600 mr-3" size={24} />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">E-posta Desteği</h3>
                  <p className="text-gray-600 mb-1">24 Saat İçinde Yanıt</p>
                  <a href="mailto:support@staycomfort.com" className="text-blue-600 hover:text-blue-700 font-medium">
                    support@staycomfort.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <MessageCircle className="text-blue-600 mr-3" size={24} />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Canlı Destek</h3>
                  <p className="text-gray-600 mb-1">09:00 - 18:00</p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                    <span>Sohbeti Başlat</span>
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YardimMerkezi; 