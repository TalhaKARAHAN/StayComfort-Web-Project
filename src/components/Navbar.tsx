import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Hotel } from 'lucide-react';
import { authService } from '../services/authService';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.getCurrentUser() !== null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleAuthChange = (loggedIn: boolean) => {
      setIsLoggedIn(loggedIn);
    };

    authService.onAuthChange(handleAuthChange);
    return () => {
      authService.onAuthChange(() => {}); // Cleanup listener
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isHomePage = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || !isHomePage ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold"
            aria-label="Ana sayfaya git"
          >
            <Hotel
              className={`${
                isScrolled || !isHomePage ? 'text-blue-600' : 'text-white'
              }`}
              size={28}
            />
            <span
              className={`${
                isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'
              }`}
            >
              Odam Hazır
            </span>
          </Link>

          {/* Masaüstü Navigasyonu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/search"
              className={`text-lg font-medium ${
                isScrolled || !isHomePage
                  ? 'text-gray-700 hover:text-blue-600'
                  : 'text-white hover:text-blue-200'
              }`}
              aria-label="Otelleri ara"
            >
              Otel Ara
            </Link>
            <Link
              to="/hotels"
              className={`text-lg font-medium ${
                isScrolled || !isHomePage
                  ? 'text-gray-700 hover:text-blue-600'
                  : 'text-white hover:text-blue-200'
              }`}
              aria-label="Öne çıkan otelleri görüntüle"
            >
              Öne Çıkanlar
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-lg font-medium ${
                    isScrolled || !isHomePage
                      ? 'text-gray-700 hover:text-blue-600'
                      : 'text-white hover:text-blue-200'
                  }`}
                  aria-label="Hesabınızı yönetin"
                >
                  Hesabım
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-lg font-medium text-red-600 hover:text-red-800"
                  aria-label="Hesabınızdan çıkış yapın"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-lg font-medium ${
                    isScrolled || !isHomePage
                      ? 'text-gray-700 hover:text-blue-600'
                      : 'text-white hover:text-blue-200'
                  }`}
                  aria-label="Hesabınıza giriş yapın"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  aria-label="Yeni bir hesap oluşturun"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </nav>

          {/* Mobil Menü Butonu */}
          <button
            className="md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          >
            {isMenuOpen ? (
              <X
                className={
                  isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'
                }
                size={24}
              />
            ) : (
              <Menu
                className={
                  isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'
                }
                size={24}
              />
            )}
          </button>
        </div>

        {/* Mobil Navigasyon */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-6 space-y-4 border-t mt-4 border-gray-200">
            <Link
              to="/search"
              className="block py-2 text-lg font-medium text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Otel Ara
            </Link>
            <Link
              to="/hotels"
              className="block py-2 text-lg font-medium text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Öne Çıkanlar
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 text-lg font-medium text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hesabım
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block py-2 text-lg font-medium text-red-600"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-lg font-medium text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="block w-full btn btn-primary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;