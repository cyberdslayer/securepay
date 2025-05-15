import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiArrowRight, FiShield, FiSend, FiBarChart } from 'react-icons/fi';

interface HeroProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export default function Hero({ onGetStarted, onLearnMore }: HeroProps) {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-600 border border-blue-100 shadow-sm">
              <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-blue-600"></span>
              New Feature: Secure Remote Password Protocol
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Financial Solutions</span> for Everyone
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Experience secure transactions, seamless transfers, and intelligent financial management—all in one beautiful platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-medium rounded-md shadow-md hover:shadow-lg transition-all flex items-center justify-center"
              >
                Create Free Account <FiArrowRight className="ml-2" />
              </button>
              <button
                onClick={onLearnMore}
                className="px-8 py-4 bg-white text-gray-800 text-base font-medium border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center"
              >
                Learn More
              </button>
            </div>
            
            <div className="pt-6">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-white flex items-center justify-center overflow-hidden shadow-sm">
                      <span className="text-xs font-medium text-indigo-600">{String.fromCharCode(64 + i)}</span>
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
            
            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 pt-6">
              <div className="flex items-center text-xs text-gray-500">
                <FiShield className="text-blue-600 mr-1" />
                <span>Bank-grade security</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <FiSend className="text-blue-600 mr-1" />
                <span>Instant transfers</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <FiBarChart className="text-blue-600 mr-1" />
                <span>Smart analytics</span>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            <div className="relative mx-auto max-w-md">
              {/* Background glow effects */}
              <div className="absolute -top-4 -right-4 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
              <div className="absolute -bottom-8 -left-4 w-64 h-64 bg-indigo-300 rounded-full filter blur-3xl opacity-30"></div>
              
              {/* Card with device mockup */}
              <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <img 
                  src="/hero.png" 
                  alt="PaySmart App Dashboard"
                  className="w-full h-auto"
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-transparent p-6">
                  <div className="text-center">
                    <div className="font-medium text-gray-800">Download our mobile app</div>
                    <div className="flex justify-center gap-4 mt-2">
                      <div className="bg-black text-white px-3 py-1.5 rounded-md text-xs flex items-center shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.26 2-1.62 4.14-3.74 4.25z" />
                        </svg>
                        App Store
                      </div>
                      <div className="bg-black text-white px-3 py-1.5 rounded-md text-xs flex items-center shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.523 9.387l-2.764-1.556-7.506 7.628 7.506 7.628 2.764-1.556c1.675-.942 2.858-2.66 2.858-4.815V14.155c.026-2.135-1.158-3.853-2.858-4.768z" />
                          <path d="M3.544 5.847L.94 7.249c-.732.413-.94 1.39-.94 2.036v5.482c0 .645.21 1.622.94 2.036l2.605 1.402c.732.413 1.902.273 2.605-.148l.063-.036-3.95-4.06L3.48 9.924l.073-.039c-.705-.42-1.854-.558-2.584-.147z" />
                          <path d="M3.544 18.15c.732.413 1.902.273 2.605-.149l7.463-7.594-7.463-7.595c-.704-.421-1.873-.562-2.605-.148h-.001a2.553 2.553 0 0 0-.323.2l10.032 10.419L2.298 23.929v-7.91c0 .721 1.094 1.824 1.247 1.932z" />
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
      
      {/* Abstract shape decorations */}
      <div className="absolute -bottom-6 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-full opacity-10"></div>
      <div className="absolute top-32 right-0 w-64 h-64 bg-gradient-to-bl from-blue-200 to-indigo-200 rounded-full opacity-10 blur-2xl"></div>
    </section>
  );
}