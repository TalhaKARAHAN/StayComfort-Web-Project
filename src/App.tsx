import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import HotelListPage from './pages/HotelListPage';
import HotelDetailPage from './pages/HotelDetailPage';
import RoomSelectionPage from './pages/RoomSelectionPage';
import PaymentPage from './pages/PaymentPage';
import ReservationSummaryPage from './pages/ReservationSummaryPage';
import UserDashboardPage from './pages/UserDashboardPage';
import SSS from './pages/support/SSS';
import YardimMerkezi from './pages/support/YardimMerkezi';
import BizeUlasin from './pages/support/BizeUlasin';
import KullanimSartlari from './pages/support/KullanimSartlari';
import GizlilikPolitikasi from './pages/support/GizlilikPolitikasi';

// Components
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/hotels" element={<HotelListPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/hotels/:id/rooms" element={<RoomSelectionPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/reservation-summary" element={<ReservationSummaryPage />} />
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/sss" element={<SSS />} />
          <Route path="/yardim-merkezi" element={<YardimMerkezi />} />
          <Route path="/bize-ulasin" element={<BizeUlasin />} />
          <Route path="/kullanim-sartlari" element={<KullanimSartlari />} />
          <Route path="/gizlilik-politikasi" element={<GizlilikPolitikasi />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;