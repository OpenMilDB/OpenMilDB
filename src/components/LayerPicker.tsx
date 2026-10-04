import React, { useState } from 'react';
import { BaseMapOption, OverlayOption, LayerPickerProps } from '../types/layers';

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        zIndex: 1000,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          backgroundColor: '#1f1f1f',
          color: '#e0e0e0',
          border: '1px solid #333333',
          borderRadius: '6px',
          padding: '8px 14px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'background-color 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2a2a2a')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1f1f1f')}
      >
        <span style={{ fontSize: '14px' }}>🗺️</span>
        <span>Layers & View Controls</span>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '42px',
            right: 0,
            width: '280px',
            backgroundColor: '#181818',
            color: '#e0e0e0',
            border: '1px solid #333333',
            borderRadius: '8px',
            padding: '14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            boxSizing: 'border-box',
          }}
        >
          {/* Base Maps Section */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#888888',
                letterSpacing: '0.8px',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Base Map
            </div>
            {baseMaps.map((map: BaseMapOption) => (
              <label
                key={map.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: activeBaseMapId === map.id ? '#ffffff' : '#aaaaaa',
                  marginBottom: '6px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="baseMap"
                  checked={activeBaseMapId === map.id}
                  onChange={() => onSelectBaseMap(map.id)}
                  style={{ accentColor: '#0adb6b', cursor: 'pointer' }}
                />
                <span>{map.name}</span>
              </label>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #2a2a2a', margin: '12px 0' }} />

          {/* Overlays Section */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#888888',
                letterSpacing: '0.8px',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Overlays
            </div>
            {overlays.map((overlay: OverlayOption) => (
              <label
                key={overlay.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: overlay.visible ? '#ffffff' : '#aaaaaa',
                  marginBottom: '6px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={overlay.visible}
                  onChange={() => onToggleOverlay(overlay.id)}
                  style={{ accentColor: '#0adb6b', cursor: 'pointer' }}
                />
                <span>{overlay.name}</span>
              </label>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #2a2a2a', margin: '12px 0' }} />

          {/* Terrain & Lighting Settings */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#888888',
                letterSpacing: '0.8px',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Terrain & Lighting
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: terrainEnabled ? '#ffffff' : '#aaaaaa',
                marginBottom: '6px',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={terrainEnabled}
                onChange={onToggleTerrain}
                style={{ accentColor: '#0adb6b', cursor: 'pointer' }}
              />
              <span>3D Terrain Elevation</span>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: sunlightEnabled ? '#ffffff' : '#aaaaaa',
                marginBottom: '6px',
                cursor: 'pointer',
                opacity: terrainEnabled ? 1 : 0.5,
              }}
            >
              <input
                type="checkbox"
                disabled={!terrainEnabled}
                checked={sunlightEnabled}
                onChange={onToggleSunlight}
                style={{ accentColor: '#0adb6b', cursor: terrainEnabled ? 'pointer' : 'not-allowed' }}
              />
              <span>Sunlight / Day-Night</span>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: hillshadingEnabled ? '#ffffff' : '#aaaaaa',
                cursor: 'pointer',
                opacity: terrainEnabled ? 1 : 0.5,
              }}
            >
              <input
                type="checkbox"
                disabled={!terrainEnabled}
                checked={hillshadingEnabled}
                onChange={onToggleHillshading}
                style={{ accentColor: '#0adb6b', cursor: terrainEnabled ? 'pointer' : 'not-allowed' }}
              />
              <span>Hillshading / Atmosphere</span>
            </label>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #2a2a2a', margin: '12px 0' }} />

          {/* Camera Controls */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#888888',
                letterSpacing: '0.8px',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Camera Pitch Controls
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => onTiltChange(15)}
                style={{
                  flex: 1,
                  backgroundColor: '#242424',
                  color: '#e0e0e0',
                  border: '1px solid #3a3a3a',
                  borderRadius: '4px',
                  padding: '6px 0',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Tilt Up (+15°)
              </button>
              <button
                onClick={() => onTiltChange(-15)}
                style={{
                  flex: 1,
                  backgroundColor: '#242424',
                  color: '#e0e0e0',
                  border: '1px solid #3a3a3a',
                  borderRadius: '4px',
                  padding: '6px 0',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Tilt Down (-15°)
              </button>
              <button
                onClick={onResetTilt}
                style={{
                  flex: 1,
                  backgroundColor: '#242424',
                  color: '#0adb6b',
                  border: '1px solid #3a3a3a',
                  borderRadius: '4px',
                  padding: '6px 0',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Top-Down
              </button>
              <button
                onClick={onResetNorthNadir}
                style={{
                  flex: 1,
                  backgroundColor: '#242424',
                  color: '#0adb6b',
                  border: '1px solid #3a3a3a',
                  borderRadius: '4px',
                  padding: '6px 0',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reset View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};