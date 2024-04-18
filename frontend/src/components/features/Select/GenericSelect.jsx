

const GenericSelect = ({ name, id, options, placeholder, handleChange }) => {
    return (
      <select name={name} id={id} className="input-field" onChange={handleChange}>
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