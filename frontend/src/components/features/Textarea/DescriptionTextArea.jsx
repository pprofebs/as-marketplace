import React from 'react';

const DescriptionTextarea = ({ name, id, placeholder, handleChange, value }) => {
  return (
    <textarea
      name={name}
      id={id}
      rows="6"
      placeholder={placeholder}
      className="input-field resize-none col-span-2"
      onChange={handleChange}
      value={value}
    ></textarea>
  );
};

export default DescriptionTextarea;
