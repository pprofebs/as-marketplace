

const DescriptionTextarea = ({ name, placeholder, value, onChange }) => {
    return (
      <textarea
        name={name}
        id={name}
        rows="6"
        placeholder={placeholder}
        className="input-field resize-none col-span-2"
        value={value}
        onChange={onChange}
      ></textarea>
    );
  };

  export default DescriptionTextarea;
