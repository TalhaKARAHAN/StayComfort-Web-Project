import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ChevronRight, Calendar, Users, MapPin, Mail, Phone, Clock, ArrowDownToLine, Share2 } from 'lucide-react';

const ReservationSummaryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reservationData = location.state || {};
  
  useEffect(() => {
    // If there's no reservation data, redirect to the home page
    if (!reservationData.confirmationNumber) {
      navigate('/');
    }
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [reservationData, navigate]);
  
  const calculateNights = () => {
    if (!reservationData.checkIn || !reservationData.checkOut) return 1;
    
    const checkInDate = new Date(reservationData.checkIn);
    const checkOutDate = new Date(reservationData.checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 1;
  };
  
  const nights = calculateNights();
  const totalPrice = Math.round((reservationData.price || 0) * nights * 1.1);
  
  // Format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const checkInDate = formatDate(reservationData.checkIn);
  const checkOutDate = formatDate(reservationData.checkOut);
  
  // Handle print reservation
  const handlePrint = () => {
    window.print();
  };
  
  if (!reservationData.confirmationNumber) {
    return null; // This will be redirected in the useEffect
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your reservation has been successfully confirmed. A confirmation email has been sent to {reservationData.guestInfo?.email}.
          </p>
        </div>
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight size={16} className="mx-2" />
          <Link to="/hotels" className="hover:text-blue-600 transition-colors">Hotels</Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-700">Reservation Confirmation</span>
        </div>
        
        {/* Reservation Details Card */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Reservation Confirmation</h2>
              <div className="flex items-center text-lg text-gray-600">
                <span className="font-medium">Confirmation #:</span>
                <span className="ml-2 text-blue-600 font-bold">{reservationData.confirmationNumber}</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <button
                onClick={handlePrint}
                className="btn btn-outline flex items-center"
                aria-label="Print reservation details"
              >
                <ArrowDownToLine size={20} className="mr-2" />
                <span>Print</span>
              </button>
              
              <button
                className="btn btn-outline flex items-center"
                aria-label="Share reservation details"
              >
                <Share2 size={20} className="mr-2" />
                <span>Share</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hotel and Room Details */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hotel & Room Details</h3>
              
              {reservationData.hotelName && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900">{reservationData.hotelName}</h4>
                  
                  <div className="flex items-start mt-2">
                    <MapPin size={18} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">{reservationData.hotelLocation}</p>
                  </div>
                </div>
              )}
              
              {reservationData.roomImage && (
                <div className="mb-6 relative">
                  <img
                    src={reservationData.roomImage}
                    alt={reservationData.roomName || "Room"}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 rounded-b-lg">
                    <p className="font-medium">{reservationData.roomName}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar size={18} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Check-in:</span> {checkInDate}
                    </p>
                    <p className="text-sm text-gray-500">From 3:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar size={18} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Check-out:</span> {checkOutDate}
                    </p>
                    <p className="text-sm text-gray-500">Until 11:00 AM</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock size={18} className="text-gray-500 mr-2 flex-shrink-0" />
                  <p className="text-gray-600">
                    <span className="font-medium">Duration:</span> {nights} {nights > 1 ? 'nights' : 'night'}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <Users size={18} className="text-gray-500 mr-2 flex-shrink-0" />
                  <p className="text-gray-600">
                    <span className="font-medium">Guests:</span> {reservationData.guests} {parseInt(reservationData.guests) > 1 ? 'people' : 'person'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Guest and Payment Details */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Guest & Payment Details</h3>
              
              {reservationData.guestInfo && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900">Guest Information</h4>
                  
                  <div className="space-y-3 mt-3">
                    <p className="text-gray-600">
                      <span className="font-medium">Name:</span> {reservationData.guestInfo.firstName} {reservationData.guestInfo.lastName}
                    </p>
                    
                    <div className="flex items-center">
                      <Mail size={18} className="text-gray-500 mr-2 flex-shrink-0" />
                      <p className="text-gray-600">
                        {reservationData.guestInfo.email}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone size={18} className="text-gray-500 mr-2 flex-shrink-0" />
                      <p className="text-gray-600">
                        {reservationData.guestInfo.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Payment Summary</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Room Rate:</p>
                    <p className="text-gray-800">${reservationData.price}/night</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Duration:</p>
                    <p className="text-gray-800">{nights} {nights > 1 ? 'nights' : 'night'}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal:</p>
                    <p className="text-gray-800">${(reservationData.price || 0) * nights}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Taxes & Fees (10%):</p>
                    <p className="text-gray-800">${Math.round((reservationData.price || 0) * nights * 0.1)}</p>
                  </div>
                  
                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-2 font-medium">
                    <p className="text-gray-800">Total Paid:</p>
                    <p className="text-blue-600 text-xl">${totalPrice}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-green-800 font-medium mb-2">Cancellation Policy</h4>
                <p className="text-green-700 text-sm">
                  Free cancellation until 48 hours before check-in. Cancellations after this time will be charged for the first night.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Check Your Email",
                description: "We've sent a confirmation email with all the details to your email address."
              },
              {
                title: "Download Our App",
                description: "Get easy access to your booking details and more with our mobile app."
              },
              {
                title: "Need Help?",
                description: "Our customer service team is available 24/7 to assist you with any questions."
              }
            ].map((step, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                <h4 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Related Offers */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Airport Shuttle Service",
                image: "https://images.pexels.com/photos/1158935/pexels-photo-1158935.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                description: "Book a convenient shuttle service to/from the airport."
              },
              {
                name: "Local Tours & Activities",
                image: "https://images.pexels.com/photos/1056553/pexels-photo-1056553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                description: "Explore the local area with guided tours and exciting activities."
              },
              {
                name: "Special Dining Experience",
                image: "https://images.pexels.com/photos/6270680/pexels-photo-6270680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                description: "Enhance your stay with exclusive dining experiences."
              }
            ].map((offer, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                <div className="h-44 overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{offer.name}</h4>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  <button className="btn btn-outline w-full">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/" className="btn btn-primary btn-lg text-xl">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationSummaryPage;