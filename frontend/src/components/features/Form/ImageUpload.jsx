import React from 'react';

const ImageUpload = ({ handleFileChange, imagePreviews, handleFileRemove }) => {
  const maxImages = 5;

  return (
    <div className="mb-6">
      <div className="mb-8">
      <input
        type="file"
        name="file"
        id="file"
        className="sr-only"
        onChange={handleFileChange}
        multiple
        accept="image/*"
      />
      <label
        htmlFor="file"
        className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center cursor-pointer"
      >
        <div>
          <span className="mb-2 block text-xl font-semibold text-[#07074D]">
            Tölts fel képeket a termékről
          </span>
          <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
            Tallózás..
          </span>
        </div>
      </label>
      </div>
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
        Csak {maxImages} darab képet lehet feltölteni. A maximum képméret: 5MB darabonként.
      </p>
    </div>
  );
};

export default ImageUpload;
