import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiMenu, FiX, FiChevronRight } from 'react-icons/fi';

interface NavigationProps {
  onLogin: () => void;
  onGetStarted: () => void;
  onScrollToFeatures: () => void;
  onScrollToSecurity: () => void;
  onScrollToPricing: () => void;
  onScrollToFaq: () => void;
}

export default function Navigation({
  onLogin,
  onGetStarted,
  onScrollToFeatures,
  onScrollToSecurity,
  onScrollToPricing,
  onScrollToFaq
}: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' 
          : 'bg-gradient-to-b from-blue-50 to-transparent backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image 
                src="/pana.png" 
                alt="PaySmart logo" 
                layout="fill" 
                objectFit="contain"
                priority 
              />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              PaySmart
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={onScrollToFeatures} 
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              Features
            </button>
            <button 
              onClick={onScrollToSecurity} 
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              Security
            </button>
            <button 
              onClick={onScrollToPricing} 
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={onScrollToFaq} 
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              FAQ
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin}
              className="hidden md:block px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Log In
            </button>
            <button 
              onClick={onGetStarted}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:shadow-md transition-all flex items-center"
            >
              Get Started <FiChevronRight className="ml-1" />
            </button>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-xl shadow-lg p-5 absolute left-4 right-4 border border-gray-100">
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  onScrollToFeatures();
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-700 py-2 hover:text-blue-600 transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => {
                  onScrollToSecurity();
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-700 py-2 hover:text-blue-600 transition-colors font-medium"
              >
                Security
              </button>
              <button 
                onClick={() => {
                  onScrollToPricing();
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-700 py-2 hover:text-blue-600 transition-colors font-medium"
              >
                Pricing
              </button>
              <button 
                onClick={() => {
                  onScrollToFaq();
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-700 py-2 hover:text-blue-600 transition-colors font-medium"
              >
                FAQ
              </button>
              <div className="border-t border-gray-200 my-2"></div>
              <button 
                onClick={() => {
                  onLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex justify-center items-center transition-colors"
              >
                Sign In <FiChevronRight className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}