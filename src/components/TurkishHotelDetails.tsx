import { HotelDetails } from '../types/hotel';
import { turkishHotels } from './TurkishHotels';

const hotelDetails: { [key: string]: Partial<HotelDetails> } = {
  "1": {
    images: [
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
      "https://images.unsplash.com/photo-1615460549969-36fa19521a4f"
    ],
    longDescription: "Boğaz'ın muhteşem manzarasına hakim Swissotel The Bosphorus, İstanbul'un en prestijli 5 yıldızlı otellerinden biridir. Tarihi yarımadaya yakınlığı ve modern lüks anlayışıyla hem iş hem de tatil amaçlı konaklamalar için mükemmel bir seçimdir.\n\nOtelimiz, 65 dönümlük tarihi bahçe içerisinde yer almaktadır. Tüm odalarımız şehir veya Boğaz manzaralıdır ve en son teknoloji ile donatılmıştır.\n\nPürovel Spa & Sport tesisimiz, kapalı ve açık havuzları, fitness merkezi ve spa olanaklarıyla misafirlerimize tam bir yenilenme deneyimi sunmaktadır.",
    reviews: [
      {
        id: "r1",
        userName: "Ahmet Yılmaz",
        rating: 5,
        date: "2024-02-15",
        comment: "Mükemmel manzara ve kusursuz hizmet. Özellikle kahvaltı çok zengindi.",
        verified: true,
        helpful: 12
      },
      {
        id: "r2",
        userName: "Ayşe Kaya",
        rating: 4.5,
        date: "2024-02-10",
        comment: "Spa merkezi harika, odalar çok konforlu. Tek eksik restoranda vejeteryan seçeneklerin azlığıydı.",
        verified: true,
        helpful: 8
      }
    ],
    policies: [
      {
        title: "Giriş/Çıkış Saatleri",
        details: "Giriş: 14:00'den itibaren\nÇıkış: 12:00'ye kadar",
        category: "check-in",
        isImportant: true
      },
      {
        title: "İptal Politikası",
        details: "Ücretsiz iptal için son tarih konaklamadan 24 saat öncesidir.",
        category: "cancellation",
        isImportant: true
      },
      {
        title: "Çocuk Politikası",
        details: "12 yaş altı çocuklar ebeveynleriyle aynı odada ücretsiz konaklayabilir.",
        category: "children",
        isImportant: false
      }
    ],
    rooms: [
      {
        id: "classic-1",
        name: "Klasik Oda",
        description: "35m² büyüklüğünde, şehir manzaralı, çift kişilik yatak",
        price: 450,
        capacity: 2,
        amenities: ["wifi", "minibar", "tv", "safe", "aircon"],
        images: [
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
        ],
        size: 35,
        bedType: "double",
        view: "city",
        isAvailable: true,
        maxOccupancy: 2,
        basePrice: 450,
        discountedPrice: null
      },
      {
        id: "bosphorus-1",
        name: "Boğaz Manzaralı Oda",
        description: "40m² büyüklüğünde, boğaz manzaralı, king size yatak",
        price: 650,
        capacity: 2,
        amenities: ["wifi", "minibar", "tv", "safe", "aircon", "balcony"],
        images: [
          "https://images.unsplash.com/photo-1615460549969-36fa19521a4f",
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af"
        ],
        size: 40,
        bedType: "king",
        view: "sea",
        isAvailable: true,
        maxOccupancy: 3,
        basePrice: 650,
        discountedPrice: null
      }
    ],
    checkInTime: "14:00",
    checkOutTime: "12:00",
    coordinates: {
      lat: 41.0425,
      lng: 29.0177
    }
  },
  "2": {
    images: [
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945"
    ],
    longDescription: "Titanic Beach Lara, Antalya'nın en prestijli sahil şeridinde yer alan ultra her şey dahil konseptli bir resort oteldir. Geniş plaj alanı, çoklu restoran seçenekleri ve zengin animasyon programıyla unutulmaz bir tatil deneyimi sunar.\n\nOtelimiz, 500 metre uzunluğundaki özel plajı, 7 açık ve 2 kapalı havuzu ile misafirlerine geniş bir yüzme alanı sunmaktadır. Spa merkezi, fitness salonu ve çeşitli spor aktiviteleri ile sağlıklı bir tatil imkanı sağlar.",
    reviews: [
      {
        id: "r3",
        userName: "Mehmet Demir",
        rating: 4.8,
        date: "2024-02-18",
        comment: "Plaj ve havuzlar muhteşem. Animasyon ekibi çok ilgili ve eğlenceli.",
        verified: true,
        helpful: 15
      }
    ],
    policies: [
      {
        title: "Giriş/Çıkış Saatleri",
        details: "Giriş: 14:00'den itibaren\nÇıkış: 12:00'ye kadar",
        category: "check-in",
        isImportant: true
      },
      {
        title: "İptal Politikası",
        details: "Ücretsiz iptal için son tarih konaklamadan 48 saat öncesidir.",
        category: "cancellation",
        isImportant: true
      }
    ],
    rooms: [
      {
        id: "standard-1",
        name: "Standart Oda",
        description: "30m² büyüklüğünde, bahçe manzaralı oda",
        price: 350,
        capacity: 2,
        amenities: ["wifi", "minibar", "tv", "aircon"],
        images: [
          "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd"
        ],
        size: 30,
        bedType: "double",
        view: "garden",
        isAvailable: true,
        maxOccupancy: 2,
        basePrice: 350,
        discountedPrice: null
      }
    ],
    checkInTime: "14:00",
    checkOutTime: "12:00",
    coordinates: {
      lat: 36.8519,
      lng: 30.8519
    }
  },
  "3": {
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
      "https://images.unsplash.com/photo-1615460549969-36fa19521a4f"
    ],
    longDescription: "Mandarin Oriental Bodrum, Ege'nin muhteşem kıyılarında yer alan ultra lüks bir oteldir. Özel plajları, dünyaca ünlü spa merkezi ve eşsiz körfez manzarasıyla misafirlerine benzersiz bir deneyim sunar.\n\nOtelimiz, Cennet Koyu'nun kristal berraklığındaki sularına bakan konumuyla, modern lüks anlayışını Akdeniz yaşam tarzıyla harmanlıyor. Her biri özenle tasarlanmış odalarımız ve süitlerimiz, en üst düzey konfor ve teknolojiyle donatılmıştır.",
    reviews: [
      {
        id: "r4",
        userName: "Can Yılmaz",
        rating: 5,
        date: "2024-02-20",
        comment: "Mükemmel bir deneyimdi. Özellikle spa merkezi ve restoranlar olağanüstüydü.",
        verified: true,
        helpful: 20
      }
    ],
    policies: [
      {
        title: "Giriş/Çıkış Saatleri",
        details: "Giriş: 15:00'den itibaren\nÇıkış: 12:00'ye kadar",
        category: "check-in",
        isImportant: true
      },
      {
        title: "İptal Politikası",
        details: "Ücretsiz iptal için son tarih konaklamadan 72 saat öncesidir.",
        category: "cancellation",
        isImportant: true
      }
    ],
    rooms: [
      {
        id: "deluxe-1",
        name: "Deluxe Deniz Manzaralı Oda",
        description: "45m² büyüklüğünde, özel balkonlu ve deniz manzaralı lüks oda",
        price: 550,
        capacity: 2,
        amenities: ["wifi", "minibar", "tv", "safe", "aircon", "balcony", "room-service"],
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945",
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
        ],
        size: 45,
        bedType: "king",
        view: "sea",
        isAvailable: true,
        maxOccupancy: 3,
        basePrice: 550,
        discountedPrice: null
      }
    ],
    checkInTime: "15:00",
    checkOutTime: "12:00",
    coordinates: {
      lat: 37.0322,
      lng: 27.4242
    },
    contact: {
      phone: "+90 252 311 1888",
      email: "mobod-reservations@mohg.com",
      website: "www.mandarinoriental.com/bodrum",
      address: "Paradise Bay, Göltürkbükü, 48400 Bodrum, Turkey"
    },
    facilities: [
      {
        name: "Spa Merkezi",
        description: "2.700 m²'lik alanda lüks spa ve wellness merkezi",
        icon: "spa",
        isAvailable: true
      },
      {
        name: "Özel Plaj",
        description: "İki adet özel plaj ve beach club",
        icon: "beach",
        isAvailable: true
      }
    ],
    nearbyAttractions: [
      {
        name: "Bodrum Kalesi",
        distance: 8.5,
        type: "landmark"
      },
      {
        name: "Göltürkbükü Marina",
        distance: 1.2,
        type: "marina"
      }
    ],
    languages: ["Türkçe", "İngilizce", "Rusça", "Almanca"],
    paymentMethods: ["Credit Card", "Cash", "Bank Transfer"],
    sustainability: {
      isEcoFriendly: true,
      certifications: ["Green Globe", "Travelife Gold"]
    }
  },
  "4": {
    images: [
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd",
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd"
    ],
    longDescription: "Museum Hotel Cappadocia, UNESCO Dünya Mirası Listesi'nde yer alan Kapadokya'nın kalbinde, tarihi bir mağara otelde benzersiz bir konaklama deneyimi sunar. Otelin her bir odası, bölgenin zengin tarihini ve kültürünü yansıtan antik eserlerle dekore edilmiştir.\n\nOtelimiz, Uçhisar Kalesi manzarasına sahip teraslı restoranı, şarap mahzeni ve açık havuz gibi özel olanaklarıyla misafirlerine unutulmaz anlar yaşatır.",
    reviews: [
      {
        id: "r5",
        userName: "Emma Smith",
        rating: 5,
        date: "2024-02-19",
        comment: "Absolutely magical experience. The cave rooms are stunning and the service is impeccable.",
        verified: true,
        helpful: 18
      }
    ],
    policies: [
      {
        title: "Giriş/Çıkış Saatleri",
        details: "Giriş: 14:00'den itibaren\nÇıkış: 11:00'e kadar",
        category: "check-in",
        isImportant: true
      },
      {
        title: "İptal Politikası",
        details: "Ücretsiz iptal için son tarih konaklamadan 7 gün öncesidir.",
        category: "cancellation",
        isImportant: true
      }
    ],
    rooms: [
      {
        id: "cave-1",
        name: "Deluxe Mağara Oda",
        description: "40m² büyüklüğünde, özel terası olan tarihi mağara oda",
        price: 400,
        capacity: 2,
        amenities: ["wifi", "minibar", "tv", "safe", "aircon", "terrace"],
        images: [
          "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd",
          "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b"
        ],
        size: 40,
        bedType: "king",
        view: "mountain",
        isAvailable: true,
        maxOccupancy: 2,
        basePrice: 400,
        discountedPrice: null
      }
    ],
    checkInTime: "14:00",
    checkOutTime: "11:00",
    coordinates: {
      lat: 38.6321,
      lng: 34.8289
    },
    contact: {
      phone: "+90 384 219 2220",
      email: "info@museumhotel.com.tr",
      website: "www.museumhotel.com.tr",
      address: "Tekelli Mahallesi No:1, 50240 Uçhisar/Nevşehir"
    },
    facilities: [
      {
        name: "Lil'a Restaurant",
        description: "Panoramik manzaralı fine dining restoran",
        icon: "restaurant",
        isAvailable: true
      },
      {
        name: "Roman Pool",
        description: "Isıtmalı açık yüzme havuzu",
        icon: "pool",
        isAvailable: true
      }
    ],
    nearbyAttractions: [
      {
        name: "Uçhisar Kalesi",
        distance: 0.5,
        type: "landmark"
      },
      {
        name: "Göreme Açık Hava Müzesi",
        distance: 3.0,
        type: "museum"
      }
    ],
    languages: ["Türkçe", "İngilizce"],
    paymentMethods: ["Credit Card", "Cash"],
    sustainability: {
      isEcoFriendly: true,
      certifications: ["Green Key"]
    }
  },
  "5": {
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd",
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945"
    ],
    longDescription: "Hilton Garden Inn Izmir, İzmir'in merkezi iş bölgesinde modern ve konforlu bir konaklama deneyimi sunar. Otelimiz, hem iş hem de tatil amaçlı seyahat edenler için ideal bir konuma sahiptir.\n\nTüm odalarımız ergonomik çalışma alanı, yüksek hızlı internet ve modern amenities ile donatılmıştır. 24 saat açık fitness merkezi ve restoran-bar hizmetlerimizle misafirlerimizin tüm ihtiyaçlarını karşılıyoruz.",
    reviews: [
      {
        id: "r6",
        userName: "Murat Demir",
        rating: 4.5,
        date: "2024-02-17",
        comment: "İş seyahati için ideal. Temiz odalar ve yardımsever personel.",
        verified: true,
        helpful: 10
      }
    ],
    policies: [
      {
        title: "Giriş/Çıkış Saatleri",
        details: "Giriş: 14:00'den itibaren\nÇıkış: 12:00'ye kadar",
        category: "check-in",
        isImportant: true
      },
      {
        title: "İptal Politikası",
        details: "Ücretsiz iptal için son tarih konaklamadan 24 saat öncesidir.",
        category: "cancellation",
        isImportant: true
      }
    ],
    rooms: [
      {
        id: "business-1",
        name: "Business Oda",
        description: "28m² büyüklüğünde, ergonomik çalışma alanı olan modern oda",
        price: 200,
        capacity: 2,
        amenities: ["wifi", "desk", "tv", "safe", "aircon", "coffee-maker"],
        images: [
          "https://images.unsplash.com/photo-1582719508461-905c673771fd",
          "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b"
        ],
        size: 28,
        bedType: "double",
        view: "city",
        isAvailable: true,
        maxOccupancy: 2,
        basePrice: 200,
        discountedPrice: null
      }
    ],
    checkInTime: "14:00",
    checkOutTime: "12:00",
    coordinates: {
      lat: 38.4622,
      lng: 27.2176
    },
    contact: {
      phone: "+90 232 999 1234",
      email: "izmir.info@hilton.com",
      website: "www.hilton.com/izmir",
      address: "Manas Bulvarı No:40, 35530 Bayraklı/İzmir"
    },
    facilities: [
      {
        name: "24/7 Business Center",
        description: "Tam donanımlı iş merkezi",
        icon: "business",
        isAvailable: true
      },
      {
        name: "Fitness Center",
        description: "24 saat açık fitness merkezi",
        icon: "gym",
        isAvailable: true
      }
    ],
    nearbyAttractions: [
      {
        name: "Bayraklı İş Merkezi",
        distance: 0.3,
        type: "business"
      },
      {
        name: "Kordon",
        distance: 4.0,
        type: "landmark"
      }
    ],
    languages: ["Türkçe", "İngilizce"],
    paymentMethods: ["Credit Card", "Cash", "Corporate Billing"],
    sustainability: {
      isEcoFriendly: true,
      certifications: ["ISO 14001"]
    }
  },
  "6": {
    images: [
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd",
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b"
    ],
    longDescription: "DoubleTree by Hilton Trabzon, Karadeniz'in eşsiz manzarasına hakim konumuyla şehir merkezinde modern bir konaklama deneyimi sunar. Sıcak çikolatalı kurabiyemizle karşıladığımız misafirlerimiz için konforlu odalar ve profesyonel hizmet sunuyoruz.\n\nOtelimiz, toplantı salonları ve modern konferans olanaklarıyla iş toplantılarınız için ideal bir mekan, aynı zamanda şehir gezileriniz için merkezi bir üs görevi görür.",
    reviews: [
      {
        id: "r7",
        userName: "Ali Yılmaz",
        rating: 4.3,
        date: "2024-02-16",
        comment: "Şehir manzarası harika, personel çok ilgili. Kahvaltı zengin.",
        verified: true,
        helpful: 8
      }
    ],
    policies: [
      {
        title: "Giriş/Çıkış Saatleri",
        details: "Giriş: 15:00'den itibaren\nÇıkış: 12:00'ye kadar",
        category: "check-in",
        isImportant: true
      },
      {
        title: "İptal Politikası",
        details: "Ücretsiz iptal için son tarih konaklamadan 24 saat öncesidir.",
        category: "cancellation",
        isImportant: true
      }
    ],
    rooms: [
      {
        id: "standard-2",
        name: "Standart Şehir Manzaralı Oda",
        description: "32m² büyüklüğünde, modern dekore edilmiş oda",
        price: 180,
        capacity: 2,
        amenities: ["wifi", "tv", "safe", "aircon", "minibar"],
        images: [
          "https://images.unsplash.com/photo-1566737236500-c8ac43014a67",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd"
        ],
        size: 32,
        bedType: "double",
        view: "city",
        isAvailable: true,
        maxOccupancy: 2,
        basePrice: 180,
        discountedPrice: null
      }
    ],
    checkInTime: "15:00",
    checkOutTime: "12:00",
    coordinates: {
      lat: 41.0027,
      lng: 39.7168
    },
    contact: {
      phone: "+90 462 666 5000",
      email: "trabzon.info@hilton.com",
      website: "www.hilton.com/trabzon",
      address: "Değirmendere Mah. Devlet Sahil Yolu Cad. No:195, 61040 Trabzon"
    },
    facilities: [
      {
        name: "Meeting Rooms",
        description: "Modern toplantı ve konferans salonları",
        icon: "meeting",
        isAvailable: true
      },
      {
        name: "Restaurant & Bar",
        description: "Panoramik manzaralı restoran ve bar",
        icon: "restaurant",
        isAvailable: true
      }
    ],
    nearbyAttractions: [
      {
        name: "Forum Trabzon AVM",
        distance: 1.0,
        type: "shopping"
      },
      {
        name: "Trabzon Havalimanı",
        distance: 5.0,
        type: "transport"
      }
    ],
    languages: ["Türkçe", "İngilizce"],
    paymentMethods: ["Credit Card", "Cash"],
    sustainability: {
      isEcoFriendly: true,
      certifications: ["ISO 14001"]
    }
  }
};

export const getTurkishHotelDetails = (id: string): HotelDetails | null => {
  const baseHotel = turkishHotels.find(hotel => hotel.id === id);
  const details = hotelDetails[id];
  
  if (!baseHotel || !details) {
    return null;
  }

  return {
    ...baseHotel,
    ...details,
    images: details.images || [baseHotel.image],
    longDescription: details.longDescription || baseHotel.description,
    reviews: details.reviews || [],
    policies: details.policies || [],
    rooms: details.rooms || [],
    checkInTime: details.checkInTime || "14:00",
    checkOutTime: details.checkOutTime || "12:00",
    coordinates: details.coordinates || { lat: 0, lng: 0 },
    contact: details.contact || {
      phone: "",
      email: "",
      website: "",
      address: ""
    },
    facilities: details.facilities || [],
    nearbyAttractions: details.nearbyAttractions || [],
    languages: details.languages || ["Türkçe", "İngilizce"],
    paymentMethods: details.paymentMethods || ["Credit Card", "Cash"],
    sustainability: details.sustainability || {
      isEcoFriendly: false,
      certifications: []
    }
  } as HotelDetails;
}; 