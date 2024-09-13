import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

function FontGroup() {
  const [groupName, setGroupName] = useState('');
  const [selectedFonts, setSelectedFonts] = useState(['']);
  const [fontGroups, setFontGroups] = useState([]);
  const [fonts, setFonts] = useState([]); // State to store font list
  const [editIndex, setEditIndex] = useState(null); // State to manage the editing mode

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

  // Add a new row for font selection
  const addRow = () => {
    setSelectedFonts([...selectedFonts, '']);
  };

  // Remove a row for font selection
  const removeRow = (index) => {
    const updatedFonts = selectedFonts.filter((_, i) => i !== index);
    setSelectedFonts(updatedFonts);
  };

  // Handle font selection
  const handleFontChange = (index, event) => {
    const updatedFonts = [...selectedFonts];
    updatedFonts[index] = event.target.value;
    setSelectedFonts(updatedFonts);
  };

  // Handle group name change
  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  // Create or update the font group
  const saveGroup = () => {
    if (selectedFonts.filter(font => font).length < 2 || !groupName.trim()) {
      alert('Please enter a group name and select at least two fonts.');
      return;
    }

    if (editIndex !== null) {
      // Update existing group
      const updatedGroups = fontGroups.map((group, index) =>
        index === editIndex
          ? { name: groupName, fonts: selectedFonts.filter(font => font) }
          : group
      );
      setFontGroups(updatedGroups);
      setEditIndex(null);
    } else {
      // Create new group
      setFontGroups([...fontGroups, { name: groupName, fonts: selectedFonts.filter(font => font) }]);
    }

    setGroupName('');
    setSelectedFonts(['']);
  };

  // Download the fonts as a ZIP file
  const downloadZip = async (groupName, fonts) => {
    const zip = new JSZip();
    
    // Fetch each font and add to the zip
    for (const font of fonts) {
      const response = await axios.get(`http://localhost:5000/server/get_font.php?font=${font}`, { responseType: 'blob' });
      zip.file(font, response.data);
    }

    zip.generateAsync({ type: 'blob' }).then(content => {
      FileSaver.saveAs(content, `${groupName}.zip`);
    });
  };

  // Filter fonts to exclude those already selected
  const getAvailableFonts = (index) => {
    const selected = new Set(selectedFonts);
    return fonts.filter(font => !selected.has(font) || selectedFonts[index] === font);
  };

  // Reset font groups
  const resetGroups = () => {
    setFontGroups([]);
    setEditIndex(null);
    setGroupName('');
    setSelectedFonts(['']);
  };

  // Remove a font group
  const removeFontGroup = (index) => {
    const updatedGroups = fontGroups.filter((_, i) => i !== index);
    setFontGroups(updatedGroups);
    if (editIndex === index) {
      resetGroups();
    }
  };

  // Start editing a font group
  const startEditing = (index) => {
    const group = fontGroups[index];
    setGroupName(group.name);
    setSelectedFonts(group.fonts);
    setEditIndex(index);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{editIndex !== null ? 'Edit Font Group' : 'Create Font Group'}</h2>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">Group Name:</label>
        <input
          type="text"
          value={groupName}
          onChange={handleGroupNameChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter group name"
        />
      </div>
      {selectedFonts.map((font, index) => (
        <div key={index} className="mb-4 flex items-center">
          <div className="flex-1 mr-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Select Font {index + 1}:</label>
            <select
              value={font}
              onChange={(e) => handleFontChange(index, e)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a font</option>
              {getAvailableFonts(index).map((f, i) => (
                <option key={i} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => removeRow(index)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={addRow}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600"
      >
        Add Row
      </button>
      <button
        onClick={saveGroup}
        className={`bg-${editIndex !== null ? 'yellow-500' : 'green-500'} text-white px-4 py-2 rounded-md hover:bg-${editIndex !== null ? 'yellow-600' : 'green-600'}`}
      >
        {editIndex !== null ? 'Update Group' : 'Create Group'}
      </button>
      <button
        onClick={resetGroups}
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
      >
        Reset Groups
      </button>

      {/* Display font groups */}
      {fontGroups.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Font Groups</h3>
          {fontGroups.map((group, index) => (
            <div key={index} className="mb-6 p-4 bg-white border border-gray-300 rounded-md shadow-sm">
              <h4 className="text-lg font-medium mb-2">{group.name}</h4>
              <ul className="list-disc pl-5 mb-4">
                {group.fonts.map((font, i) => (
                  <li key={i} className="text-gray-700">{font}</li>
                ))}
              </ul>
              <button
                onClick={() => downloadZip(group.name, group.fonts)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
              >
                Download as ZIP
              </button>
              <button
                onClick={() => startEditing(index)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => removeFontGroup(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete Group
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FontGroup;
