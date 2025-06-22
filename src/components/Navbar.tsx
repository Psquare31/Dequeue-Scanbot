import React from "react";
import { FiUser, FiShoppingCart } from "react-icons/fi";
import { useAuth0 } from "@auth0/auth0-react";
import { useCartStore } from "../store/useCartStore";
import { Transition } from "@headlessui/react";

const Navbar: React.FC = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const { openCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 shadow-md fixed top-0 left-0 right-0 z-50" style={{backgroundColor: "#FFEFDF"}}>
      <div className="relative md:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <FiUser size={24} />
        </button>

        <Transition
          show={isMenuOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 -translate-y-2 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 -translate-y-2 scale-95"
        >
          <div className="absolute top-full left-0 mt-2 w-44 rounded-xl bg-white/50 backdrop-blur-xl border border-white/10 shadow-lg z-50">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm font-medium text-gray-800">
                  Hello, {user?.name}
                </div>
                <button
                  onClick={() => {
                  logout({ logoutParams: { returnTo: window.location.origin } });
                  setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 hover:text-red-700 hover:backdrop-blur-sm rounded-md"
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-white/40 hover:backdrop-blur-sm rounded-md"
              >
                Log In
              </button>
            )}
          </div>
        </Transition>
      </div>

      
      <button
        onClick={() => {
          openCart();
        }}
        className="relative flex items-center text-red-500"
      >
        <FiShoppingCart className="text-2xl" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
            {totalItems}
          </span>
        )}
      </button>
    </nav>
  );
};

export default Navbar;
