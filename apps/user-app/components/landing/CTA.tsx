import { FiArrowRight, FiCheck } from 'react-icons/fi';

interface CTAProps {
  id?: string;
  onGetStarted: () => void;
}

export default function CTA({ id, onGetStarted }: CTAProps) {
  return (
    <section id={id} className="py-20 bg-gradient-to-b from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to experience better financial management?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied users who are already enjoying the benefits of PaySmart.
        </p>
        <button
          onClick={onGetStarted}
          className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-md shadow-md hover:shadow-lg transition-all flex items-center justify-center mx-auto"
        >
          Get Started — It's Free <FiArrowRight className="ml-2" />
        </button>
        
        <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-8 justify-center text-sm text-blue-100">
          <div className="flex items-center">
            <FiCheck className="mr-2" />
            No credit card required
          </div>
          <div className="flex items-center">
            <FiCheck className="mr-2" />
            Set up in minutes
          </div>
          <div className="flex items-center">
            <FiCheck className="mr-2" />
            Bank-grade security
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden opacity-10">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-36 -right-24 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}