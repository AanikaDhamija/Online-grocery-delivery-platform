// FINAL frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { PointsProvider } from './loyalty/context/PointsContext.jsx'; // 1. IMPORT THIS
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PointsProvider> {/* 2. ADD THIS WRAPPER AROUND APP */}
      <App />
    </PointsProvider>
  </React.StrictMode>,
);