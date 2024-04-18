

const ImageUpload = ({ handleFileChange, imagePreviews }) => {
    return (

      <div>
        {/* File input for images */}
        <input
                type="file"
                name="images"
                id="images"
                className="input-field"
                onChange={handleFileChange}
                multiple
              />
        {/* Image previews */}
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
    );
  };

  export default ImageUpload;