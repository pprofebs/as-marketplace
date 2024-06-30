import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles

const DescriptionTextarea = ({ name, id, placeholder, value, handleChange }) => {
  // State to manage the editor content
  const [editorHtml, setEditorHtml] = useState(value);

  // Function to handle editor changes
  const handleEditorChange = (html) => {
    setEditorHtml(html);
    handleChange(html); // Propagate the HTML content to parent component
  };

  return (
    <div className="col-span-2 w-full">
      <ReactQuill
        name={name}
        id={id}
        placeholder={placeholder}
        value={editorHtml}
        onChange={handleEditorChange}
        modules={{
          toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['clean']
          ],
        }}
        formats={[
          'header', 'font',
          'list', 'bullet',
          'bold', 'italic', 'underline',
        ]}
      />
    </div>
  );
};

export default DescriptionTextarea;
