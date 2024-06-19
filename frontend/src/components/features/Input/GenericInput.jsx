

const GenericInput = ({ type, name, id, placeholder, handleChange }) => {
    return (
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        className="input-field w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
        onChange={handleChange}
      />
    );
  };

  export default GenericInput;
