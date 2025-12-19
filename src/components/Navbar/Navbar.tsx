import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { getCartCount } = useCart();
  const { user, logout } = useAuth()

  const scrollToCart = () => {
    const cartSection = document.getElementById('cart-section');
    if (cartSection) {
      cartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 my-15 md ${isScrolled
        ? 'bg-white/90 backdrop-blur-md shadow-md py-3'
        : 'bg-transparent py-5'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/Lunchbox.png"
              alt="LunchBox Logo"
              className="w-10 h-10 object-contain hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-shadow duration-300 rounded-lg"
            />
            <h2 className={`text-xl md:text-2xl font-bold transition-colors ${isScrolled ? 'text-gray-900' : 'text-black'
              }`}>
              Lunch<span className="text-primary">Box</span>
            </h2>
          </div>

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center gap-8 list-none">
            <li>
              <Link
                to="/"
                className={`font-medium transition-colors hover:text-primary ${isScrolled ? 'text-gray-700' : 'text-black'
                  }`}
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="#menu"
                onClick={(e) => { e.preventDefault(); scrollToId('menu'); }}
                className={`font-medium transition-colors hover:text-primary ${isScrolled ? 'text-gray-700' : 'text-black'
                  }`}
              >
                Menu
              </a>
            </li>
            <li>
              <a
                href="#why-choose"
                onClick={(e) => { e.preventDefault(); scrollToId('why-choose'); }}
                className={`font-medium transition-colors hover:text-primary ${isScrolled ? 'text-gray-700' : 'text-black'
                  }`}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#site-footer"
                onClick={(e) => { e.preventDefault(); scrollToId('site-footer'); }}
                className={`font-medium transition-colors hover:text-primary ${isScrolled ? 'text-gray-700' : 'text-black'
                  }`}
              >
                Contact
              </a>
            </li>
          </ul>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <button
              className={`p-2 rounded-lg transition-all hover:scale-110 ${isScrolled
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-black hover:bg-white/20'
                }`}
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>
            <button
              onClick={scrollToCart}
              className={`p-2 rounded-lg transition-all hover:scale-110 relative ${isScrolled
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-black hover:bg-white/20'
                }`}
              aria-label="Cart"
            >
              <FiShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {getCartCount()}
                </span>
              )}
            </button>
            {user ? (
              <>
                <button onClick={() => logout()} className="px-3 py-1 md:px-4 md:py-2 bg-red-500 text-white rounded-full font-medium text-xs md:text-sm hover:bg-red-600 transition-all whitespace-nowrap">Logout</button>
              </>
            ) : (
              <Link to="/login" className="px-3 py-1 md:px-4 md:py-2 lg:px-6 lg:py-2 bg-primary text-white rounded-full font-medium text-xs md:text-sm lg:text-base hover:bg-primary/90 transition-all hover:scale-105 shadow-lg whitespace-nowrap">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
