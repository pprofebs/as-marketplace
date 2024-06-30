import React from 'react';
import { Link } from 'react-router-dom';

const FooterItem = ({ name, to }) => {
  return (
    <div className="px-5 py-2">
      <Link to={to} className="text-base leading-6 text-white hover:text-blue-900">
        {name}
      </Link>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center -mx-4">
          <FooterItem name={'Adj fel hirdetést'} to={'/adj-fel-hirdetest'} />
          <FooterItem name={'Termékek'} to={'/termekek'} />
        </nav>
        <div className="flex justify-center mt-8 space-x-6">
          <a href="#" className="text-white hover:text-blue-500">
            <span className="sr-only">Facebook</span>
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22.675 0H1.325C.594 0 0 .594 0 1.326v21.348C0 23.406.594 24 1.325 24H12.81v-9.293H9.692v-3.622h3.118V8.41c0-3.097 1.891-4.785 4.65-4.785 1.323 0 2.46.099 2.791.143v3.24l-1.915.001c-1.5 0-1.792.715-1.792 1.762v2.31h3.584l-.467 3.622h-3.117V24h6.112c.73 0 1.324-.594 1.324-1.326V1.326C24 .594 23.406 0 22.675 0z" />
            </svg>
          </a>
          <a href="#" className="text-white hover:text-pink-500">
            <span className="sr-only">Instagram</span>
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.325 3.608 1.3.975.975 1.238 2.242 1.3 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.325 2.633-1.3 3.608-.975.975-2.242 1.238-3.608 1.3-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.325-3.608-1.3-.975-.975-1.238-2.242-1.3-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.325-2.633 1.3-3.608.975-.975 2.242-1.238 3.608-1.3 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.332.014 7.053.072 5.77.13 4.67.347 3.678 1.34c-.992.992-1.21 2.092-1.268 3.375C2.014 6.332 2 6.741 2 10s.014 3.668.072 4.947c.058 1.283.276 2.383 1.268 3.375.992.992 2.092 1.21 3.375 1.268 1.279.058 1.688.072 4.947.072s3.668-.014 4.947-.072c1.283-.058 2.383-.276 3.375-1.268.992-.992 1.21-2.092 1.268-3.375.058-1.279.072-1.688.072-4.947s-.014-3.668-.072-4.947c-.058-1.283-.276-2.383-1.268-3.375-.992-.992-2.092-1.21-3.375-1.268C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
            </svg>
          </a>
        </div>
        <p className="mt-8 text-base leading-6 text-center text-gray-400">
          © {new Date().getFullYear()} FegyveresCég Kft. Minden jog fenntartva.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
