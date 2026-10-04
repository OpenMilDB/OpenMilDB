import React, { useState } from 'react';
import { BASE_MAPS, DEFAULT_OVERLAYS } from './config/mapConfig';
import { useCesiumViewer } from './hooks/useCesiumViewer';
import { useMapCamera } from './hooks/useMapCamera';
import { useMapLayers } from './hooks/useMapLayers';
import { useMapTerrain } from './hooks/useMapTerrain'; // <-- Import terrain hook
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

  // Sync Layers & Terrain State
  useMapLayers(viewer, isReady, activeBaseMapId, overlays);
  useMapTerrain(viewer, isReady, terrainEnabled, sunlightEnabled, hillshadingEnabled);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', flexDirection: 'column', backgroundColor: '#121212' }}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div style={{ width: 300, borderRight: '1px solid #333', padding: 15, background: '#1a1a1a' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: 14, color: '#888' }}>ORBAT TREE</h3>
          <div style={{ fontSize: 13, color: '#aaa' }}>• Command Hierarchy</div>
        </div>

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

      <div style={{ height: 200, borderTop: '1px solid #333', padding: 15, background: '#161616' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#888' }}>TELEMETRY LOG</h3>
        <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#0adb6b' }}>
          [OK] Map terrain and lighting sync online.
        </div>
      </div>
    </div>
  );
}