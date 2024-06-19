import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ImageModal from '../components/features/Modal/ImageModal';

function ProductDetail() {
  const { adId } = useParams(); // Get ad ID from route parameters
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [user, setUser] = useState(null); // State to hold user information

  useEffect(() => {
    // Fetch ad data from backend
    const fetchAd = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/ads/ad/${adId}`);
        const adData = response.data;
        setAd(adData);

        // Fetch user data based on user_id from ad data
        const userResponse = await axios.get(`http://localhost:8000/users/user/${adData.user_id}`);
        console.log(userResponse);
        setUser(userResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [adId]);

  if (loading) return <p>Töltés...</p>;
  if (error) return <p>Hiba a hirdetés betöltése közben: {error.message}</p>;

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showNextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % ad.images.length);
  };

  const showPreviousImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? ad.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4">{ad.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {ad.images.slice(0, 5).map((image, index) => (
          <div key={index} className="flex justify-center items-center">
            <img
              src={image.url}
              alt={ad.title}
              className="object-cover rounded-lg shadow-md cursor-pointer"
              style={{ width: '400px', height: '400px' }}
              onClick={() => openModal(index)}
            />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Leirás</h2>
        <p className="text-gray-700 mb-4">{ad.description}</p>
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-800 font-semibold">HUF {ad.price}</p>
          <p className="text-gray-700">Termék állapota: {ad.condition} - Kategória: {ad.category}</p>
        </div>
        <div className="border-t border-gray-300 pt-4">
          {user && (
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex justify-center items-center mr-4">
                <span className="text-gray-600 text-xl">A</span>
              </div>
              <div>
                <p className="text-gray-800 font-semibold"></p>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          )}
          <div>
            <p className="text-gray-800 font-semibold mb-2">Shipping Information</p>
            <p className="text-gray-600">Shipping options and details...</p>
          </div>
        </div>
      </div>
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={ad.images[selectedImageIndex].url}
        onClose={closeModal}
        onNext={showNextImage}
        onPrevious={showPreviousImage}
      />
    </div>
  );
}

export default ProductDetail;
