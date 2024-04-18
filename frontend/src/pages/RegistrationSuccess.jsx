import React from 'react';
import { Link } from 'react-router-dom';

const RegistrationSuccessPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-semibold mb-6">Thank You for Registering!</h2>
        <p className="text-gray-700 mb-4">
          Please check your email to activate your account.
        </p>
        <Link
          to="/belepes"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;
