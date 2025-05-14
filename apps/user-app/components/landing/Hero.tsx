import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface HeroProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export default function Hero({ onGetStarted, onLearnMore }: HeroProps) {
  return (
    <section className="pt-28 pb-16 md:pt-40 md:pb-24 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-600">
              <span className="animate-pulse mr-1">●</span> New Feature: Instant International Transfers
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Smart Payments <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">for Smart People</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              Send money instantly, track your expenses, and manage your finances—all in one secure platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-medium rounded-lg hover:shadow-lg transition-all hover:-translate-y-1"
              >
                Create Free Account
              </button>
              <button
                onClick={onLearnMore}
                className="px-8 py-4 bg-white text-gray-800 text-lg font-medium border border-gray-300 rounded-lg hover:border-indigo-600 transition-all hover:-translate-y-1"
              >
                See How It Works
              </button>
            </div>
            
            <div className="pt-6">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden">
                      <span className="text-xs font-medium text-gray-600">{String.fromCharCode(64 + i)}</span>
                    </div>
                  ))}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-800">Trusted by 10,000+ users</div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-500">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            <div className="relative mx-auto max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl transform rotate-3 scale-105 opacity-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl transform -rotate-3 scale-105 opacity-10"></div>
              <div className="relative bg-white rounded-xl shadow-xl overflow-hidden">
                <img 
                  src="/hero.png" 
                  alt="PaySmart App Dashboard"
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/70 to-transparent p-6">
                  <div className="text-center">
                    <div className="font-medium text-gray-800">App available on iOS and Android</div>
                    <div className="flex justify-center gap-4 mt-2">
                      <div className="bg-black text-white px-3 py-1 rounded-lg text-xs flex items-center">
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.26 2-1.62 4.14-3.74 4.25z" />
                        </svg>
                        App Store
                      </div>
                      <div className="bg-black text-white px-3 py-1 rounded-lg text-xs flex items-center">
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 19.656l-8.828-8.829a4 4 0 010-5.655z" />
                        </svg>
                        Play Store
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}