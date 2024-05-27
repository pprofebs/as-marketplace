import React from 'react';

const ImageUpload = ({ handleFileChange, imagePreviews, ImageHandleFileChange, handleFileRemove }) => {
  const maxImages = 5;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Images (max {maxImages})
      </label>
      <input
        type="file"
        name="images"
        id="images"
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
        onChange={handleFileChange}
        multiple
        disabled={imagePreviews.length >= maxImages}
      />
      <div className="flex flex-wrap mt-4 -mx-2">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="w-1/3 px-2 mb-4 relative">
            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-auto rounded-lg shadow-md" />
            <button
              type="button"
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
              onClick={() => handleFileRemove(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        You can upload a maximum of {maxImages} images. Maximum file size: 5MB each.
      </p>
    </div>
  );
};

export default ImageUpload;
