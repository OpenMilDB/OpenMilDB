import React from 'react';
import { BaseMapOption, OverlayOption } from '../types/layers';

interface LayerPickerProps {
  baseMaps: BaseMapOption[];
  activeBaseMapId: string;
  onSelectBaseMap: (id: string) => void;
  overlays: OverlayOption[];
  onToggleOverlay: (id: string) => void;
}

export const LayerPicker: React.FC<LayerPickerProps> = ({
  baseMaps,
  activeBaseMapId,
  onSelectBaseMap,
  overlays,
  onToggleOverlay,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: '#1e1e1e',
        color: '#e0e0e0',
        padding: '12px 16px',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        zIndex: 1000,
        width: '200px',
        fontSize: '12px',
        fontFamily: 'sans-serif',
        border: '1px solid #333',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#888' }}>
        BASE MAPS
      </div>
      {baseMaps.map((map) => (
        <label
          key={map.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '6px',
            cursor: 'pointer',
          }}
        >
          <input
            type="radio"
            name="baseMap"
            checked={activeBaseMapId === map.id}
            onChange={() => onSelectBaseMap(map.id)}
            style={{ marginRight: '8px' }}
          />
          {map.name}
        </label>
      ))}

      {overlays.length > 0 && (
        <>
          <hr style={{ borderColor: '#333', margin: '10px 0' }} />
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#888' }}>
            OVERLAYS
          </div>
          {overlays.map((overlay) => (
            <label
              key={overlay.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '6px',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={overlay.visible}
                onChange={() => onToggleOverlay(overlay.id)}
                style={{ marginRight: '8px' }}
              />
              {overlay.name}
            </label>
          ))}
        </>
      )}
    </div>
  );
};