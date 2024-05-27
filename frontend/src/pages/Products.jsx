import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdsPage() {
  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [adsPerPage] = useState(9);

  useEffect(() => {
    // Fetch ads data from FastAPI backend when component mounts
    const fetchAds = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/ads/all');
        if (!response.ok) {
          throw new Error('Failed to fetch ads');
        }
        const data = await response.json();
        setAds(data); // Update ads state with fetched data
      } catch (error) {
        console.error('Error fetching ads:', error.message);
      }
    };

    fetchAds();
  }, []);

  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = ads.slice(indexOfFirstAd, indexOfLastAd);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const viewAdDetails = (adId) => {
    console.log('Viewing details of ad with ID:', adId);
    // Redirect to ad details page or show modal with ad details
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-8">Ads Page</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentAds.map((ad) => (
          <div key={ad.ad_id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            {ad.images.length > 0 ? (
              <img src={`${ad.images[0].url}`} alt={ad.title} className="w-full h-48 object-cover object-center" />
            ) : (
              <p>No Image Available</p>
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{ad.title}</h2>
              <p className="text-gray-600 mb-2">{ad.description}</p>
              <p className="text-gray-800 font-semibold mb-2">{ad.price}</p>
              <p className="text-gray-600 mb-2">{ad.condition} - {ad.category}</p>
              <Link to={`/termekek/${ad.ad_id}`}>
                <button
                  onClick={() => viewAdDetails(ad.ad_id)}
                  className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline"
        >
          Previous
        </button>
        <span className="bg-gray-200 text-gray-600 py-2 px-4">{`Page ${currentPage}`}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentAds.length < adsPerPage}
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdsPage;
