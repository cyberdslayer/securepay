import { FiMessageCircle, FiStar } from 'react-icons/fi';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
}

interface TestimonialsProps {
  id?: string;
}

export default function Testimonials({ id }: TestimonialsProps) {
  const testimonials: Testimonial[] = [
    {
      quote: "PaySmart has completely changed how I manage my money. The interface is intuitive and transfers are lightning fast!",
      name: "Rahul Sharma",
      title: "Small Business Owner",
      avatar: "R",
      rating: 5
    },
    {
      quote: "I love how easy it is to send money to friends. No more awkward reminders about who owes what after dinner!",
      name: "Priya Patel",
      title: "Software Engineer",
      avatar: "P",
      rating: 5
    },
    {
      quote: "The analytics feature helps me track my spending habits. I've saved so much money since I started using PaySmart.",
      name: "Aditya Verma",
      title: "Marketing Manager",
      avatar: "A",
      rating: 4
    }
  ];

  return (
    <section id={id} className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Users</span> Say
          </h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it. Hear from some of our satisfied users.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 relative">
              {/* Quote icon */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FiMessageCircle className="text-blue-600" />
              </div>
              
              {/* Star rating */}
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar 
                    key={star} 
                    className={`w-4 h-4 ${star <= testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-xs text-gray-500">{testimonial.rating}.0</span>
              </div>
              
              {/* Quote text */}
              <p className="text-gray-600 mb-6 text-sm">"{testimonial.quote}"</p>
              
              {/* User info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-medium shadow-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm font-medium text-gray-600 mb-3">Trusted by users from over 100+ companies</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            {['Microsoft', 'Google', 'Amazon', 'Apple', 'Airbnb'].map((company) => (
              <div key={company} className="text-gray-400 font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}