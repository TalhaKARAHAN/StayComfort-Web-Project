import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const SSS: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "Rezervasyon nasıl yapabilirim?",
      answer: "Otel arama sayfamızdan konum, tarih ve misafir sayısı bilgilerini girerek arama yapabilirsiniz. Size uygun oteli seçtikten sonra oda tipini belirleyip, kişisel bilgilerinizi girerek rezervasyonunuzu tamamlayabilirsiniz. Rezervasyon onayınız e-posta adresinize gönderilecektir."
    },
    {
      question: "Rezervasyonumu nasıl iptal edebilirim veya değiştirebilirim?",
      answer: "Rezervasyonunuzu iptal etmek veya değiştirmek için hesabınıza giriş yaparak 'Rezervasyonlarım' bölümünden ilgili rezervasyonu seçebilirsiniz. Her otelin farklı iptal ve değişiklik politikaları olduğunu unutmayın. Ücretsiz iptal süresini geçirdiyseniz, iptal ücreti uygulanabilir. Değişiklik yapmak için müşteri hizmetlerimizle iletişime geçmeniz gerekebilir."
    },
    {
      question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
      answer: "Tüm major kredi kartları (Visa, MasterCard, American Express), banka kartları ve online banka havalesi/EFT ile ödeme yapabilirsiniz. Bazı otellerde rezervasyon sırasında ön ödeme gerekmeyebilir, otele girişte ödeme yapabilirsiniz. Ödeme seçenekleri rezervasyon aşamasında detaylı olarak gösterilmektedir."
    },
    {
      question: "Otel giriş (check-in) ve çıkış (check-out) saatleri nelerdir?",
      answer: "Standart giriş saati genellikle 14:00, çıkış saati ise 12:00'dir. Ancak bu saatler otelden otele değişiklik gösterebilir. Erken giriş veya geç çıkış talepleri için doğrudan otelle iletişime geçmeniz veya rezervasyon sırasında not olarak belirtmeniz gerekmektedir. Bu hizmetler müsaitlik durumuna göre ek ücrete tabi olabilir."
    },
    {
      question: "Çocuklar ve bebekler için politikanız nedir?",
      answer: "Çocuk politikası her otele göre değişmektedir. Genel olarak 0-2 yaş arası bebekler ücretsizdir ve bebek yatağı talep edilebilir. 2-12 yaş arası çocuklar için ek yatak veya mevcut yatakları kullanma seçenekleri mevcuttur. Kesin bilgi için otel detay sayfasındaki 'Çocuk Politikası' bölümünü inceleyebilir veya müşteri hizmetlerimizle iletişime geçebilirsiniz."
    },
    {
      question: "Özel isteklerimi nasıl iletebilirim?",
      answer: "Rezervasyon sırasında 'Özel İstekler' bölümüne notunuzu yazabilirsiniz (örn: üst kat oda, sigara içilmeyen oda, yastık tercihi vb.). Ayrıca rezervasyon onayından sonra otel ile doğrudan iletişime geçebilir veya müşteri hizmetlerimizden yardım alabilirsiniz. Özel isteklerin karşılanması otelin müsaitlik durumuna bağlıdır."
    },
    {
      question: "Grup rezervasyonu yapmak istiyorum. Ne yapmalıyım?",
      answer: "10 odadan fazla grup rezervasyonları için özel fiyatlar ve koşullar sunuyoruz. Grup rezervasyonları için lütfen 'Bize Ulaşın' sayfasından bizimle iletişime geçin veya grup rezervasyon formumuzu doldurun. Size özel teklifimizi en kısa sürede ileteceğiz."
    },
    {
      question: "Rezervasyon onayımı göremiyorum. Ne yapmalıyım?",
      answer: "Rezervasyon onayınız, işlem tamamlandıktan hemen sonra kayıtlı e-posta adresinize gönderilir. Spam/gereksiz klasörünüzü kontrol etmeyi unutmayın. Onay e-postası almadıysanız, 'Rezervasyonlarım' sayfasından rezervasyon durumunuzu kontrol edebilir veya müşteri hizmetlerimizle iletişime geçebilirsiniz."
    },
    {
      question: "Fatura bilgilerimi nasıl güncelleyebilirim?",
      answer: "Rezervasyon sırasında veya sonrasında fatura bilgilerinizi güncelleyebilirsiniz. Rezervasyon tamamlandıktan sonra fatura bilgisi güncellemek için 'Rezervasyonlarım' sayfasından ilgili rezervasyonu seçip 'Fatura Bilgileri' bölümünden değişiklik yapabilirsiniz. Ayrıca müşteri hizmetlerimizle iletişime geçerek de güncelleme yapabilirsiniz."
    },
    {
      question: "Otelde ek hizmetler (spa, restoran vb.) rezervasyonu yapabilir miyim?",
      answer: "Evet, birçok otelimizde ek hizmetler için önceden rezervasyon yapabilirsiniz. Otel detay sayfasında 'Ek Hizmetler' bölümünden müsaitlik durumunu kontrol edebilir ve rezervasyon yapabilirsiniz. Bazı hizmetler için otele giriş sonrası rezervasyon yapılması gerekebilir."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Sıkça Sorulan Sorular</h1>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-lg font-medium text-gray-900">{item.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="text-gray-500" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-500" size={20} />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Başka Sorunuz mu Var?</h2>
            <p className="text-gray-700 mb-4">
              Aradığınız cevabı bulamadıysanız, müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyacaktır.
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Bize Ulaşın
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSS; 