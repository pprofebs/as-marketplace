import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function UserProfile() {
  const [token] = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [ads, setAds] = useState([]);
  const [stats, setStats] = useState({ totalAds: 0, totalViews: 0, totalClicks: 0 });
  const [editAd, setEditAd] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [isEditButtonVisible, setIsEditButtonVisible] = useState(true); // State to control edit button visibility
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    // Fetch user information
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data', err);
      }
    };

    // Fetch user ads
    const fetchAds = async () => {
      try {
        const response = await axios.get('http://localhost:8000/ads/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAds(response.data || []);
        setStats(response.data.stats || { totalAds: 0, totalViews: 0, totalClicks: 0 });
      } catch (err) {
        console.error('Error fetching ads', err);
      }
    };

    fetchUser();
    fetchAds();
  }, [token]);

  const handleUpdateAd = (ad) => {
    setEditAd(ad);
  };

  const handleSaveAd = async () => {
    if (!editAd) return;

    try {
      const formData = new FormData();
      formData.append('title', editAd.title);
      formData.append('description', editAd.description);
      formData.append('price', editAd.price);
      formData.append('category', editAd.category);
      formData.append('condition', editAd.condition);

      if (editAd.images && editAd.images.length > 0) {
        for (let i = 0; i < editAd.images.length; i++) {
          formData.append('images', editAd.images[i]);
        }
      }

      await axios.put(`http://localhost:8000/ads/${editAd.ad_id}/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setEditAd(null);
      const response = await axios.get('http://localhost:8000/ads/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAds(response.data || []);
    } catch (err) {
      console.error('Error updating ad', err);
    }
  };

  const handleDeleteAd = async (adId) => {
    try {
      await axios.delete(`http://localhost:8000/ads/${adId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh ads list
      setAds(ads.filter(ad => ad.ad_id !== adId));
    } catch (err) {
      console.error('Error deleting ad', err);
    }
  };

  const handleSaveUserInfo = async () => {
    if (!user) return;

    try {
      await axios.put('http://localhost:8000/users/me', {
        phone_number: user.phone_number,
        location: user.location,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsEditButtonVisible(true); // Ensure the edit button is visible
      setIsModalVisible(false); // Close the modal
    } catch (err) {
      console.error('Error saving user information', err);
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    setEditAd({ ...editAd, images: files.length > 0 ? files : null });
  };

  const handleViewAd = (adId) => {
    navigate(`/termekek/${adId}`); // Redirect to the ad detail page
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-4">Profilom</h1>
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Felhasználói információ</h2>
          {user && (
            <div>
              {isEditButtonVisible && (
                <button
                  onClick={() => setIsModalVisible(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
                >
                  Edit Information
                </button>
              )}
              {/* Modal */}
              {isModalVisible && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Edit User Information</h2>
                    <div className="mb-4">
                      <label className="block text-gray-700">Város</label>
                      <input
                        type="text"
                        value={user.location}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => setUser({ ...user, location: e.target.value })}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Telefon</label>
                      <input
                        type="text"
                        value={user.phone_number || ''}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveUserInfo}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsModalVisible(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Statisztikáim</h2>
          <div className="mb-4">
            <p className="text-gray-700">Összes hirdetésem: {stats.totalAds}</p>
            <p className="text-gray-700">Total Views: {stats.totalViews}</p>
            <p className="text-gray-700">Total Clicks: {stats.totalClicks}</p>
          </div>
        </div>
      </div>
      {ads.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl">
          <h2 className="text-xl font-semibold mb-4">Hirdetéseim</h2>
          <div className="grid grid-cols-1 gap-4">
            {ads.map((ad) => (
              <div key={ad.ad_id} className="flex justify-between items-center p-4 border border-gray-300 rounded">
                <div>
                  <h3 className="text-lg font-semibold">{ad.title}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewAd(ad.ad_id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Megjelenítés
                  </button>
                  <button
                    onClick={() => handleUpdateAd(ad)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Szerkesztés
                  </button>
                  <button
                    onClick={() => handleDeleteAd(ad.ad_id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Törlés
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
