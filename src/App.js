import React from 'react';
import ImageUploader from './ImageUploader';
import './App.css';

const App = () => {
  return (
    <div className="container">
      <h1>Aesthetics Treatment Plan</h1>
      <div className="upload-section">
        <ImageUploader />
      </div>
    </div>
  );
};

export default App;
