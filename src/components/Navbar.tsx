import React from 'react';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, openLoginModal, logout } = useAuthStore();
  const { openCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">ScanCart</span>
          </div>
          
          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium">Hello, {user?.name}</span>
                <button 
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={openLoginModal}
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <User size={20} className="mr-1" />
                <span>Login</span>
              </button>
            )}
            
            <button 
              onClick={openCart}
              className="relative flex items-center text-gray-700 hover:text-blue-600"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 space-y-2 border-t border-gray-200">
            <button 
              onClick={() => {
                openCart();
                setIsMenuOpen(false);
              }}
              className="relative flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <ShoppingCart size={20} className="mr-2" />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="ml-2 flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm font-medium">
                  Hello, {user?.name}
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  openLoginModal();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <User size={20} className="mr-2" />
                <span>Login</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;