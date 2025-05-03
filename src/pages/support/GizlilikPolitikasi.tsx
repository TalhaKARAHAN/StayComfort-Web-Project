import React from 'react';
import { Shield, Database, Eye, Share2, Lock, UserCheck, AlertCircle } from 'lucide-react';

const GizlilikPolitikasi: React.FC = () => {
  const sections = [
    {
      title: "Veri Toplama ve Kullanım",
      icon: <Database className="w-6 h-6" />,
      content: [
        "Kişisel verileriniz (ad, soyad, e-posta, telefon, kredi kartı bilgileri) sadece hizmet sağlamak amacıyla toplanır.",
        "Rezervasyon işlemleri için gerekli bilgiler otel işletmeleriyle paylaşılır.",
        "İletişim bilgileriniz size daha iyi hizmet sunmak için kullanılır.",
        "Ödeme bilgileriniz güvenli ödeme sistemleri üzerinden işlenir.",
        "Konum bilgileriniz sadece size yakın otelleri göstermek için kullanılır."
      ]
    },
    {
      title: "Veri Güvenliği",
      icon: <Lock className="w-6 h-6" />,
      content: [
        "SSL şifreleme teknolojisi ile verileriniz güvenle korunur.",
        "Kredi kartı bilgileriniz PCI DSS standartlarına uygun işlenir.",
        "Düzenli güvenlik denetimleri ve güncellemeler yapılır.",
        "Veri erişimi sadece yetkili personel ile sınırlıdır.",
        "Veri ihlali durumunda 72 saat içinde KVKK'ya bildirim yapılır."
      ]
    },
    {
      title: "Çerezler ve İzleme",
      icon: <Eye className="w-6 h-6" />,
      content: [
        "Sitemizde kullanılan çerezler kullanıcı deneyimini iyileştirmek içindir.",
        "Analitik çerezler site performansını ölçmek için kullanılır.",
        "Tercih çerezleri kullanıcı ayarlarınızı hatırlamak içindir.",
        "Reklam çerezleri size özel teklifler sunmak için kullanılır.",
        "Çerez tercihlerinizi tarayıcı ayarlarınızdan değiştirebilirsiniz."
      ]
    },
    {
      title: "Veri Paylaşımı",
      icon: <Share2 className="w-6 h-6" />,
      content: [
        "Verileriniz sadece hizmet sağlamak amacıyla üçüncü taraflarla paylaşılır.",
        "Otel işletmeleriyle sadece rezervasyon bilgileri paylaşılır.",
        "Ödeme işlemleri için güvenli ödeme sağlayıcıları kullanılır.",
        "Yasal zorunluluk durumunda yetkili mercilerle paylaşım yapılabilir.",
        "Veri paylaşımı için açık rızanız gereklidir."
      ]
    },
    {
      title: "Kullanıcı Hakları",
      icon: <UserCheck className="w-6 h-6" />,
      content: [
        "KVKK kapsamında verilerinize erişim hakkınız vardır.",
        "Verilerinizin düzeltilmesini talep edebilirsiniz.",
        "Verilerinizin silinmesini isteyebilirsiniz.",
        "Veri işlemeye itiraz etme hakkınız bulunmaktadır.",
        "Verilerinizin taşınmasını talep edebilirsiniz."
      ]
    },
    {
      title: "Özel Durumlar",
      icon: <AlertCircle className="w-6 h-6" />,
      content: [
        "18 yaş altı kullanıcılar için ebeveyn onayı gereklidir.",
        "Özel kategorideki veriler için ek güvenlik önlemleri alınır.",
        "Uluslararası veri transferi için gerekli güvenlik önlemleri sağlanır.",
        "Veri saklama süreleri yasal zorunluluklara göre belirlenir.",
        "Veri işleme amacı değiştiğinde siz bilgilendirilirsiniz."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gizlilik Politikası</h1>
            <p className="text-lg text-gray-600">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">
                odamhazir.com olarak kişisel verilerinizin güvenliği bizim için önemlidir. 
                Bu gizlilik politikası, hangi verilerinizi nasıl topladığımızı, kullandığımızı 
                ve koruduğumuzu açıklar. Sitemizi kullanarak bu politikayı kabul etmiş sayılırsınız.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-6">
                  <div className="text-blue-600 mr-4">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-4">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 rounded-lg p-8">
            <div className="flex items-start">
              <Shield className="text-blue-600 mr-4" size={24} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Veri Koruma Sorumlusu</h2>
                <p className="text-gray-700 mb-4">
                  Kişisel verilerinizle ilgili sorularınız ve talepleriniz için veri koruma sorumlumuza ulaşabilirsiniz:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>E-posta:</strong> kvkk@odamhazir.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Telefon:</strong> +90 (212) 123 45 67
                  </p>
                  <p className="text-gray-700">
                    <strong>Adres:</strong> Örnek Mahallesi, Veri Koruma Sokak No:1, 34000 İstanbul
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/kullanim-sartlari"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Kullanım Şartlarını İnceleyin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GizlilikPolitikasi; 