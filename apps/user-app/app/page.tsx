"use client"

import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { FiLock, FiShield, FiKey } from 'react-icons/fi';

// Import landing page components
import Hero from '../components/landing/Hero';
import StatsBar from '../components/landing/StatsBar';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Pricing from '../components/landing/Pricing';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';
import Navigation from '../components/landing/Navigation';

export default function Home() {
  const router = useRouter();
  
  const featuresRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Handle user navigation
  const signup = () => {
    router.push('api/auth/signin');
  };

  // Scroll event handlers
  const scrollToRef = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFeatures = () => scrollToRef(featuresRef);
  const scrollToSecurity = () => scrollToRef(securityRef);
  const scrollToPricing = () => scrollToRef(pricingRef);
  const scrollToFaq = () => scrollToRef(faqRef);
  const scrollToGetStarted = () => scrollToRef(ctaRef);

  return (
    <div className="min-h-screen w-full">
      {/* Navigation Bar */}
      <Navigation 
        onLogin={signup}
        onGetStarted={signup}
        onScrollToFeatures={scrollToFeatures}
        onScrollToSecurity={scrollToSecurity}
        onScrollToPricing={scrollToPricing}
        onScrollToFaq={scrollToFaq}
      />

      {/* Hero Section */}
      <Hero 
        onGetStarted={signup}
        onLearnMore={scrollToFeatures}
      />

      {/* Stats Bar */}
      <StatsBar />

      {/* Features Section */}
      <div ref={featuresRef}>
        <Features id="features" />
      </div>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Security Section - Added to address SRP */}
      <section ref={securityRef} id="security" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Security</span> Measures
            </h2>
            <p className="text-lg text-gray-600">
              Your security is our top priority. We use the latest encryption and security protocols to protect your data and money.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl transform rotate-2 scale-105 opacity-10"></div>
              <div className="relative rounded-xl overflow-hidden shadow-xl border border-gray-100">
                <img 
                  src="/security.jpg" 
                  alt="Security Illustration"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Floating security badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <FiShield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Bank-level Security</p>
                    <p className="text-xs text-gray-600">ISO 27001 Certified</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8 order-1 md:order-2">
              {/* SRP Protocol Feature */}
              <div className="space-y-3 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <FiLock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Secure Remote Password (SRP)</h3>
                </div>
                <p className="text-gray-600 pl-13">
                  We implement the Secure Remote Password protocol, a zero-knowledge proof system that allows secure authentication without sending your password over the network.
                </p>
              </div>
              
              {/* Two-Factor Authentication */}
              <div className="space-y-3 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <FiShield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h3>
                </div>
                <p className="text-gray-600 pl-13">
                  Add an extra layer of security to your account with two-factor authentication to prevent unauthorized access.
                </p>
              </div>
              
              {/* End-to-End Encryption */}
              <div className="space-y-3 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <FiKey className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">End-to-End Encryption</h3>
                </div>
                <p className="text-gray-600 pl-13">
                  All your data is encrypted on your device and can only be decrypted by the intended recipient, ensuring complete privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <div ref={pricingRef}>
        <Pricing id="pricing" onSelectPlan={signup} />
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <section ref={faqRef} id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Questions</span>
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about PaySmart services.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How do I create an account?",
                answer: "Creating an account is simple! Just click 'Get Started' and follow the registration process. You'll need to provide your phone number and create a secure password."
              },
              {
                question: "Are there any transaction fees?",
                answer: "Basic peer-to-peer transactions are completely free. Premium features like international transfers may have nominal fees which are clearly displayed before confirming any transaction."
              },
              {
                question: "How secure is PaySmart?",
                answer: "We implement bank-level security measures including Secure Remote Password protocol, two-factor authentication, and end-to-end encryption to ensure your money and data are always protected."
              },
              {
                question: "Can I use PaySmart for business transactions?",
                answer: "Yes! We offer specialized business accounts with features like multiple user access, API integration, and detailed financial reporting to help manage your business finances efficiently."
              },
              {
                question: "How quickly are transfers processed?",
                answer: "Domestic transfers are processed instantly. International transfers typically complete within 1-2 business days depending on the destination country."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                    <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" width="24" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div ref={ctaRef}>
        <CTA id="cta" onGetStarted={signup} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}