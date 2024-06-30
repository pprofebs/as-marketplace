import React from 'react';

const StarRating = ({ rating }) => {
  const stars = [];

  // Create stars based on the rating
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<i key={i} className="fas fa-star text-yellow-500"></i>); // Full star
    } else if (i - 0.5 === rating) {
      stars.push(<i key={i} className="fas fa-star-half-alt text-yellow-500"></i>); // Half star
    } else {
      stars.push(<i key={i} className="far fa-star text-yellow-500"></i>); // Empty star
    }
  }

  return (
    <div className="flex">
      {stars}
    </div>
  );
};

export default StarRating;
