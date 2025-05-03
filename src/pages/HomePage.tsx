import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, CreditCard, MapPin, Star } from 'lucide-react';
import SearchForm from '../components/SearchForm';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center pt-24 pb-16"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Mükemmel Konaklamanızı Bulun
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            En iyi fiyatlarla en iyi otelleri keşfedin, özel teklifler ve indirimlerle.
          </p>
          
          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-5xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Neden Bizimle Rezervasyon Yapmalısınız
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Search className="text-blue-600" size={48} />,
                title: "Kolay Arama",
                description: "Güçlü filtreleme sistemimizle ideal otelinizi bulun."
              },
              {
                icon: <Star className="text-blue-600" size={48} />,
                title: "En İyi Fiyatlar",
                description: "Fiyat eşleştirme politikamızla en iyi fiyatları garanti ediyoruz."
              },
              {
                icon: <Calendar className="text-blue-600" size={48} />,
                title: "Ücretsiz İptal",
                description: "Planlar değişti mi? Check-in'den 24 saat öncesine kadar ücretsiz iptal edin."
              },
              {
                icon: <CreditCard className="text-blue-600" size={48} />,
                title: "Güvenli Ödeme",
                description: "Ödeme ve kişisel bilgileriniz her zaman korunur."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-lg shadow-md text-center transition-transform hover:transform hover:scale-105"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Hotels */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Öne Çıkan Oteller
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                name: "Lüks Okyanus Tatil Köyü",
                location: "Miami, FL",
                price: "₺299",
                rating: 4.8
              },
              {
                image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                name: "Dağ Manzaralı Konak",
                location: "Aspen, CO",
                price: "₺199",
                rating: 4.6
              },
              {
                image: "https://images.pexels.com/photos/2869215/pexels-photo-2869215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                name: "Şehir Butik Oteli",
                location: "New York, NY",
                price: "₺249",
                rating: 4.7
              }
            ].map((hotel, index) => (
              <div key={index} className="card overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full py-1 px-3 flex items-center">
                    <Star className="text-yellow-500 mr-1" size={16} />
                    <span className="font-semibold">{hotel.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin size={16} className="mr-1" />
                    <span>{hotel.location}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{hotel.name}</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{hotel.price}</span>
                      <span className="text-gray-500 ml-1">gecelik</span>
                    </div>
                    <Link to={`/hotels/${index + 1}`} className="btn btn-primary">
                      Detayları Görüntüle
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/hotels" className="btn btn-outline">
              Tüm Otelleri Görüntüle
            </Link>
          </div>
        </div>
      </section>
      
      {/* Promotion Banner */}
      <section 
        className="relative py-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Özel Yaz Promosyonu
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            31 Ağustos'a kadar rezervasyon yaptığınızda seçili otellerde %30'a varan indirim kazanın.
          </p>
          <Link to="/search" className="btn btn-lg btn-primary">
            Şimdi Rezervasyon Yap
          </Link>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Müşterilerimiz Ne Diyor
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Emma Thompson",
                photo: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                text: "Odam Hazır otel bulmayı ve rezervasyon yapmayı çok kolay hale getirdi. Fiyatlar diğer sitelere göre daha iyiydi ve rezervasyonumu değiştirmem gerektiğinde müşteri hizmetleri mükemmeldi."
              },
              {
                name: "Michael Johnson",
                photo: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                text: "Odam Hazır'ı hem iş hem de tatil seyahatlerim için kullandım. Arayüz temiz ve sezgisel, filtreleme ve tam olarak ihtiyacım olanı bulmayı kolaylaştırıyor. Şiddetle tavsiye ederim!"
              },
              {
                name: "Sophia Martinez",
                photo: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                text: "Ücretsiz iptal seçeneği, belirsiz zamanlarda rezervasyon yaparken bana huzur verdi. Ve iptal etmem gerektiğinde, süreç sorunsuzdu. Odam Hazır'ı kesinlikle tekrar kullanacağım."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.photo} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="#F59E0B" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;