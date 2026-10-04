import React, { useState } from 'react';
import { getCesiumIonToken, getCartoApiKey, setCesiumIonToken, setCartoApiKey } from '../utils/keys';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [ionToken, setIonToken] = useState(getCesiumIonToken());
  const [cartoKey, setCartoKey] = useState(getCartoApiKey());

  if (!isOpen) return null;

  const handleSave = () => {
    setCesiumIonToken(ionToken.trim());
    setCartoApiKey(cartoKey.trim());
    onSave();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '20px',
          width: '360px',
          color: '#fff',
        }}
      >
        <h3 style={{ marginTop: 0 }}>API Key Settings</h3>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>
            Cesium Ion Token
          </label>
          <input
            type="password"
            value={ionToken}
            onChange={(e) => setIonToken(e.target.value)}
            placeholder="Paste token here..."
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#2a2a2a',
              border: '1px solid #444',
              color: '#fff',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>
            CARTO API Key
          </label>
          <input
            type="password"
            value={cartoKey}
            onChange={(e) => setCartoKey(e.target.value)}
            placeholder="Paste key here..."
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#2a2a2a',
              border: '1px solid #444',
              color: '#fff',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '6px 12px',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '6px 12px',
              backgroundColor: '#007acc',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
};