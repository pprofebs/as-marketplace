import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({ title, secondaryTitle }) => {
  const sectionStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1541514431288-76b3c5aa474e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA==')`, // Specify the URL of the background image
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
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">{title}</h1>
        <p className="text-lg md:text-xl mb-8 drop-shadow-lg">{secondaryTitle}</p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Link to="/adj-fel-hirdetest">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition duration-200 shadow-lg">
              Hirdetés feladása
            </button>
          </Link>
          <Link to="/termekek">
            <button className="bg-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-red-700 transition duration-200 shadow-lg">
              Hirdetések böngészése
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
