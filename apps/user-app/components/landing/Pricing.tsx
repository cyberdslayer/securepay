import { FiCheck, FiArrowRight } from 'react-icons/fi';

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
    <section id={id} className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Choose the plan that works best for your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative rounded-xl overflow-hidden bg-white border ${
                plan.popular ? 'border-blue-200 shadow-lg md:transform md:scale-105' : 'border-gray-200 shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-4 py-1 font-medium rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <div className={`p-8 ${plan.popular ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.title}</h3>
                <div className="flex items-baseline mb-4">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-blue-600' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <button 
                  onClick={onSelectPlan}
                  className={`w-full py-3 rounded-md font-medium transition-all flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg' 
                      : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {plan.cta} {plan.popular && <FiArrowRight className="ml-2" />}
                </button>
              </div>
              <div className="bg-white p-8">
                <p className="text-sm text-gray-600 mb-4 font-medium">Included features:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                        plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <FiCheck className="w-3 h-3" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        <div className="max-w-xl mx-auto text-center mt-12">
          <p className="text-sm text-gray-500">
            All plans include core features like secure authentication, end-to-end encryption, and basic customer support.
            Need a custom solution? <a href="#" className="text-blue-600 font-medium">Contact us</a>.
          </p>
        </div>
      </div>
    </section>
  );
}