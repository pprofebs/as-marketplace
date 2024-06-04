import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import { UserContext } from '../context/UserContext';

function UserProfile() {
  const [token] = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [ads, setAds] = useState([]);
  const [stats, setStats] = useState({ totalAds: 0, totalViews: 0, totalClicks: 0 });
  const [editAd, setEditAd] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

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
      if (editAd.images) {
        for (let i = 0; i < editAd.images.length; i++) {
          formData.append('images', editAd.images[i]);
        }
      }
      console.log(formData);

      await axios.put(`http://localhost:8000/ads/${editAd.ad_id}/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setEditAd(null);
      // Refresh ads list
      const response = await axios.get('http://localhost:8000/ads/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAds(response.data.ads || []);
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
    // Implement user info save logic here
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    setEditAd({ ...editAd, images: files });
  };

  const handleViewAd = (adId) => {
    navigate(`/termekek/${adId}`); // Redirect to the ad detail page
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold mb-4">User Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          {user && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  value={user.username}
                  className="w-full p-2 border border-gray-300 rounded"
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={user.email}
                  className="w-full p-2 border border-gray-300 rounded"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Location</label>
                <input
                  type="text"
                  value={user.location}
                  className="w-full p-2 border border-gray-300 rounded"
                  onChange={(e) => setUser({ ...user, location: e.target.value })}
                />
              </div>
              <button
                onClick={handleSaveUserInfo}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="mb-4">
            <p className="text-gray-700">Total Ads: {stats.totalAds}</p>
            <p className="text-gray-700">Total Views: {stats.totalViews}</p>
            <p className="text-gray-700">Total Clicks: {stats.totalClicks}</p>
          </div>
        </div>
      </div>
      {ads.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Your Ads</h2>
          <div className="grid grid-cols-1 gap-4">
            {ads.map((ad) => (
              <div key={ad.ad_id} className="flex justify-between items-center p-4 border border-gray-300 rounded">
                <div>
                  <h3 className="text-lg font-semibold">{ad.title}</h3>
                  <p className="text-gray-700">{ad.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewAd(ad.ad_id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleUpdateAd(ad)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAd(ad.ad_id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {editAd && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
          <h2 className="text-xl font-semibold mb-4">Update Ad</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={editAd.title}
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setEditAd({ ...editAd, title: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <input
              type="text"
              value={editAd.description}
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setEditAd({ ...editAd, description: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              value={editAd.price}
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setEditAd({ ...editAd, price: parseFloat(e.target.value) })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              value={editAd.category}
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setEditAd({ ...editAd, category: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Condition</label>
            <input
              type="text"
              value={editAd.condition}
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setEditAd({ ...editAd, condition: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Images</label>
            <input
              type="file"
              multiple
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSaveAd}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditAd(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
