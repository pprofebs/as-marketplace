import React from 'react';
import { FaLock, FaThumbsUp, FaUsers } from 'react-icons/fa';

const ReasonCard = ({ name, description }) => {
  // Define icon component based on name prop
  const getIcon = () => {
    switch (name) {
      case 'Ellenőrzött hirdetések':
        return <FaLock className="text-5xl text-gray-600 mb-4" />;
      case 'Kiváló termékek':
        return <FaThumbsUp className="text-5xl text-gray-600 mb-4" />;
      case 'A közösség tagjaitól':
        return <FaUsers className="text-5xl text-gray-600 mb-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
      {getIcon()}
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
};

export default ReasonCard;
