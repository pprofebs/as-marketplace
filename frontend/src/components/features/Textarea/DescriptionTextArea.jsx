import React from 'react';

const DescriptionTextarea = ({ name, id, placeholder, handleChange, value }) => {
  return (
    <textarea
      name={name}
      id={id}
      rows="6"
      placeholder={placeholder}
      className="input-field resize-none col-span-2 w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
      onChange={handleChange}
      value={value}
    ></textarea>
  );
};

export default DescriptionTextarea;
