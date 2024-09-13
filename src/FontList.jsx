import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FontPreview} from 'font-preview';

function FontList() {
  const [fonts, setFonts] = useState([]); // State to store font list

  // Fetch the list of fonts when the component mounts
  useEffect(() => {
    fetchFonts();
  }, []);

  // Function to fetch the fonts from the PHP server
  const fetchFonts = () => {
    axios.get('http://localhost:5000/server/list_fonts.php')
      .then(response => {
        setFonts(response.data); // Save fonts in state
      })
      .catch(error => {
        console.error('Error fetching fonts:', error.response ? error.response.data : error.message);
        alert('Failed to fetch fonts.');
      });
  };

  // Function to handle font deletion
  const deleteFont = (fontName) => {
    const formData = new FormData();
    formData.append('file', fontName);

    axios.post('http://localhost:5000/server/delete_font.php', formData)
      .then(response => {
        if (response.data.status === 'success') {
          fetchFonts(); // Refresh the font list after successful deletion
        } else {
          alert(`Error: ${response.data.message}`);
        }
      })
      .catch(error => {
        console.error('Error deleting font:', error.response ? error.response.data : error.message);
        alert('Failed to delete font. Check the console for more details.');
      });
  };

  return (
    <div className="font-list">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Available Fonts</h2>
        <button
          onClick={fetchFonts} // Refresh button to fetch fonts again
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Font Name</th>
            <th className="px-4 py-2">Preview</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {fonts.length > 0 ? fonts.map((font, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{font}</td>
              <td className="border px-4 py-2">
                <FontPreview
                  fontUrl={`http://localhost:5000/server/get_font.php?font=${font}`} // URL to the font file
                  text="Example Text" // Text to preview
                />
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => deleteFont(font)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="3" className="text-center py-4">No fonts available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FontList;
