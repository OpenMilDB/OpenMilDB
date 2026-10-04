import React, { useState, useCallback, useEffect, useRef } from 'react';
import { BASE_MAPS, DEFAULT_OVERLAYS } from './config/mapConfig';
import { INITIAL_TACTICAL_UNITS } from './config/mockUnits';
import { useCesiumViewer } from './hooks/useCesiumViewer';
import { useMapCamera } from './hooks/useMapCamera';
import { useMapLayers } from './hooks/useMapLayers';
import { useMapTerrain } from './hooks/useMapTerrain';
import { useCoordinateTracker } from './hooks/useCoordinateTracker';
import { useSymbolLayer } from './hooks/useSymbolLayer';
import { LayerPicker } from './components/LayerPicker';
import { Compass } from './components/Compass';
import { CoordinateHUD } from './components/CoordinateHUD';

export default function App() {
  const { viewer, isReady } = useCesiumViewer('cesiumContainer');
  const { adjustTilt, resetTilt, resetNorthNadir } = useMapCamera(viewer);
  const coords = useCoordinateTracker(viewer, isReady);

  const hasIonToken = Boolean(
    window.APP_CONFIG?.CESIUM_ION_TOKEN || import.meta.env.VITE_CESIUM_ION_TOKEN
  );
  const hasCartoKey = Boolean(
    window.APP_CONFIG?.CARTO_API_KEY || import.meta.env.VITE_CARTO_API_KEY
  );

  const INITIAL_BASEMAP = hasIonToken ? 'bing_aerial' : 'blue_marble_nasa';

  const [activeBaseMapId, setActiveBaseMapId] = useState(INITIAL_BASEMAP);
  const [overlays, setOverlays] = useState(DEFAULT_OVERLAYS);

  const [terrainEnabled, setTerrainEnabled] = useState(true);
  const [sunlightEnabled, setSunlightEnabled] = useState(false);
  const [hillshadingEnabled, setHillshadingEnabled] = useState(true);

  // Tactical Unit State for MIL-STD-2525 Symbology
  const [units] = useState(INITIAL_TACTICAL_UNITS);

  // Panel Size States
  const [treeWidth, setTreeWidth] = useState<number>(300);
  const [telemetryHeight, setTelemetryHeight] = useState<number>(200);

  // Resizing Active States
  const [isResizingTree, setIsResizingTree] = useState<boolean>(false);
  const [isResizingTelemetry, setIsResizingTelemetry] = useState<boolean>(false);

  const appRef = useRef<HTMLDivElement>(null);

  // Sync Layers, Terrain & Tactical Symbols
  useMapLayers(viewer, isReady, activeBaseMapId, overlays);
  useMapTerrain(viewer, isReady, terrainEnabled, sunlightEnabled, hillshadingEnabled);
  useSymbolLayer(viewer, isReady, units);

  // Helper to find display name of active provider
  const activeBaseMap = BASE_MAPS.find((m) => m.id === activeBaseMapId) || BASE_MAPS[0];

  const triggerCesiumResize = useCallback(() => {
    if (viewer && !viewer.isDestroyed()) {
      viewer.resize();
    }
  }, [viewer]);

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
        const newWidth = Math.min(Math.max(e.clientX, 180), 600);
        setTreeWidth(newWidth);
        triggerCesiumResize();
      }

      if (isResizingTelemetry && appRef.current) {
        const appBounds = appRef.current.getBoundingClientRect();
        const newHeight = appBounds.bottom - e.clientY;
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
          <div style={{ fontSize: 13, color: '#aaa' }}>
            {units.map((unit) => (
              <div key={unit.id} style={{ marginBottom: 6 }}>
                • {unit.name} ({unit.higherFormation || 'UNASSIGNED'})
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Resize Slider */}
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

        {/* Cesium Map Viewport */}
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
            hasIonToken={hasIonToken}
            hasCartoKey={hasCartoKey}
          />

          {isReady && viewer && (
            <Compass viewer={viewer} onResetNorth={resetNorthNadir} />
          )}

          {/* Cesium Canvas Container */}
          <div id="cesiumContainer" style={{ width: '100%', height: '100%' }} />

          {/* Bottom-Left Collapsible Tactical Coordinate HUD */}
          <CoordinateHUD coords={coords} activeBaseMapName={activeBaseMap.name} />
        </div>
      </div>

      {/* Horizontal Resize Slider */}
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

      {/* Telemetry Log Panel */}
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
          [OK] Map terrain, lighting, and MIL-STD-2525 unit layers online.
        </div>
      </div>
    </div>
  );
}