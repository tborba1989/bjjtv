import React, { useState } from 'react';
import { Menu, X, MapPin, Clock } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              className="h-10"
              src="/images/logo-default.png"
              alt="RN BJJ TV"
            />
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>Sede Natal/RN</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>Dom-Dom: 9:00 - 17:00</span>
            </div>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="flex items-center text-gray-600 py-2">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Sede Natal/RN</span>
              </div>
              <div className="flex items-center text-gray-600 py-2">
                <Clock className="h-5 w-5 mr-2" />
                <span>Dom-Dom: 9:00 - 17:00</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;