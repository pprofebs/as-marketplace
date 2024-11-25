import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../Cards/productCard";
import { FaChartLine, FaEye, FaShoppingCart, FaMousePointer } from "react-icons/fa";

const ProductSection = () => {
  const [ads, setAds] = useState([]);
  const [stats, setStats] = useState({
    new_items: 0,
    total_views: 0,
    sold_ads: 0,
    total_clicks: 0, // New field for ad clicks
  });
  const [adsLoading, setAdsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [adsError, setAdsError] = useState(null);
  const [statsError, setStatsError] = useState(null);

  // Fetch ads
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsResponse = await axios.get("http://localhost:8000/ads/all?limit=3");
        setAds(adsResponse.data);
      } catch (err) {
        setAdsError(err);
      } finally {
        setAdsLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch stats for uploaded ads
        const statsResponse = await axios.get("http://localhost:8000/analytics/uploaded-ads");
        // Fetch total ad clicks
        const clicksResponse = await axios.get("http://localhost:8000/analytics/ads/clicks");

        // Calculate total clicks from the clicks API response
        const totalClicks = clicksResponse.data.reduce((acc, ad) => acc + ad.unique_clicks, 0);

        setStats((prevStats) => ({
          ...prevStats,
          new_items: statsResponse.data.uploaded_ads_today,
          total_clicks: totalClicks, // Update total clicks
        }));
      } catch (err) {
        setStatsError(err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {adsLoading ? (
          <p>Töltés...</p>
        ) : adsError ? (
          <p>Hiba az adatok betöltése közben: {adsError.message}</p>
        ) : ads.length > 0 ? (
          ads.map((ad) => (
            <ProductCard
              key={ad.ad_id}
              ad_id={ad.ad_id}
              name={ad.title}
              price={ad.price}
              condition={ad.condition}
              category={ad.category}
              image={ad.images.length > 0 ? ad.images[0].url : ""}
            />
          ))
        ) : (
          <p>Nem sikerült betölteni a termékeket</p>
        )}
      </div>
      <div className="container mx-auto py-4 px-6 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-3xl font-semibold mb-6 text-black-700">
          Statisztika
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700">
          {statsLoading ? (
            <p>Statisztikák betöltése...</p>
          ) : statsError ? (
            <p>Hiba a statisztikák betöltése közben: {statsError.message}</p>
          ) : (
            <>
              <div className="flex flex-col items-center p-6 bg-blue-100 rounded-lg shadow-md">
                <FaChartLine className="text-blue-500 text-3xl mb-2" />
                <h3 className="text-2xl font-bold">{stats.new_items}</h3>
                <p className="text-lg">Ma feltöltött hirdetések</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-green-100 rounded-lg shadow-md">
                <FaEye className="text-green-500 text-3xl mb-2" />
                <h3 className="text-2xl font-bold">{stats.total_clicks}</h3>
                <p className="text-lg">Összes hirdetés megtekintés</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-yellow-100 rounded-lg shadow-md">
                <FaShoppingCart className="text-yellow-500 text-3xl mb-2" />
                <h3 className="text-2xl font-bold">{stats.sold_ads}</h3>
                <p className="text-lg">Eladott termékek</p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
