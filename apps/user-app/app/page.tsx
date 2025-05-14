"use client"

import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

const Home = () => {
  const router = useRouter();
  const signup = () => {
    router.push('api/auth/signin');
  };
  
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [scrollY, setScrollY] = useState(0);
  
  // Handle scroll events for animation effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGetStarted = () => {
    if (ctaRef.current) {
      ctaRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full">
      {/* Navigation Bar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <span className="text-xl font-bold text-gray-900">PaySmart</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" onClick={scrollToFeatures} className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#security" className="text-gray-600 hover:text-indigo-600 transition-colors">Security</a>
            <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#faq" className="text-gray-600 hover:text-indigo-600 transition-colors">FAQ</a>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={signup}
              className="hidden md:block px-4 py-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={signup}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
                  onClick={signup}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-medium rounded-lg hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  Create Free Account
                </button>
                <button
                  onClick={scrollToFeatures}
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

      {/* Floating stats bar */}
      <section className="relative z-10 mx-6 md:mx-auto -mt-6 max-w-5xl">
        <div className="bg-white rounded-xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">₹0</div>
            <div className="text-sm text-gray-600 mt-1">Transfer Fee</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">10K+</div>
            <div className="text-sm text-gray-600 mt-1">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">99.9%</div>
            <div className="text-sm text-gray-600 mt-1">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">24/7</div>
            <div className="text-sm text-gray-600 mt-1">Support</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All the <span className="text-indigo-600">Tools</span> You Need
            </h2>
            <p className="text-lg text-gray-600">
              PaySmart offers a comprehensive suite of financial tools designed to make your money management effortless.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                ),
                title: "Instant Transfers",
                description: "Send money to friends and family instantly with zero fees."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Secure Storage",
                description: "Lock your funds securely with industry-leading encryption."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Advanced Analytics",
                description: "Track spending patterns and manage your budget with detailed reports."
              },
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Real-time Notifications",
                description: "Stay informed with instant alerts for all account activities."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
                title: "Multiple Payment Options",
                description: "Add money using UPI, net banking, debit cards, or credit cards."
              },
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 flex items-start gap-4">
                <div className="shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How PaySmart <span className="text-indigo-600">Works</span>
            </h2>
            <p className="text-lg text-gray-600">
              Getting started with PaySmart is easy. Just follow these simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create an Account",
                description: "Sign up for free in less than 2 minutes with just your phone number"
              },
              {
                step: "02",
                title: "Add Money",
                description: "Load your wallet using UPI, net banking, or cards"
              },
              {
                step: "03",
                title: "Start Transacting",
                description: "Send money, pay bills, or make purchases instantly"
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all">
                  <div className="text-5xl font-bold text-indigo-100 mb-4">{step.step}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-indigo-100"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, <span className="text-indigo-600">Transparent</span> Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that works best for your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Basic",
                price: "Free",
                description: "Perfect for personal use",
                features: [
                  "Peer-to-Peer Transfers",
                  "Transaction History",
                  "Basic Analytics",
                  "Standard Support"
                ],
                cta: "Get Started",
                popular: false
              },
              {
                title: "Premium",
                price: "₹499",
                period: "/year",
                description: "For active users with higher limits",
                features: [
                  "Everything in Basic",
                  "Higher Transfer Limits",
                  "Advanced Analytics",
                  "Priority Support",
                  "Scheduled Transfers"
                ],
                cta: "Go Premium",
                popular: true
              },
              {
                title: "Business",
                price: "₹999",
                period: "/year",
                description: "For business transactions",
                features: [
                  "Everything in Premium",
                  "Multiple User Accounts",
                  "API Access",
                  "Dedicated Support",
                  "Custom Branding"
                ],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`relative rounded-xl overflow-hidden ${plan.popular ? 'ring-2 ring-indigo-600 transform scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs px-3 py-1 uppercase font-medium">
                    Most Popular
                  </div>
                )}
                <div className="bg-gray-50 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.title}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <button 
                    onClick={signup}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${plan.popular ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg' : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100'}`}
                  >
                    {plan.cta}
                  </button>
                </div>
                <div className="bg-white p-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="text-indigo-600">Users</span> Say
            </h2>
            <p className="text-lg text-gray-600">
              Don't just take our word for it. Hear from some of our satisfied users.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "PaySmart has completely changed how I manage my money. The interface is intuitive and transfers are lightning fast!",
                name: "Rahul Sharma",
                title: "Small Business Owner",
                avatar: "R"
              },
              {
                quote: "I love how easy it is to send money to friends. No more awkward reminders about who owes what after dinner!",
                name: "Priya Patel",
                title: "Software Engineer",
                avatar: "P"
              },
              {
                quote: "The analytics feature helps me track my spending habits. I've saved so much money since I started using PaySmart.",
                name: "Aditya Verma",
                title: "Marketing Manager",
                avatar: "A"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to experience smarter payments?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who are already enjoying the benefits of PaySmart.
          </p>
          <button
            onClick={signup}
            className="px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-lg hover:shadow-lg transition-all hover:-translate-y-1"
          >
            Get Started — It's Free
          </button>
          <p className="mt-4 text-sm text-indigo-200">
            No credit card required • Set up in minutes • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-white font-bold">PaySmart</span>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="text-center mt-8 text-sm">
            <p>© 2025 PaySmart. All rights reserved.</p>
            <p className="mt-1">Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;