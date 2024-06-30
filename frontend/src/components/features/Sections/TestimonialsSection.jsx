import React from 'react';
import TestimonialCard from '../Cards/TestimonialCard';

const testimonials = [
  {
    name: 'John Doe',
    recommendation: 'Great experience!',
    rating: 5, // Add a rating for each testimonial (assuming it's out of 5)
    imageUrl: '/images/john-doe.jpg', // Example image URL
  },
  {
    name: 'Jane Smith',
    recommendation: 'Highly recommended!',
    rating: 4,
    imageUrl: '/images/jane-smith.jpg', // Example image URL
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-8">Rólunk mondták</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              recommendation={testimonial.recommendation}
              rating={testimonial.rating}
              imageUrl={testimonial.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
