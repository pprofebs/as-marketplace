import React from 'react';

const FooterItem = ({ name }) => {
  return (
    <div className="px-5 py-2">
      <a href="#" className="text-base leading-6 text-white hover:text-gray-900">
        {name}
      </a>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center -mx-4">
          <FooterItem name={'Courses'} />
          <FooterItem name={'Pricing'} />
          <FooterItem name={'Blog'} />
        </nav>
        <div className="flex justify-center mt-8 space-x-6">
          <a href="#" className="text-white hover:text-gray-500">
            <span className="sr-only">Instagram</span>
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.477 2 2 6.484 2 12s4.477 10 10 10 10-4.484 10-10c0-1.827-.493-3.535-1.354-5H15v3h-2v-3h-2v3h-1.646C9.493 8.465 8 10.173 8 12c0 3.313 2.687 6 6 6s6-2.687 6-6c0-1.827-.493-3.535-1.354-5H21v3h3V7h-3V4h-2v3h-1.646C17.493 5.465 16 7.173 16 9c0 2.761 2.239 5 5 5s5-2.239 5-5c0-2.761-2.239-5-5-5z" />
            </svg>
          </a>
        </div>
        <p className="mt-8 text-base leading-6 text-center text-gray-400">
          © {new Date().getFullYear()} SomeCompany, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
