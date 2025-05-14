import { useState, useEffect } from 'react';

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
      className={`fixed w-full z-50 transition-all duration-300 py-4 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/50 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <span className="text-xl font-bold text-gray-900">PaySmart</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={onScrollToFeatures} className="text-gray-600 hover:text-indigo-600 transition-colors">Features</button>
            <button onClick={onScrollToSecurity} className="text-gray-600 hover:text-indigo-600 transition-colors">Security</button>
            <button onClick={onScrollToPricing} className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</button>
            <button onClick={onScrollToFaq} className="text-gray-600 hover:text-indigo-600 transition-colors">FAQ</button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin}
              className="hidden md:block px-4 py-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Log In
            </button>
            <button 
              onClick={onGetStarted}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Get Started
            </button>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4 absolute left-4 right-4">
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  onScrollToFeatures();
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-800 py-2 hover:text-indigo-600 transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => {
                  onScrollToSecurity();
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-800 py-2 hover:text-indigo-600 transition-colors"
              >
                Security
              </button>
              <button 
                onClick={() => {
                  onScrollToPricing();
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-800 py-2 hover:text-indigo-600 transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => {
                  onScrollToFaq();
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-800 py-2 hover:text-indigo-600 transition-colors"
              >
                FAQ
              </button>
              <div className="border-t border-gray-200 my-2"></div>
              <button 
                onClick={() => {
                  onLogin();
                  setMobileMenuOpen(false);
                }}
                className="text-indigo-600 py-2 font-medium hover:text-indigo-800 transition-colors"
              >
                Log In
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}