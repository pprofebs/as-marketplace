import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('http://127.0.0.1:8000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            location: formData.location
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('User registered:', data);
          setIsRegistered(true);
        } else {
          const errorData = await response.json();
          console.error('Registration failed:', errorData.detail);
        }
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  if (isRegistered) {
    return <Navigate to="/sikeres-regisztracio" replace />;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Regisztráció</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Teljes név</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 focus:outline-none ${errors.fullName ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
          {/* Phone Number Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Telefonszám</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 focus:outline-none ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>
          {/* Location Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Helyszín</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 focus:outline-none ${errors.location ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Jelszó</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Jelszó megerősítése</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 focus:outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Regisztráció
          </button>
        </form>
        {/* Link to Login */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          Már van fiókod?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            Bejelentkezés
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
