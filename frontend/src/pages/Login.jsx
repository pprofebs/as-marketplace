import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Destructure the context object to access setToken
  const { setToken } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear corresponding error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);

    // If no errors, submit the form (perform sign-in logic)
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('http://127.0.0.1:8000/auth/access-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            username: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Login successful:', data);
          setIsAuthenticated(true);
          setToken(data.access_token);
          // Handle success (e.g., redirect user)
        } else {
          const errorData = await response.json();
          console.error('Login failed:', errorData.detail);
          setErrors({ email: 'Invalid email or password', password: 'Invalid email or password' });
          // Handle error (e.g., display error message)
        }
      } catch (error) {
        console.error('Login error:', error);
        // Handle network error or other exceptions
      }
    }
  };

  // Redirect to dashboard upon successful authentication
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Bejelentkezés</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 focus:outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Jelszó
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 focus:outline-none ${
                errors.password ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Bejelentkezés
          </button>
        </form>
        {/* Link to Sign Up */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          Még nem regisztráltál?{' '}
          <Link to="/regisztracio" className="text-blue-500 hover:text-blue-600">
            Regisztráció
          </Link>
        </p>
        {/* Link to Forgot Password */}
        <p className="text-sm text-gray-600 mt-2 text-center">
          Elfelejtetted a jelszavad?{' '}
          <Link to="/forgot-password" className="text-blue-500 hover:text-blue-600">
            Kérj új jelszót
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
