import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../Cards/ProductCard";
import { FaChartLine, FaEye, FaShoppingCart } from "react-icons/fa";

const ProductSection = () => {
  const [ads, setAds] = useState([]);
  const [stats] = useState({ new_items: 0, total_views: 0, sold_ads: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdsAndStats = async () => {
      try {
        const [adsResponse] = await Promise.all([
          axios.get("http://localhost:8000/ads/all?limit=3"),
        ]);
        console.log(adsResponse);

        setAds(adsResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdsAndStats();
  }, []);

  if (loading) return <p>Töltés...</p>;
  if (error) return <p>Hiba az adatok betöltése közben: {error.message}</p>;

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {ads.length > 0 ? (
          ads.map((ad) => (
            <ProductCard
              key={ad.ad_id}
              ad_id={ad.ad_id}
              name={ad.title}
              price={ad.price}
              image={ad.images.length > 0 ? ad.images[0].url : ""}
            />
          ))
        ) : (
          <>
            <p>Nem sikerült betölteni a termékeket</p>
          </>
        )}
      </div>
      <div className="container mx-auto py-4 px-6 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-3xl font-semibold mb-6 text-black-700">
          Statisztika
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700">
          <div className="flex flex-col items-center p-6 bg-blue-100 rounded-lg shadow-md">
            <FaChartLine className="text-blue-500 text-3xl mb-2" />
            <h3 className="text-2xl font-bold">{stats.new_items || 10}</h3>
            <p className="text-lg">Ma feltöltött hirdetések</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-green-100 rounded-lg shadow-md">
            <FaEye className="text-green-500 text-3xl mb-2" />
            <h3 className="text-2xl font-bold">{stats.total_views || 500}</h3>
            <p className="text-lg">Összes hirdetés megtekintés</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-yellow-100 rounded-lg shadow-md">
            <FaShoppingCart className="text-yellow-500 text-3xl mb-2" />
            <h3 className="text-2xl font-bold">{stats.sold_ads || 30}</h3>
            <p className="text-lg">Eladott termékek</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
