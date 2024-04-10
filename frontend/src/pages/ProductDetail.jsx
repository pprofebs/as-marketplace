import React from 'react';

function ProductDetail() {
  // Sample ad data (replace with actual ad data)
  const ad = {
    id: 1,
    title: "Airsoft Rifle",
    description: "High-quality airsoft rifle for sale. Only used a few times.",
    price: "$150",
    condition: "Used",
    category: "Rifle",
    images: [
      "https://source.unsplash.com/ADR-OV5gpQ8/1920x1080",
      "https://source.unsplash.com/ADR-OV5gpQ8/1920x1080",
      "https://source.unsplash.com/ADR-OV5gpQ8/1920x1080"
    ]
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4">{ad.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {ad.images.map((image, index) => (
          <div key={index} className="flex justify-center items-center">
            <img src={image} alt={ad.title} className="max-w-full h-auto rounded-lg shadow-md" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700 mb-4">{ad.description}</p>
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-800 font-semibold">{ad.price}</p>
          <p className="text-gray-700">{ad.condition} - {ad.category}</p>
        </div>
        {/* Additional details section (e.g., seller info, shipping details, etc.) */}
        <div className="border-t border-gray-300 pt-4">
          {/* Seller Information */}
          <div className="flex items-center mb-2">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex justify-center items-center mr-4">
              {/* Placeholder for seller avatar (replace with actual avatar) */}
              <span className="text-gray-600 text-xl">A</span>
            </div>
            <div>
              <p className="text-gray-800 font-semibold">Seller Name</p>
              <p className="text-gray-600">Location</p>
            </div>
          </div>
          {/* Shipping Details */}
          <div>
            <p className="text-gray-800 font-semibold mb-2">Shipping Information</p>
            <p className="text-gray-600">Shipping options and details...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
