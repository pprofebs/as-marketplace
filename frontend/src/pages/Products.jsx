import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AdsPage() {
  // Sample ads data
  const [ads, setAds] = useState([
    {
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
      },
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [adsPerPage] = useState(9); // Number of ads per page

  // Get current ads
  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = ads.slice(indexOfFirstAd, indexOfLastAd);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Function to view ad details
  const viewAdDetails = (adId) => {
    // Redirect to ad details page or show modal with ad details
    console.log("Viewing details of ad with ID:", adId);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-8">Ads Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentAds.map(ad => (
          <div key={ad.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={ad.images[0]} alt={ad.title} className="w-full h-64 object-cover object-center" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{ad.title}</h2>
              <p className="text-gray-600 mb-2">{ad.description}</p>
              <p className="text-gray-800 font-semibold mb-2">{ad.price}</p>
              <p className="text-gray-600">{ad.condition} - {ad.category}</p>
              <Link to={`/termekek/${ad.id}`}><button onClick={() => viewAdDetails(ad.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">View Details</button></Link>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="mt-8">
        <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
          <div className="-mt-px w-0 flex-1 flex">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="border-t-2 bg-white px-4 py-3 border-transparent text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:text-gray-600 focus:border-gray-300 transition ease-in-out duration-150">
              Previous
            </button>
          </div>
          <div className="hidden md:-mt-px md:flex">
            <span className="border-t-2 border-gray-200 px-4 py-3 text-gray-500">{`Page ${currentPage}`}</span>
          </div>
          <div className="-mt-px w-0 flex-1 flex justify-end">
            <button onClick={() => paginate(currentPage + 1)} disabled={currentAds.length < adsPerPage} className="border-t-2 bg-white px-4 py-3 border-transparent text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:text-gray-600 focus:border-gray-300 transition ease-in-out duration-150">
              Next
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default AdsPage;
