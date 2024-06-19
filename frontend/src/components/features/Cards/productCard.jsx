import React from 'react';
import { Link } from 'react-router-dom';
import gunImage from '../../../assets/images/gun-ar.jpg';

const ProductCard = ({ id, name, description, price }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Link to={`/product/${id}`} className="block">
        <img src={gunImage} alt="Product" className="w-full h-56 object-cover" />
      </Link>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{name}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <p className="text-gray-800 font-bold">${price}</p>
        <Link to={`/product/${id}`} className="block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-center">
          Részletek
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
