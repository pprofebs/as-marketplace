import React from 'react';
import StarRating from '../Rating/StarRating'; // Assuming StarRating component is implemented separately

const TestimonialCard = ({ name, recommendation, rating, imageUrl }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center border border-gray-200">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Testimonial by ${name}`}
          className="w-20 h-20 rounded-full mb-4"
        />
      )}
      <p className="text-gray-700 text-center mb-4">"{recommendation}"</p>
      <div className="flex items-center justify-center mb-2">
        <StarRating rating={rating} /> {/* Replace with your StarRating component */}
      </div>
      <p className="text-gray-600 text-center">- {name}</p>
    </div>
  );
};

export default TestimonialCard;
