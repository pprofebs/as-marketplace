

const SubmitButton = ({ handleSubmit }) => {
    return (
      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    );
  };

  export default SubmitButton;