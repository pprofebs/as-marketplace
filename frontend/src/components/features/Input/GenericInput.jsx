

const GenericInput = ({ type, name, id, placeholder, handleChange }) => {
    return (
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        className="input-field"
        onChange={handleChange}
      />
    );
  };

  export default GenericInput;
