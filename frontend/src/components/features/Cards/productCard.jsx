import React from 'react';
import { Link } from 'react-router-dom';
import gunImage from '../../../assets/images/gun-ar.jpg';

const ProductCard = ({ ad_id, name, price, image }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Link to={`/termekek/${ad_id}`} className="block">
        <img src={image} alt="Product" className="w-full h-56 object-cover" />
      </Link>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{name}</h2>
        <p className="text-gray-800 font-bold">HUF {price}</p>
        <Link to={`/termekek/${ad_id}`} className="block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-center">
          Részletek
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
