import { FiSend, FiUsers, FiActivity, FiHeadphones } from 'react-icons/fi';

export default function StatsBar() {
  return (
    <section className="relative z-10 mx-6 md:mx-auto -mt-6 max-w-5xl">
      <div className="bg-white rounded-xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 border border-gray-100">
        <div className="text-center p-4 hover:bg-blue-50 transition-colors rounded-lg">
          <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <FiSend className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">₹0</div>
          <div className="text-sm text-gray-600 mt-1">Transfer Fee</div>
        </div>
        
        <div className="text-center p-4 hover:bg-blue-50 transition-colors rounded-lg">
          <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <FiUsers className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">10K+</div>
          <div className="text-sm text-gray-600 mt-1">Active Users</div>
        </div>
        
        <div className="text-center p-4 hover:bg-blue-50 transition-colors rounded-lg">
          <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <FiActivity className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">99.9%</div>
          <div className="text-sm text-gray-600 mt-1">Uptime</div>
        </div>
        
        <div className="text-center p-4 hover:bg-blue-50 transition-colors rounded-lg">
          <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <FiHeadphones className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">24/7</div>
          <div className="text-sm text-gray-600 mt-1">Support</div>
        </div>
      </div>
    </section>
  );
}