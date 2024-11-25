import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductCard = ({ ad_id, name, price, condition, category, image }) => {
  const navigate = useNavigate();

  const conditionLabels = {
    new: 'Új',
    very_good: 'Nagyon jó',
    good: 'Jó',
    fair: 'Elfogadható',
    for_parts_or_not_working: 'Alkatrészeknek vagy nem működő'
  };

  const handleAdClick = async (event) => {
    event.preventDefault(); // Prevent default navigation
    const guest_uuid = localStorage.getItem('guest_uuid');

    let payload = { guest_uuid };

    try {
      // Attempt to authenticate the user
      const authResponse = await axios.get('http://localhost:8000/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      // If authenticated, add user_id to the payload
      const user_id = authResponse.data.user_id;
      payload.user_id = user_id;
    } catch (error) {
      console.log("User not authenticated, sending only guest_uuid");
      // If not authenticated, the payload will only include guest_uuid
    }

    try {
      const trackingResponse = await axios.post(`http://localhost:8000/analytics/ads/${ad_id}/click`, payload);

      // Success logic
      if (trackingResponse.status === 200 || trackingResponse.status === 201) {
        console.log("Ad click successfully tracked!");
        // You can add more success handling logic here, like showing a toast notification
      }
    } catch (error) {
      console.error("Error tracking ad click:", error);
      // You can also handle specific errors here, like showing an error notification
    }

    // Navigate to the product detail page after tracking
    navigate(`/termekek/${ad_id}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <a href={`/termekek/${ad_id}`} onClick={handleAdClick} className="block">
        <img src={image} alt="Product" className="w-full h-56 object-cover" />
      </a>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{name}</h2>
        <p className="text-gray-800 font-bold">HUF {price}</p>
        <p className="text-gray-600 mb-2">
          Állapot: {conditionLabels[condition]} - {category}
        </p>
        <a href={`/termekek/${ad_id}`} onClick={handleAdClick} className="block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-center">
          Részletek
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
