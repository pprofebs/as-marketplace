import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const NavItem = ({ name, path }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <li>
      {isMobile ? (
        // Render mobile view HTML
        <Link className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
           to={path}>
          {name}
        </Link>
      ) : (
        // Render full view HTML
        <Link className="text-sm text-white hover:text-gray-500" to={path}>
          {name}
        </Link>
      )}
    </li>
  );
};


function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-blue-500">
      <nav className="relative px-4 py-4 flex justify-between items-center bg-[#2c3e50]">
        <Link className="text-3xl font-bold leading-none" to={"/"}>
          <img
            src="/path/to/your/logo.svg" // Replace with the path to your logo SVG
            alt="logo"
            className="h-10"
          />
        </Link>
        <div className="lg:hidden">
          <button className="navbar-burger flex items-center text-blue-600 p-3" onClick={toggleMenu}>
            <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
        <ul className={`lg:flex lg:mx-auto lg:flex lg:items-center lg:w-auto lg:space-x-6 ${isMenuOpen ? '' : 'hidden'}`}>
          <NavItem name={'Adj fel hirdetest'} path={'/adj-fel-hirdetest'} />
          <NavItem name={'Termekek'} path={'/termekek'} />
          <NavItem name={'Blog'} />
        </ul>
        <Link className="hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold rounded-xl transition duration-200" to={"/belepes"}>Bejelentkezes</Link>
        <Link className="hidden lg:inline-block py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200" to={"/regisztracio"}>Regisztracio</Link>
      </nav>
      <div className={`navbar-menu relative z-50 ${isMenuOpen ? '' : 'hidden'}`}>
        <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
        <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-full py-6 px-6 bg-white border-r overflow-y-auto">
          <div className="flex items-center mb-8">
            <a className="mr-auto text-3xl font-bold leading-none" href="#">
              <img
                src="/path/to/your/logo.svg" // Replace with the path to your logo SVG
                alt="logo"
                className="h-12"
              />
            </a>
            <button className="navbar-close" onClick={toggleMenu}>
              <svg className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div>
            <ul>
            <NavItem name={'Adj fel hirdetest'} path={'/adj-fel-hirdetest'} />
            <NavItem name={'Fegyverek'} path={'/termekek'} />
            </ul>
          </div>
          <div className="mt-auto">
            <div className="pt-6">
              <Link className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold leading-none bg-gray-50 hover:bg-gray-100 rounded-xl" to={"/login"}>Sign in</Link>
              <Link className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700  rounded-xl" to={"/signup"}>Sign Up</Link>
            </div>
            <p className="my-4 text-xs text-center text-gray-400">
              <span>Copyright © 2021</span>
            </p>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
