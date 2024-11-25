import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';

function AdsPage() {
  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [adsPerPage] = useState(9);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubCategory, setFilterSubCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState({});

  const conditionLabels = {
    new: 'Új',
    very_good: 'Nagyon jó',
    good: 'Jó',
    fair: 'Elfogadható',
    for_parts_or_not_working: 'Alkatrészeknek vagy nem működő'
  };

  useEffect(() => {
    fetchAds();
  }, [searchQuery, filterCondition, filterCategory, filterSubCategory, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchAds = async () => {
    try {
      const queryParams = new URLSearchParams({
        search: searchQuery,
        condition: filterCondition,
        category: filterCategory,
        subCategory: filterSubCategory,
      }).toString();

      const response = await fetch(`http://127.0.0.1:8000/ads/all?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ads');
      }
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error('Error fetching ads:', error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterConditionChange = (e) => {
    setFilterCondition(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    setFilterSubCategory('');
    setCurrentPage(1);
  };

  const handleFilterSubCategoryChange = (e) => {
    setFilterSubCategory(e.target.value);
    setCurrentPage(1);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterCondition('');
    setFilterCategory('');
    setFilterSubCategory('');
    setCurrentPage(1);
  };

  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = ads.slice(indexOfFirstAd, indexOfLastAd);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const viewAdDetails = async (adId) => {
    console.log('Viewing details of ad with ID:', adId);

    const guest_uuid = localStorage.getItem('guest_uuid'); // Retrieve guest_uuid from localStorage

    let user_id = null;
    const token = localStorage.getItem('ASAccessToken'); // Assuming you store the auth token in localStorage
    console.log(token);

    if (token) {
        try {
            // Fetch the user_id by sending a request to '/users/me'
            const response = await fetch('http://localhost:8000/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                user_id = data.user_id; // Assuming the response has the user ID in the 'id' field
            } else {
                console.error('Failed to fetch user information');
            }
        } catch (error) {
            console.error('Error fetching user information:', error.message);
        }
    }

    // Tracking the ad click
    try {
        const requestBody = user_id
            ? { user_id: user_id, guest_uuid: guest_uuid || null } // Send both user_id and guest_uuid if authenticated
            : { guest_uuid: guest_uuid || null }; // Send only guest_uuid if unauthenticated

        console.log(requestBody);

        const response = await fetch(`http://127.0.0.1:8000/analytics/ads/${adId}/click`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error('Failed to track ad click');
        }
        console.log('Ad click tracked successfully');
    } catch (error) {
        console.error('Error tracking ad click:', error.message);
    }
};

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-8 text-center">Hirdetések</h1>

      <div className="mb-6 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl">
        <input
          type="text"
          placeholder="Keresés..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full md:w-1/3 mb-2 md:mb-0 p-2 border rounded-full shadow-md"
        />
        <button
          onClick={toggleFilters}
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ml-0 md:ml-4"
        >
          <FiFilter className="mr-2" />
          Szűrők
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl">
          <select
            value={filterCondition}
            onChange={handleFilterConditionChange}
            className="w-full md:w-auto mb-2 md:mb-0 md:mr-2 p-2 border rounded-full shadow-md"
          >
            <option value="">Minden állapot</option>
            <option value="new">Új</option>
            <option value="very_good">Nagyon jó</option>
            <option value="good">Jó</option>
            <option value="fair">Elfogadható</option>
            <option value="for_parts_or_not_working">Alkatrészeknek vagy nem működő</option>
          </select>
          <select
            value={filterCategory}
            onChange={handleFilterCategoryChange}
            className="w-full md:w-auto mb-2 md:mb-0 md:mr-2 p-2 border rounded-full shadow-md"
          >
            <option value="">Minden kategória</option>
            {Object.keys(categories).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {filterCategory && (
            <select
              value={filterSubCategory}
              onChange={handleFilterSubCategoryChange}
              className="w-full md:w-auto p-2 border rounded-full shadow-md"
            >
              <option value="">Minden alkategória</option>
              {categories[filterCategory].map((subCategory, index) => (
                <option key={index} value={subCategory}>
                  {subCategory}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={clearFilters}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ml-0 md:ml-4 mt-4 md:mt-0"
          >
            Szűrők törlése
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-7xl">
        {currentAds.map((ad) => (
          <div key={ad.ad_id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            {ad.images.length > 0 ? (
              <img src={`${ad.images[0].url}`} alt={ad.title} className="w-full h-48 object-cover object-center" />
            ) : (
              <p>Nincs elérhető kép</p>
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{ad.title}</h2>
              <p className="text-gray-800 font-semibold mb-2">HUF {ad.price}</p>
              <p className="text-gray-600 mb-2">Állapot: {conditionLabels[ad.condition]} - {ad.category}</p>
              <Link to={`/termekek/${ad.ad_id}`}>
                <button
                  onClick={() => viewAdDetails(ad.ad_id)}
                  className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Részletek
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center w-full max-w-7xl">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline"
        >
          Előző oldal
        </button>
        <span className="bg-gray-200 text-gray-600 py-2 px-4">{`${currentPage}`}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentAds.length < adsPerPage}
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
        >
          Következő oldal
        </button>
      </div>
    </div>
  );
}

export default AdsPage;
