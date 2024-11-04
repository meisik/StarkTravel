import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { StarknetProvider } from './services/StarknetProvider.js';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StarknetProvider>
      <Router>
        <App />
      </Router>
    </StarknetProvider>
  </React.StrictMode>
);