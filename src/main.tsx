import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Type declaration for runtime window config
declare global {
  interface Window {
    APP_CONFIG?: {
      CESIUM_ION_TOKEN?: string;
      CARTO_API_KEY?: string;
    };
  }
}

async function initApp() {
  try {
    const res = await fetch('/config.json');
    if (res.ok) {
      window.APP_CONFIG = await res.json();
    }
  } catch (err) {
    console.warn('config.json not found or failed to load. Falling back to keyless/env mode:', err);
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

initApp();