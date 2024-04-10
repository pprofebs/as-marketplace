import React, { useState } from 'react';

const SubmitAd = () => {
  const [imagePreviews, setImagePreviews] = useState([]);

  // Function to handle file input change and generate image previews
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Map through selected files and create URL for preview
    const previews = files.map((file) => URL.createObjectURL(file));

    // Update state with image previews
    setImagePreviews(previews);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Submit Your Airsoft Replica Ad</h2>

        <form className="space-y-6">
          {/* Personal Details */}
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">Personal Details</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                name="full_name"
                id="full_name"
                placeholder="Full Name"
                className="input-field"
              />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                className="input-field"
              />
              <input
                type="text"
                name="phone"
                id="phone"
                placeholder="Phone Number"
                className="input-field"
              />
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Location (City, Country)"
                className="input-field"
              />
            </div>
          </div>

          {/* Airsoft Replica Details */}
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">Airsoft Replica Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="adTitle"
                id="adTitle"
                placeholder="Ad Title"
                className="input-field"
              />
              <textarea
                name="description"
                id="description"
                rows="6" // Increase rows for a taller textarea
                placeholder="Description"
                className="input-field resize-none col-span-2" // Prevent textarea resizing and span across two columns
              ></textarea>
              <input
                type="text"
                name="price"
                id="price"
                placeholder="Price"
                className="input-field"
              />
              <select name="condition" id="condition" className="input-field">
                <option value="" disabled selected>
                  Select Condition
                </option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
              <select name="category" id="category" className="input-field">
                <option value="" disabled selected>
                  Select Category
                </option>
                <option value="rifle">Rifle</option>
                <option value="pistol">Pistol</option>
              </select>
              <input
                type="file"
                name="images"
                id="images"
                className="input-field"
                onChange={handleFileChange}
                multiple
              />
              <div className="flex flex-wrap -mx-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="w-1/3 px-4 mb-4">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-auto rounded-lg" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                You can upload multiple images. Maximum file size: 5MB each.
              </p>
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
  );
};

export default SubmitAd;
