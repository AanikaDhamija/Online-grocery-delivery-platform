import React from "react";
import "../STYLES/AdminPage.css"; // or the CSS file where spinner styles are defined

const Spinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p className="loading-text">Loading...</p>
  </div>
);

export default Spinner;