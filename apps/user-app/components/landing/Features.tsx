import { 
  FiRepeat, 
  FiShield, 
  FiPieChart, 
  FiBell, 
  FiCreditCard, 
  FiGlobe,
  FiSmartphone,
  FiLock
} from 'react-icons/fi';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesProps {
  id?: string;
}

export default function Features({ id }: FeaturesProps) {
  const mainFeatures: Feature[] = [
    {
      icon: <FiRepeat className="h-10 w-10 text-blue-600" />,
      title: "Instant Transfers",
      description: "Send money to friends and family instantly with zero fees."
    },
    {
      icon: <FiShield className="h-10 w-10 text-blue-600" />,
      title: "Secure Storage",
      description: "Lock your funds securely with industry-leading encryption."
    },
    {
      icon: <FiPieChart className="h-10 w-10 text-blue-600" />,
      title: "Advanced Analytics",
      description: "Track spending patterns and manage your budget with detailed reports."
    }
  ];

  const additionalFeatures: Feature[] = [
    {
      icon: <FiBell className="h-8 w-8 text-blue-600" />,
      title: "Real-time Notifications",
      description: "Stay informed with instant alerts for all account activities."
    },
    {
      icon: <FiCreditCard className="h-8 w-8 text-blue-600" />,
      title: "Multiple Payment Options",
      description: "Add money using UPI, net banking, debit cards, or credit cards."
    },
    {
      icon: <FiGlobe className="h-8 w-8 text-blue-600" />,
      title: "Global Transfers",
      description: "Send money internationally with competitive exchange rates."
    },
    {
      icon: <FiSmartphone className="h-8 w-8 text-blue-600" />,
      title: "Mobile-First Design",
      description: "Enjoy the same powerful experience on any device, anywhere."
    }
  ];

  return (
    <section id={id} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            All the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Tools</span> You Need
          </h2>
          <p className="text-lg text-gray-600">
            PaySmart offers a comprehensive suite of financial tools designed to make your money management effortless.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-8 hover:shadow-lg transition-all hover:-translate-y-1 duration-300 border border-gray-100 shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {additionalFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:bg-blue-50 flex items-start gap-4 duration-300 border border-gray-100"
            >
              <div className="shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}