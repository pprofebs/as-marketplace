

const GenericSelect = ({ name, id, options, placeholder, handleChange }) => {
    return (
      <select name={name} id={id} className="input-field w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" onChange={handleChange}>
        <option value="" disabled selected>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
      </select>
    );
  };

  export default GenericSelect;