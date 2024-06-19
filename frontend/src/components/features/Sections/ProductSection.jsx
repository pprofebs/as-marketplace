import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from "../Cards/ProductCard";

const ProductSection = () => {
  const [ads, setAds] = useState([]);
  const [stats] = useState({ new_items: 0, total_views: 0, sold_ads: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdsAndStats = async () => {
      try {
        const [adsResponse] = await Promise.all([
          axios.get('http://localhost:8000/ads/all?limit=3'),

        ]);

        setAds(adsResponse.data);

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdsAndStats();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {ads.length > 0 ? (
          ads.map(ad => (
            <ProductCard
              key={ad.ad_id}
              name={ad.title}
              description={ad.description}
              price={ad.price}
              image={ad.images.length > 0 ? ad.images[0].url : ''}
            />
          ))
        ) : (
          <>
           <p>Nem sikerült betölteni a termékeket</p>
          </>
        )}
      </div>
      <div className="container mx-auto py-4 bg-white shadow rounded-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Statisztika</h2>
        <div className="flex justify-around text-gray-700">
          <div>
            <h3 className="text-xl font-bold">{stats.new_items || 10}</h3>
            <p>Ma feltöltött hirdetések</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">{stats.total_views || 500}</h3>
            <p>Összes hirdetés megtekintés</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">{stats.sold_ads || 30}</h3>
            <p>Eladott termékek</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
