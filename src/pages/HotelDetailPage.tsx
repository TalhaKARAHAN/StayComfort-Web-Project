import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Users, Calendar, Coffee, Wifi, Car, Utensils, Dumbbell, Space as Spa, School as Pool, Check, ChevronsRight, ChevronLeft, ChevronRight, Bookmark, CreditCard } from 'lucide-react';
import { authService } from '../services/authService';

interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  longDescription: string;
  images: string[];
  price: number;
  rating: number;
  reviews: {
    id: number;
    user: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
  }[];
  amenities: {
    name: string;
    icon: string;
  }[];
  policies: {
    title: string;
    details: string;
  }[];
  mapLocation: {
    lat: number;
    lng: number;
  };
  rooms: Room[];
}

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
}

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = authService.getCurrentUser();
  const [activeTab, setActiveTab] = useState('about');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  
  useEffect(() => {
    const checkIfHotelSaved = () => {
      if (currentUser && currentUser.savedHotels) {
        setIsSaved(currentUser.savedHotels.some(hotel => hotel.id === id));
      }
    };

    // Burada normalde API'den otel detaylarını çekecektik
    // Şimdilik örnek veri kullanıyoruz
    setHotel({
      id: id || '1',
      name: "Luxury Ocean Resort",
      location: "Miami, FL",
      description: "Muhteşem okyanus manzaralı lüks resort otel",
      longDescription: `
        Welcome to Luxury Ocean Resort, where paradise meets luxury. Our beachfront property offers an unparalleled experience with breathtaking ocean views and world-class amenities.
        
        Nestled on the pristine shores of Miami Beach, our resort provides the perfect backdrop for a memorable vacation. Whether you're seeking relaxation or adventure, our resort caters to all your desires.
        
        Our spacious rooms and suites are elegantly designed with modern furnishings and premium bedding to ensure maximum comfort. Each accommodation features a private balcony, allowing you to savor the magnificent ocean views and gentle sea breeze.
        
        Indulge in culinary delights at our award-winning restaurants, offering a diverse range of international cuisines prepared by our talented chefs using the freshest ingredients. From casual beachside dining to fine dining experiences, we have something for every palate.
        
        Pamper yourself at our luxurious spa, which offers a variety of rejuvenating treatments designed to relax and revitalize your body and mind. Our state-of-the-art fitness center is equipped with the latest equipment for maintaining your workout routine, and our infinity pool provides a refreshing retreat with panoramic ocean views.
      `,
      images: [
        "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/2869215/pexels-photo-2869215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      ],
      price: 299,
      rating: 4.8,
      reviews: [
        {
          id: 1,
          user: "Emma Thompson",
          avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          rating: 5,
          date: "2023-06-15",
          comment: "Absolutely stunning resort with exceptional service. The oceanfront view from our room was breathtaking! The staff went above and beyond to make our stay special. Will definitely return."
        },
        {
          id: 2,
          user: "Michael Johnson",
          avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          rating: 4,
          date: "2023-05-22",
          comment: "Great location and beautiful facilities. The rooms are spacious and comfortable with amazing views. The only downside was the restaurant prices being quite high, but the food quality was excellent."
        },
        {
          id: 3,
          user: "Sophia Martinez",
          avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          rating: 5,
          date: "2023-04-08",
          comment: "Perfect getaway destination! The beach access was convenient, and the pool area was perfect for relaxing. The spa services were top-notch, and the staff was friendly and attentive."
        }
      ],
      amenities: [
        { name: "Free WiFi", icon: "wifi" },
        { name: "Parking", icon: "car" },
        { name: "Restaurant", icon: "utensils" },
        { name: "Fitness Center", icon: "dumbbell" },
        { name: "Spa", icon: "spa" },
        { name: "Swimming Pool", icon: "pool" },
        { name: "Breakfast", icon: "coffee" },
        { name: "Room Service", icon: "utensils" },
        { name: "Beachfront", icon: "pool" },
        { name: "Bar/Lounge", icon: "utensils" },
        { name: "Air Conditioning", icon: "coffee" },
        { name: "Concierge", icon: "coffee" }
      ],
      policies: [
        {
          title: "Check-in/Check-out",
          details: "Check-in time is 3:00 PM. Check-out time is 11:00 AM. Early check-in and late check-out are available upon request and subject to availability."
        },
        {
          title: "Cancellation Policy",
          details: "Free cancellation up to 48 hours before check-in. Cancellations made within 48 hours of check-in are subject to a charge equivalent to one night's stay."
        },
        {
          title: "Children Policy",
          details: "Children of all ages are welcome. Children under 12 years stay free when using existing bedding. Cribs are available upon request."
        },
        {
          title: "Pet Policy",
          details: "Pets are not allowed, with the exception of service animals."
        }
      ],
      mapLocation: {
        lat: 25.7617,
        lng: -80.1918
      },
      rooms: [
        {
          id: "room1",
          name: "Deluxe Okyanus Manzaralı Oda",
          description: "King yatak ve özel balkonlu oda",
          price: 299,
          capacity: 2,
          amenities: ["Balkon", "Mini bar", "Klima"]
        },
        {
          id: "room2",
          name: "Suite Oda",
          description: "Geniş yaşam alanlı süit",
          price: 499,
          capacity: 4,
          amenities: ["Oturma odası", "Jakuzi", "Mutfak"]
        }
      ]
    });
    setLoading(false);
    checkIfHotelSaved();
  }, [id, currentUser]);
  
  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'wifi':
        return <Wifi className="text-blue-600" size={24} />;
      case 'car':
        return <Car className="text-blue-600" size={24} />;
      case 'utensils':
        return <Utensils className="text-blue-600" size={24} />;
      case 'dumbbell':
        return <Dumbbell className="text-blue-600" size={24} />;
      case 'spa':
        return <Spa className="text-blue-600" size={24} />;
      case 'pool':
        return <Pool className="text-blue-600" size={24} />;
      case 'coffee':
        return <Coffee className="text-blue-600" size={24} />;
      default:
        return <Check className="text-blue-600" size={24} />;
    }
  };
  
  const navigateToRooms = () => {
    const params = new URLSearchParams();
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);
    
    navigate(`/hotels/${id}/rooms?${params.toString()}`);
  };
  
  const nextImage = () => {
    if (hotel) {
      setActiveImageIndex((prevIndex) => 
        prevIndex === hotel.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  const prevImage = () => {
    if (hotel) {
      setActiveImageIndex((prevIndex) => 
        prevIndex === 0 ? hotel.images.length - 1 : prevIndex - 1
      );
    }
  };
  
  const handleSaveHotel = async () => {
    try {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      if (!hotel) return;

      await authService.toggleSavedHotel(currentUser.id, hotel.id);
      setIsSaved(!isSaved);
      
      if (!isSaved) {
        alert('Otel favorilerinize eklendi!');
      } else {
        alert('Otel favorilerinizden kaldırıldı!');
      }
    } catch (err: any) {
      setError(err.message || 'Otel kaydedilirken bir hata oluştu');
    }
  };

  const handleReservation = async () => {
    try {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      if (!selectedRoom || !hotel) {
        alert('Lütfen bir oda seçin');
        return;
      }

      // Ödeme sayfasına yönlendir
      navigate(`/payment`, {
        state: {
          hotelId: hotel.id,
          hotelName: hotel.name,
          roomId: selectedRoom,
          roomName: hotel.rooms.find(r => r.id === selectedRoom)?.name,
          price: hotel.rooms.find(r => r.id === selectedRoom)?.price
        }
      });
    } catch (err: any) {
      setError(err.message || 'Rezervasyon yapılırken bir hata oluştu');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }
  
  if (!hotel) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Hotel Not Found</h2>
          <p className="text-lg text-gray-600 mb-6">The hotel you're looking for doesn't exist or has been removed.</p>
          <Link to="/hotels" className="btn btn-primary">
            Browse Other Hotels
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Image Gallery */}
        <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg" aria-label="Hotel image gallery">
          <div className="relative h-96">
            <img
              src={hotel.images[activeImageIndex]}
              alt={`${hotel.name} - image ${activeImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            <button 
              onClick={prevImage} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={nextImage} 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {hotel.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                  aria-label={`View image ${index + 1}`}
                  aria-current={index === activeImageIndex}
                ></button>
              ))}
            </div>
          </div>
          <button
            onClick={handleSaveHotel}
            className={`absolute top-4 right-4 p-3 rounded-full ${
              isSaved ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
            } shadow-lg hover:scale-105 transition-transform`}
          >
            <Bookmark size={24} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Hotel Details */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Hotel Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={20} className="mr-1" />
                      <span className="text-lg">{hotel.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-lg">
                    <Star size={20} className="mr-1" fill="currentColor" />
                    <span className="text-lg font-semibold">{hotel.rating}/5</span>
                  </div>
                </div>
                
                <p className="text-lg text-gray-700">{hotel.description}</p>
              </div>
              
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {['about', 'amenities', 'reviews', 'policies'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-lg font-medium transition-colors ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      aria-selected={activeTab === tab}
                      aria-controls={`${tab}-panel`}
                      id={`${tab}-tab`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="p-6">
                {/* About Tab */}
                <div
                  id="about-panel"
                  role="tabpanel"
                  aria-labelledby="about-tab"
                  hidden={activeTab !== 'about'}
                  className={activeTab === 'about' ? 'animate-fadeIn' : ''}
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">About The Property</h2>
                  <div className="text-lg text-gray-700 space-y-4">
                    {hotel.longDescription.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  
                  {/* Map Placeholder - would be replaced with an actual map component */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
                    <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                      <p className="text-gray-600">Map would be displayed here</p>
                    </div>
                    <p className="mt-2 text-gray-600">{hotel.location}</p>
                  </div>
                </div>
                
                {/* Amenities Tab */}
                <div
                  id="amenities-panel"
                  role="tabpanel"
                  aria-labelledby="amenities-tab"
                  hidden={activeTab !== 'amenities'}
                  className={activeTab === 'amenities' ? 'animate-fadeIn' : ''}
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Property Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotel.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        {getAmenityIcon(amenity.icon)}
                        <span className="ml-3 text-lg text-gray-700">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Reviews Tab */}
                <div
                  id="reviews-panel"
                  role="tabpanel"
                  aria-labelledby="reviews-tab"
                  hidden={activeTab !== 'reviews'}
                  className={activeTab === 'reviews' ? 'animate-fadeIn' : ''}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Guest Reviews</h2>
                    <div className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                      <Star size={20} className="mr-2" fill="currentColor" />
                      <span className="text-xl font-bold">{hotel.rating}</span>
                      <span className="ml-1 text-lg">/5</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {hotel.reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex items-start">
                          <img
                            src={review.avatar}
                            alt={review.user}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{review.user}</h3>
                                <p className="text-gray-500 text-sm">
                                  {new Date(review.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center">
                                <Star size={18} className="text-yellow-500" fill="currentColor" />
                                <span className="ml-1 font-medium">{review.rating}</span>
                              </div>
                            </div>
                            <p className="mt-3 text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Policies Tab */}
                <div
                  id="policies-panel"
                  role="tabpanel"
                  aria-labelledby="policies-tab"
                  hidden={activeTab !== 'policies'}
                  className={activeTab === 'policies' ? 'animate-fadeIn' : ''}
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Hotel Policies</h2>
                  <div className="space-y-6">
                    {hotel.policies.map((policy, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">{policy.title}</h3>
                        <p className="text-lg text-gray-700">{policy.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Widget */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Stay</h2>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-blue-600">${hotel.price}</div>
                  <div className="text-gray-500">per night</div>
                </div>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="detail-check-in" className="block text-lg font-medium text-gray-700 mb-1">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="detail-check-in"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      aria-label="Select check-in date"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="detail-check-out" className="block text-lg font-medium text-gray-700 mb-1">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="detail-check-out"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      aria-label="Select check-out date"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="detail-guests" className="block text-lg font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      id="detail-guests"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      aria-label="Select number of guests"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests</option>
                    </select>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={navigateToRooms}
                  className="btn btn-primary w-full text-xl flex items-center justify-center"
                  aria-label="View available rooms"
                  disabled={!checkIn || !checkOut}
                >
                  <span>View Rooms</span>
                  <ChevronsRight size={20} className="ml-2" />
                </button>
                
                <p className="text-center text-sm text-gray-500">No payment required today</p>
              </form>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Why Book With Us</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Best price guarantee</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Free cancellation on most rooms</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">No booking or credit card fees</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailPage;