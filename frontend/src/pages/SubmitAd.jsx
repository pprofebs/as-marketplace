import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LoginPage from './Login';
import GenericInput from '../components/features/Input/GenericInput';
import GenericSelect from '../components/features/Select/GenericSelect';
import DescriptionTextarea from '../components/features/Textarea/DescriptionTextArea';
import ImageUpload from '../components/features/Form/ImageUpload';


const SubmitAd = () => {
  const [token, setToken] = useContext(UserContext);
  const navigate = useNavigate();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    adTitle: '',
    description: '',
    price: '',
    condition: '',
    category: '',
    images: [],
  });


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    // Update state with image previews
    setImagePreviews(previews);

    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        if (key === 'images') {
          formData[key].forEach((file) => {
            formDataToSend.append('images', file);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/ads/create', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Ad created:', data);
        // Handle success (e.g., show success message, redirect user)
      } else {
        const errorData = await response.json();
        console.error('Ad creation failed:', errorData.detail);
        // Handle error (e.g., display error message to user)
      }
    } catch (error) {
      console.error('Ad creation error:', error);
      // Handle network error or other exceptions
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const conditionOptions = [
    { label: 'New', value: 'new' },
    { label: 'Used', value: 'used' },
    // Add more options as needed...
  ];

  const categoryOptions = [
    { label: 'Rifle', value: 'rifle' },
    { label: 'Pistol', value: 'pistol' },
    // Add more options as needed...
  ];

  return (
    <div>
    {!token ? (
      <LoginPage/>

     ): (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Submit Your Airsoft Replica Ad</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Personal Details */}
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">Personal Details</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <GenericInput type={"text"} name={"phone"} id={"phone"} placeholder={"Phone Number"} handleChange={handleChange} />
              <GenericInput type={"text"} name={"location"} id={"location"} placeholder={"Location (City, Country)"} handleChange={handleChange} />
            </div>
          </div>

          {/* Airsoft Replica Details */}
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">Airsoft Replica Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GenericInput type={"text"} name={"adTitle"} id={"adtitle"} placeholder={"Ad Title"} handleChange={handleChange} />
              <DescriptionTextarea name={"description"} id={"description"} placeholder={"Description"} />
              <GenericInput type={"text"} name={"price"} id={"price"} placeholder={"Price"} handleChange={handleChange} />
              <GenericSelect name={"condition"} id={"condition"} options={conditionOptions} placeholder={"Select Condition"} handleChange={handleChange} />
              <GenericSelect name={"category"} id={"category"} options={categoryOptions} placeholder={"Select Category"} handleChange={handleChange} />


             <ImageUpload handleFileChange={handleFileChange} imagePreviews={imagePreviews} />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
     )}
     </div>
  );
};

export default SubmitAd;
