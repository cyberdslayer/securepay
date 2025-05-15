import Image from 'next/image';
import { FiTwitter, FiInstagram, FiGithub, FiLinkedin, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-600 py-16 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-gray-800 text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-800 text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-600 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Press</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-800 text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Community</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-800 text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-10 h-10 relative">
              <Image 
                src="/pana.png" 
                alt="PaySmart logo" 
                layout="fill" 
                objectFit="contain"
                priority 
              />
            </div>
            <span className="text-gray-800 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              PaySmart
            </span>
          </div>
          
          <div className="flex items-center gap-5">
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
              <FiTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
              <FiInstagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
              <FiGithub className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
              <FiLinkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
              <FiFacebook className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm">
          <p>© {new Date().getFullYear()} PaySmart. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Made with <span className="text-red-500">❤</span> in India
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <a href="#" className="text-gray-500 hover:text-blue-600 text-xs">Privacy</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-gray-500 hover:text-blue-600 text-xs">Terms</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-gray-500 hover:text-blue-600 text-xs">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}