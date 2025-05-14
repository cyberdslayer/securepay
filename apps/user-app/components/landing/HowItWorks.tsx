interface Step {
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
  ];

  return (
    <section id={id} className="py-20 bg-gray-50">
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
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all">
                <div className="text-5xl font-bold text-indigo-100 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-indigo-100"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}