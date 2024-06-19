import React from 'react';
import TestimonialCard from '../Cards/TestimonialCard';

const testimonials = [
  {
    name: 'John Doe',
    recommendation: 'Great experience!',
  },
  {
    name: 'Jane Smith',
    recommendation: 'Highly recommended!',
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-8">Rólunk mondták</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              recommendation={testimonial.recommendation}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
