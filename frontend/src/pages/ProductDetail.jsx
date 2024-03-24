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
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg"
    ]
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4">{ad.title}</h1>
      <div className="flex flex-wrap -mx-4 mb-8">
        {ad.images.map((image, index) => (
          <div key={index} className="w-full md:w-1/3 px-4 mb-4">
            <img src={image} alt={ad.title} className="w-full rounded-lg shadow-md" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700 mb-4">{ad.description}</p>
        <p className="text-gray-800 font-semibold mb-2">{ad.price}</p>
        <p className="text-gray-700 mb-2">{ad.condition} - {ad.category}</p>
        {/* Add more details such as seller information, shipping details, etc. */}
      </div>
    </div>
  );
}

export default ProductDetail;
