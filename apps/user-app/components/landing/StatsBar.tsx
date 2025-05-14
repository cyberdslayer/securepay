export default function StatsBar() {
  return (
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
  );
}