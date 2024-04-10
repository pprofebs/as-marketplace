import React from 'react';

const TestimonialCard = ({ name, recommendation, imageUrl }) => {
  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-8 flex flex-col items-center">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Testimonial by ${name}`}
          className="w-24 h-24 rounded-full mb-4"
        />
      )}
      <p className="text-gray-300 text-center mb-6">"{recommendation}"</p>
      <p className="text-gray-400 text-center">- {name}</p>
    </div>
  );
};

export default TestimonialCard;
