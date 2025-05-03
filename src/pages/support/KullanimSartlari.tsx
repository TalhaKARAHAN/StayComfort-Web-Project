import React from 'react';
import { Shield, FileText, AlertCircle, Clock, Lock, UserCheck } from 'lucide-react';

const KullanimSartlari: React.FC = () => {
  const sections = [
    {
      title: "Genel Hükümler",
      icon: <Shield className="w-6 h-6" />,
      content: [
        "Bu kullanım şartları, StayComfort.com web sitesini kullanımınızı düzenleyen yasal bir anlaşmadır.",
        "Siteyi kullanarak bu şartları kabul etmiş sayılırsınız.",
        "Şartlarda yapılacak değişiklikler, sitede yayınlandığı tarihte yürürlüğe girer.",
        "Şartları kabul etmiyorsanız, lütfen sitemizi kullanmayınız."
      ]
    },
    {
      title: "Rezervasyon ve İptal Politikası",
      icon: <FileText className="w-6 h-6" />,
      content: [
        "Rezervasyonlar, müsaitlik durumuna göre onaylanır.",
        "İptal politikaları otelden otele değişiklik gösterebilir.",
        "Ücretsiz iptal süresi genellikle giriş tarihinden 24 saat öncesine kadardır.",
        "No-show durumunda ilk gece ücreti tahsil edilebilir.",
        "Değişiklik talepleri müsaitlik durumuna göre değerlendirilir."
      ]
    },
    {
      title: "Ödeme Koşulları",
      icon: <Lock className="w-6 h-6" />,
      content: [
        "Tüm fiyatlar vergiler dahil olarak gösterilir.",
        "Ödemeler güvenli ödeme sistemleri üzerinden yapılır.",
        "Kredi kartı bilgileriniz şifrelenerek saklanır.",
        "Fatura bilgileri rezervasyon sırasında güncellenebilir.",
        "Döviz kurları günlük olarak güncellenir."
      ]
    },
    {
      title: "Kullanıcı Sorumlulukları",
      icon: <UserCheck className="w-6 h-6" />,
      content: [
        "Verdiğiniz bilgilerin doğruluğundan sorumlusunuz.",
        "Hesap güvenliğinizden siz sorumlusunuz.",
        "Siteyi yasal amaçlar için kullanmalısınız.",
        "Diğer kullanıcıların haklarına saygı göstermelisiniz.",
        "Sistem güvenliğini tehlikeye atacak işlemlerden kaçınmalısınız."
      ]
    },
    {
      title: "Gizlilik ve Veri Koruma",
      icon: <Lock className="w-6 h-6" />,
      content: [
        "Kişisel verileriniz KVKK kapsamında korunur.",
        "Verileriniz sadece hizmet sağlamak amacıyla kullanılır.",
        "Üçüncü taraflarla paylaşım için onayınız gerekir.",
        "Veri güvenliği için gerekli tüm önlemler alınır.",
        "Veri işleme politikamız hakkında detaylı bilgi için Gizlilik Politikamızı inceleyebilirsiniz."
      ]
    },
    {
      title: "Sorumluluk Sınırları",
      icon: <AlertCircle className="w-6 h-6" />,
      content: [
        "Otel hizmetlerinden otel işletmesi sorumludur.",
        "Teknik sorunlardan doğan zararlardan sorumlu değiliz.",
        "Üçüncü taraf hizmetlerinden doğan sorunlardan sorumlu değiliz.",
        "Doğal afetler ve mücbir sebeplerden doğan durumlarda sorumluluk kabul edilmez.",
        "Sitedeki bilgilerin doğruluğu için sürekli çaba gösterilir."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kullanım Şartları</h1>
            <p className="text-lg text-gray-600">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">
                StayComfort.com'u kullanmadan önce lütfen bu kullanım şartlarını dikkatlice okuyunuz. 
                Sitemizi kullanarak bu şartları kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız, 
                lütfen sitemizi kullanmayınız.
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
              <Clock className="text-blue-600 mr-4" size={24} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Önemli Not</h2>
                <p className="text-gray-700">
                  Bu kullanım şartları düzenli olarak güncellenmektedir. En güncel versiyonu için 
                  bu sayfayı periyodik olarak kontrol etmenizi öneririz. Şartlarda yapılan değişiklikler, 
                  sitede yayınlandığı tarihte yürürlüğe girer.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/gizlilik-politikasi"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Gizlilik Politikamızı İnceleyin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KullanimSartlari; 