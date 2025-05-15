import { FiArrowRight, FiUserPlus, FiDollarSign, FiSend } from 'react-icons/fi';

interface Step {
  icon: React.ReactNode;
  step: string;
  title: string;
  description: string;
}

interface HowItWorksProps {
  id?: string;
}

export default function HowItWorks({ id }: HowItWorksProps) {
  const steps: Step[] = [
    {
      icon: <FiUserPlus className="w-7 h-7 text-blue-600" />,
      step: "01",
      title: "Create an Account",
      description: "Sign up for free in less than 2 minutes with just your phone number"
    },
    {
      icon: <FiDollarSign className="w-7 h-7 text-blue-600" />,
      step: "02",
      title: "Add Money",
      description: "Load your wallet using UPI, net banking, or cards"
    },
    {
      icon: <FiSend className="w-7 h-7 text-blue-600" />,
      step: "03",
      title: "Start Transacting",
      description: "Send money, pay bills, or make purchases instantly"
    }
  ];

  return (
    <section id={id} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How PaySmart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Works</span>
          </h2>
          <p className="text-lg text-gray-600">
            Getting started with PaySmart is easy. Just follow these simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100 h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="text-4xl font-bold text-blue-100">{step.step}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <FiArrowRight className="text-blue-300 w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}