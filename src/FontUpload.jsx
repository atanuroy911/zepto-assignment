import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

function FontUpload() {
  const onDrop = useCallback(acceptedFiles => {
    // Handle the font file upload logic here
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    // Send the file to the PHP server using axios
    axios.post('http://localhost:5000/server/upload.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log(response.data);
      alert("File uploaded successfully!");
    })
    .catch(error => {
      console.error('Error:', error);
      alert("File upload failed.");
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'font/ttf': ['.ttf']
    },
    multiple: false, // Only one file at a time
  });

  const files = acceptedFiles.map(file => (
    <li key={file.path} className="text-sm text-green-500">
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div className="flex flex-col items-center">
      <div
        {...getRootProps()}
        className={`w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors 
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100 hover:bg-gray-200'}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500 text-center">Drop the font file here...</p>
        ) : (
          <p className="text-gray-700 text-center">Drag and drop a `.ttf` font file here, or click to select one.</p>
        )}
      </div>
      <aside className="mt-4">
        <h4 className="text-gray-700 font-medium">Uploaded Font:</h4>
        <ul>{files}</ul>
      </aside>
    </div>
  );
}

export default FontUpload;
