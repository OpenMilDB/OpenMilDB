import React, { useState, useEffect, useRef } from 'react';
import { PanelDimensions } from './types/layout';

export default function App() {
  const [dim] = useState<PanelDimensions>({ 
    leftWidthPx: 300, 
    bottomHeightPx: 200 
  });

  const viewerRef = useRef<any>(null);

  useEffect(() => {
    const Cesium = (window as any).Cesium;

    if (!Cesium) {
      console.error("Cesium global engine is missing. Make sure your script tag in index.html is loaded.");
      return;
    }

    // Disable Ion authentication calls entirely
    Cesium.Ion.defaultAccessToken = '';

    // Initialize OpenStreetMap provider directly using constructor syntax
    const osmProvider = new Cesium.OpenStreetMapImageryProvider({
      url: 'https://tile.openstreetmap.org/'
    });

    const viewer = new Cesium.Viewer('cesiumContainer', {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      baseLayer: new Cesium.ImageryLayer(osmProvider),
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false
    });

    viewerRef.current = viewer;

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  const undock = () => {
    if ((window as any).electron?.ipcRenderer) {
      (window as any).electron.ipcRenderer.invoke('panel:popout:spawn', { 
        panelId: 'bottom', 
        targetDisplayIndex: 0 
      });
    } else {
      console.warn("Electron IPC bridge is unavailable in this environment context.");
    }
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        height: '100vh', 
        width: '100vw', 
        flexDirection: 'column', 
        backgroundColor: '#121212', 
        color: '#e0e0e0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        
        {/* Left Panel */}
        <div 
          style={{ 
            width: dim.leftWidthPx, 
            borderRight: '1px solid #333333', 
            padding: '15px', 
            boxSizing: 'border-box',
            overflowY: 'auto',
            background: '#1a1a1a'
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', letterSpacing: '0.5px', color: '#888888' }}>
            ORBAT TREE
          </h3>
          <div style={{ fontSize: '13px', color: '#aaaaaa' }}>
            • Roots Command Structure
          </div>
        </div>

        {/* Globe Viewport */}
        <div 
          style={{ 
            flex: 1, 
            position: 'relative',
            background: '#000000',
            overflow: 'hidden'
          }}
        >
          <div id="cesiumContainer" style={{ width: '100%', height: '100%' }} />

          <button 
            onClick={undock} 
            style={{ 
              position: 'absolute', 
              top: 15, 
              right: 15,
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              transition: 'background-color 0.2s',
              zIndex: 1000
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            Undock Panel
          </button>
        </div>

      </div>

      {/* Bottom Panel */}
      <div 
        style={{ 
          height: dim.bottomHeightPx, 
          borderTop: '1px solid #333333', 
          padding: '15px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          background: '#161616'
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', letterSpacing: '0.5px', color: '#888888' }}>
          TELEMETRY LOG
        </h3>
        <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#0adb6b' }}>
          [OK] OpenMilDB spatial global framework initialized successfully.
        </div>
      </div>
    </div>
  );
}