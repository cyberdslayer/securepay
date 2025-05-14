interface CTAProps {
  id?: string;
  onGetStarted: () => void;
}

export default function CTA({ id, onGetStarted }: CTAProps) {
  return (
    <section id={id} className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to experience smarter payments?
        </h2>
        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied users who are already enjoying the benefits of PaySmart.
        </p>
        <button
          onClick={onGetStarted}
          className="px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-lg hover:shadow-lg transition-all hover:-translate-y-1"
        >
          Get Started — It's Free
        </button>
        <p className="mt-4 text-sm text-indigo-200">
          No credit card required • Set up in minutes • Cancel anytime
        </p>
      </div>
    </section>
  );
}