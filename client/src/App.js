import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) {
      alert('Please select files');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('pdfs', selectedFiles[i]);
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/convert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setConvertedFiles(response.data.files);
    } catch (error) {
      console.error(error);
      alert('Error uploading files');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>PDF to HTML Converter</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Converting...' : 'Convert PDFs to HTML'}
      </button>

      <h2>Converted Files</h2>
      <ul>
        {convertedFiles.map((file, index) => (
          <li key={index}>
            <a href={`http://localhost:5000/${file}`} target="_blank" rel="noopener noreferrer">
              {file}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
