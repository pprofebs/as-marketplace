import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form validation
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);

    // If there are no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      // Add your signup logic here
      console.log('Form submitted:', formData);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Sign Up</button>
        </form>
        <p className="text-gray-600 text-sm mt-4 text-center">Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-600">Log In</Link></p>
      </div>
    </div>
  );
};

export default SignupPage;