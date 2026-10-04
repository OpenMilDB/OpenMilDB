import React, { useState } from 'react';
import { BaseMapOption, OverlayOption } from '../types/layers';

interface LayerPickerProps {
  baseMaps: BaseMapOption[];
  activeBaseMapId: string;
  onSelectBaseMap: (id: string) => void;
  overlays: OverlayOption[];
  onToggleOverlay: (id: string) => void;
  terrainEnabled: boolean;
  onToggleTerrain: () => void;
  sunlightEnabled: boolean;
  onToggleSunlight: () => void;
  hillshadingEnabled: boolean;
  onToggleHillshading: () => void;
  onTiltChange: (deltaDegrees: number) => void;
  onResetTilt: () => void;
  onResetNorthNadir: () => void;
}

export const LayerPicker: React.FC<LayerPickerProps> = ({
  baseMaps,
  activeBaseMapId,
  onSelectBaseMap,
  overlays,
  onToggleOverlay,
  terrainEnabled,
  onToggleTerrain,
  sunlightEnabled,
  onToggleSunlight,
  hillshadingEnabled,
  onToggleHillshading,
  onTiltChange,
  onResetTilt,
  onResetNorthNadir,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          border: '1px solid #444444',
          borderRadius: '4px',
          padding: '8px 12px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(4px)',
        }}
      >
        <span>🗺️ Layer Controls</span>
        <span style={{ fontSize: '10px', color: '#888888' }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Control Panel Dropdown */}
      {isOpen && (
        <div
          style={{
            marginTop: '8px',
            width: '280px',
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            border: '1px solid #333333',
            borderRadius: '6px',
            padding: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            color: '#e0e0e0',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Section: Base Maps */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#888888',
                letterSpacing: '0.5px',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Base Maps
            </div>
            {baseMaps.map((map) => (
              <label
                key={map.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 0',
                  fontSize: '13px',
                  cursor: 'pointer',
                  color: activeBaseMapId === map.id ? '#4dabf7' : '#cccccc',
                }}
              >
                <input
                  type="radio"
                  name="basemap"
                  checked={activeBaseMapId === map.id}
                  onChange={() => onSelectBaseMap(map.id)}
                  style={{ accentColor: '#4dabf7', cursor: 'pointer' }}
                />
                {map.name}
              </label>
            ))}
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #333333', margin: '10px 0' }} />

          {/* Section: Vector Overlays */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#888888',
                letterSpacing: '0.5px',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Overlays
            </div>
            {overlays.map((overlay) => (
              <label
                key={overlay.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 0',
                  fontSize: '13px',
                  cursor: 'pointer',
                  color: '#cccccc',
                }}
              >
                <input
                  type="checkbox"
                  checked={overlay.visible}
                  onChange={() => onToggleOverlay(overlay.id)}
                  style={{ accentColor: '#4dabf7', cursor: 'pointer' }}
                />
                {overlay.name}
              </label>
            ))}
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #333333', margin: '10px 0' }} />

          {/* Section: Terrain & Lighting */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#888888',
                letterSpacing: '0.5px',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              3D Terrain & Lighting
            </div>

            {/* Terrain Toggle */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 0',
                fontSize: '13px',
                cursor: 'pointer',
                color: '#cccccc',
              }}
            >
              <input
                type="checkbox"
                checked={terrainEnabled}
                onChange={onToggleTerrain}
                style={{ accentColor: '#4dabf7', cursor: 'pointer' }}
              />
              Enable 3D Terrain Mesh
            </label>

            {/* Sunlight Option (Grayed out if terrain disabled) */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 0 4px 16px',
                fontSize: '12px',
                cursor: terrainEnabled ? 'pointer' : 'not-allowed',
                opacity: terrainEnabled ? 1 : 0.4,
                color: '#bbbbbb',
                transition: 'opacity 0.2s ease',
              }}
            >
              <input
                type="checkbox"
                checked={sunlightEnabled}
                disabled={!terrainEnabled}
                onChange={onToggleSunlight}
                style={{ accentColor: '#4dabf7', cursor: terrainEnabled ? 'pointer' : 'not-allowed' }}
              />
              Sunlight & Dynamic Shadows
            </label>

            {/* Hillshading Option (Grayed out if terrain disabled) */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 0 4px 16px',
                fontSize: '12px',
                cursor: terrainEnabled ? 'pointer' : 'not-allowed',
                opacity: terrainEnabled ? 1 : 0.4,
                color: '#bbbbbb',
                transition: 'opacity 0.2s ease',
              }}
            >
              <input
                type="checkbox"
                checked={hillshadingEnabled}
                disabled={!terrainEnabled}
                onChange={onToggleHillshading}
                style={{ accentColor: '#4dabf7', cursor: terrainEnabled ? 'pointer' : 'not-allowed' }}
              />
              Terrain Hillshading & Atmosphere
            </label>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #333333', margin: '10px 0' }} />

          {/* Section: Camera Tilt Controls */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#888888',
                letterSpacing: '0.5px',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Camera Controls
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              <button
                onClick={() => onTiltChange(15)}
                style={{
                  flex: 1,
                  backgroundColor: '#2a2a2a',
                  color: '#ffffff',
                  border: '1px solid #444444',
                  borderRadius: '3px',
                  padding: '5px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Tilt Up (+15°)
              </button>
              <button
                onClick={() => onTiltChange(-15)}
                style={{
                  flex: 1,
                  backgroundColor: '#2a2a2a',
                  color: '#ffffff',
                  border: '1px solid #444444',
                  borderRadius: '3px',
                  padding: '5px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Tilt Down (-15°)
              </button>
              <button
                onClick={onResetTilt}
                style={{
                  flex: 1,
                  backgroundColor: '#2a2a2a',
                  color: '#ffffff',
                  border: '1px solid #444444',
                  borderRadius: '3px',
                  padding: '5px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Top-Down (Nadir)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};