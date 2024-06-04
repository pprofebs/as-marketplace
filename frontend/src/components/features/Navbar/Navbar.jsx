import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';


const Navbar = () => {
  const [token, setToken] = useContext(UserContext);

  const handleLogout = () => {
      setToken(null);
  };

  return (
    <nav className="bg-[#2c3e50] text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Airsoft Marketplace
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/adj-fel-hirdetest" className="hover:text-gray-300">
              Adj fel hirdetést
            </Link>
          </li>
          <li>
            <Link to="/termekek" className="hover:text-gray-300">
              Termékek
            </Link>
          </li>
          <li>
            <Link to="/blog" className="hover:text-gray-300">
              Blog
            </Link>
          </li>
        </ul>
        <div>
        {!token ? (
        <div>
          <Link to="/belepes" className="hidden lg:inline-block mr-4 hover:text-gray-300">
            Bejelentkezés
          </Link>
          <Link to="/regisztracio" className="hidden lg:inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200">
            Regisztráció
          </Link>
        </div>
      ) : (
        <>
          <Link to="/en">Profil</Link><br></br>
          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
      </div>
    </nav>
  );
};

export default Navbar;
