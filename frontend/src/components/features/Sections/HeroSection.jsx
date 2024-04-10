import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({ title, secondaryTitle }) => {
  const sectionStyle = {
    backgroundImage: `url('https://source.unsplash.com/ADR-OV5gpQ8/1920x1080')`, // Specify the URL of the background image
    backgroundSize: 'cover', // Ensure the image covers the entire section
    backgroundPosition: 'center', // Center the image within the section
    backgroundColor: '#1A4731', // Set the desired background color
    color: 'white', // Set text color to white
    paddingTop: '6rem', // Adjust top padding for content spacing
    paddingBottom: '6rem', // Adjust bottom padding for content spacing
    textAlign: 'center', // Center align text
  };

  return (
    <section style={sectionStyle}>
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        <p className="text-lg md:text-xl mb-8">{secondaryTitle}</p>
        <div className="flex justify-center space-x-4">
          <Link to="/submit-ad">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition duration-200">
              Hirdetés feladása
            </button>
          </Link>
          <Link to="/browse-ads">
            <button className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-red-700 transition duration-200">
              Hirdetések böngészése
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
