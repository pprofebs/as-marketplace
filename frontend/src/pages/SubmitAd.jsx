import React from 'react';
// https://dev.to/ajones_codes/a-better-guide-to-forms-in-react-47f0
function SubmitAd() {
  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <div className="container max-w-screen-lg mx-auto">
        <div>
          <h2 className="font-semibold text-xl text-gray-600">Submit Your Airsoft Replica Ad</h2>
          <p className="text-gray-500 mb-6">Please fill out all the fields to submit your ad.</p>

          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="text-gray-600">
                <p className="font-medium text-lg">Personal Details</p>
                <p>Please provide your contact information.</p>
              </div>

              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-2">
                  <div>
                    <label htmlFor="full_name">Full Name</label>
                    <input type="text" name="full_name" id="full_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                  </div>

                  <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="text" name="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="email@domain.com" />
                  </div>

                  <div>
                    <label htmlFor="phone">Phone Number</label>
                    <input type="text" name="phone" id="phone" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="e.g., +1234567890" />
                  </div>

                  <div>
                    <label htmlFor="location">Location</label>
                    <input type="text" name="location" id="location" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="e.g., City, Country" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-gray-600">
                <p className="font-medium text-lg">Airsoft Replica Details</p>
                <p>Please provide details about your airsoft replica.</p>
              </div>

              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-2">
                <div>
                  <label htmlFor="adTitle">Ad Title</label>
                  <input type="text" name="adTitle" id="adTitle" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                </div>

                <div>
                  <label htmlFor="description">Description</label>
                  <textarea id="description" name="description" className="h-24 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="Enter a description"></textarea>
                </div>

                <div>
                  <label htmlFor="price">Price</label>
                  <input type="text" name="price" id="price" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="Enter price" />
                </div>

                <div>
                  <label htmlFor="condition">Condition</label>
                  <select id="condition" name="condition" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50">
                    <option value="">Select Condition</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="category">Category</label>
                  <select id="category" name="category" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50">
                    <option value="">Select Category</option>
                    <option value="rifle">Rifle</option>
                    <option value="pistol">Pistol</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="images">Upload Images</label>
                  <input type="file" name="images" id="images" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" multiple />
                  <p className="text-xs text-gray-500">You can upload multiple images. Maximum file size: 5MB each.</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmitAd;
