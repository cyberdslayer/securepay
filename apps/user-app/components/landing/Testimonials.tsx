interface Testimonial {
  quote: string;
  name: string;
  title: string;
  avatar: string;
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
      avatar: "R"
    },
    {
      quote: "I love how easy it is to send money to friends. No more awkward reminders about who owes what after dinner!",
      name: "Priya Patel",
      title: "Software Engineer",
      avatar: "P"
    },
    {
      quote: "The analytics feature helps me track my spending habits. I've saved so much money since I started using PaySmart.",
      name: "Aditya Verma",
      title: "Marketing Manager",
      avatar: "A"
    }
  ];

  return (
    <section id={id} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="text-indigo-600">Users</span> Say
          </h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it. Hear from some of our satisfied users.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}