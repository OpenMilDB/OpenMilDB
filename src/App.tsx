import React, { useState, useCallback, useEffect, useRef } from 'react';
import { BASE_MAPS, DEFAULT_OVERLAYS } from './config/mapConfig';
import { useCesiumViewer } from './hooks/useCesiumViewer';
import { useMapCamera } from './hooks/useMapCamera';
import { useMapLayers } from './hooks/useMapLayers';
import { useMapTerrain } from './hooks/useMapTerrain';
import { LayerPicker } from './components/LayerPicker';
import { Compass } from './components/Compass';

export default function App() {
  const { viewer, isReady } = useCesiumViewer('cesiumContainer');
  const { adjustTilt, resetTilt, resetNorthNadir } = useMapCamera(viewer);

  const [activeBaseMapId, setActiveBaseMapId] = useState('usgs_topo');
  const [overlays, setOverlays] = useState(DEFAULT_OVERLAYS);

  const [terrainEnabled, setTerrainEnabled] = useState(true);
  const [sunlightEnabled, setSunlightEnabled] = useState(false);
  const [hillshadingEnabled, setHillshadingEnabled] = useState(true);

  // Panel Size States (In Pixels)
  const [treeWidth, setTreeWidth] = useState<number>(300);
  const [telemetryHeight, setTelemetryHeight] = useState<number>(200);

  // Dragging Active States
  const [isResizingTree, setIsResizingTree] = useState<boolean>(false);
  const [isResizingTelemetry, setIsResizingTelemetry] = useState<boolean>(false);

  const appRef = useRef<HTMLDivElement>(null);

  // Sync Layers & Terrain State
  useMapLayers(viewer, isReady, activeBaseMapId, overlays);
  useMapTerrain(viewer, isReady, terrainEnabled, sunlightEnabled, hillshadingEnabled);

  // Force Cesium canvas to resize on panel drag
  const triggerCesiumResize = useCallback(() => {
    if (viewer && !viewer.isDestroyed()) {
      viewer.resize();
    }
  }, [viewer]);

  // Drag Handlers
  const handleMouseDownTree = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingTree(true);
  };

  const handleMouseDownTelemetry = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingTelemetry(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizingTree) {
        // Clamp tree width between 180px and 600px
        const newWidth = Math.min(Math.max(e.clientX, 180), 600);
        setTreeWidth(newWidth);
        triggerCesiumResize();
      }

      if (isResizingTelemetry && appRef.current) {
        const appBounds = appRef.current.getBoundingClientRect();
        const newHeight = appBounds.bottom - e.clientY;
        // Clamp telemetry height between 60px and 500px
        setTelemetryHeight(Math.min(Math.max(newHeight, 60), 500));
        triggerCesiumResize();
      }
    },
    [isResizingTree, isResizingTelemetry, triggerCesiumResize]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizingTree(false);
    setIsResizingTelemetry(false);
    triggerCesiumResize();
  }, [triggerCesiumResize]);

  // Global mousemove and mouseup listeners
  useEffect(() => {
    if (isResizingTree || isResizingTelemetry) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingTree, isResizingTelemetry, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={appRef}
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        flexDirection: 'column',
        backgroundColor: '#121212',
        overflow: 'hidden',
        userSelect: isResizingTree || isResizingTelemetry ? 'none' : 'auto',
      }}
    >
      {/* Upper Section: Tree + Cesium Map Viewport */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Left ORBAT Tree Panel */}
        <div
          style={{
            width: `${treeWidth}px`,
            flexShrink: 0,
            borderRight: '1px solid #333',
            padding: 15,
            background: '#1a1a1a',
            overflowY: 'auto',
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: 14, color: '#888' }}>ORBAT TREE</h3>
          <div style={{ fontSize: 13, color: '#aaa' }}>• Command Hierarchy</div>
        </div>

        {/* Vertical Resize Slider (Tree Divider) */}
        <div
          onMouseDown={handleMouseDownTree}
          style={{
            width: '6px',
            cursor: 'col-resize',
            backgroundColor: isResizingTree ? '#007acc' : '#222222',
            transition: 'background-color 0.15s ease',
            zIndex: 10,
          }}
        />

        {/* Cesium Map Container */}
        <div style={{ flex: 1, position: 'relative', background: '#000', overflow: 'hidden' }}>
          <LayerPicker
            baseMaps={BASE_MAPS}
            activeBaseMapId={activeBaseMapId}
            onSelectBaseMap={setActiveBaseMapId}
            overlays={overlays}
            onToggleOverlay={(id) => {
              setOverlays((prev) =>
                prev.map((o) => (o.id === id ? { ...o, visible: !o.visible } : o))
              );
            }}
            terrainEnabled={terrainEnabled}
            onToggleTerrain={() => setTerrainEnabled((prev) => !prev)}
            sunlightEnabled={sunlightEnabled}
            onToggleSunlight={() => setSunlightEnabled((prev) => !prev)}
            hillshadingEnabled={hillshadingEnabled}
            onToggleHillshading={() => setHillshadingEnabled((prev) => !prev)}
            onTiltChange={adjustTilt}
            onResetTilt={resetTilt}
            onResetNorthNadir={resetNorthNadir}
          />

          {isReady && viewer && (
            <Compass viewer={viewer} onResetNorth={resetNorthNadir} />
          )}

          <div id="cesiumContainer" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* Horizontal Resize Slider (Telemetry Divider) */}
      <div
        onMouseDown={handleMouseDownTelemetry}
        style={{
          height: '6px',
          cursor: 'row-resize',
          backgroundColor: isResizingTelemetry ? '#007acc' : '#222222',
          transition: 'background-color 0.15s ease',
          zIndex: 10,
        }}
      />

      {/* Bottom Telemetry Log Panel */}
      <div
        style={{
          height: `${telemetryHeight}px`,
          flexShrink: 0,
          borderTop: '1px solid #333',
          padding: 15,
          background: '#161616',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#888' }}>TELEMETRY LOG</h3>
        <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#0adb6b' }}>
          [OK] Map terrain and lighting sync online.
        </div>
      </div>
    </div>
  );
}