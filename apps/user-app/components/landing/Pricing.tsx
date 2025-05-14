interface PricingPlan {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

interface PricingProps {
  id?: string;
  onSelectPlan: () => void;
}

export default function Pricing({ id, onSelectPlan }: PricingProps) {
  const plans: PricingPlan[] = [
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
  ];

  return (
    <section id={id} className="py-20 bg-white">
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
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative rounded-xl overflow-hidden ${
                plan.popular ? 'ring-2 ring-indigo-600 transform scale-105' : ''
              }`}
            >
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
                  onClick={onSelectPlan}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg' 
                      : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
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
  );
}