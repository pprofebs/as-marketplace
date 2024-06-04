import React from 'react';

function ImageModal({ isOpen, imageUrl, onClose, onNext, onPrevious }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-w-full max-h-full p-4">
        <img
          src={imageUrl}
          alt="Full size"
          className="rounded-lg shadow-lg"
          style={{ maxWidth: '90vw', maxHeight: '90vh' }}
        />
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 bg-white rounded-full p-2 text-gray-800"
        >
          &times;
        </button>
        <button
          onClick={onPrevious}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 text-gray-800"
        >
          &larr;
        </button>
        <button
          onClick={onNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 text-gray-800"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}

export default ImageModal;
