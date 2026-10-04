import React, { useState, useEffect, useRef } from 'react';
import { PanelDimensions } from './types/layout';
import { BaseMapOption, OverlayOption } from './types/layers';
import { LayerPicker } from './components/LayerPicker';
import { createBlankTileDiscardPolicy, attachFallbackErrorHandler } from './utils/cesiumLayers';

const MAP_OPTIONS: BaseMapOption[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap (Vector Map)',
    category: 'map',
    type: 'osm',
    url: 'https://tile.openstreetmap.org/',
  },
  {
    id: 'satellite_composite',
    name: 'Satellite / Aerial (ArcGIS + USGS NAIP High-Res)',
    category: 'imagery',
    type: 'urlTemplate',
  },
];

const INITIAL_OVERLAYS: OverlayOption[] = [
  {
    id: 'esri_boundaries_places',
    name: 'Esri Country Borders & Place Names',
    type: 'urlTemplate',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    visible: true,
  },
  {
    id: 'open_sea_map',
    name: 'OpenSeaMap (Seamarks)',
    type: 'urlTemplate',
    url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
    visible: false,
  },
];

export default function App() {
  const [dim] = useState<PanelDimensions>({
    leftWidthPx: 300,
    bottomHeightPx: 200,
  });

  const viewerRef = useRef<any>(null);
  const activeModeRef = useRef<'map' | 'imagery'>('map');
  const overlayLayersRef = useRef<Map<string, any>>(new Map());

  const [activeBaseMapId, setActiveBaseMapId] = useState<string>('osm');
  const [overlays, setOverlays] = useState<OverlayOption[]>(INITIAL_OVERLAYS);

  const applyBaseLayerMode = (mode: 'map' | 'imagery') => {
    const Cesium = (window as any).Cesium;
    const viewer = viewerRef.current;
    if (!viewer || !Cesium) return;

    viewer.imageryLayers.removeAll(false);

    if (mode === 'map') {
      const osmProvider = new Cesium.OpenStreetMapImageryProvider({
        url: 'https://tile.openstreetmap.org/',
      });
      viewer.imageryLayers.addImageryProvider(osmProvider, 0);
    } else {
      // Tier 0: ArcGIS World Imagery Base
      const arcgisProvider = new Cesium.UrlTemplateImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maximumLevel: 19,
      });
      viewer.imageryLayers.addImageryProvider(arcgisProvider, 0);

      // Tier 1: USGS NAIP High-Res Aerial Overlay (Fallback handling enabled)
      const usgsNaipProvider = new Cesium.WebMapServiceImageryProvider({
        url: 'https://imagery.nationalmap.gov/arcgis/services/USGSNAIPPlus/ImageServer/WMSServer',
        layers: 'USGSNAIPPlus',
        parameters: { transparent: true, format: 'image/png' },
        maximumLevel: 19,
        tileDiscardPolicy: createBlankTileDiscardPolicy() as any,
      });

      attachFallbackErrorHandler(usgsNaipProvider);
      viewer.imageryLayers.addImageryProvider(usgsNaipProvider, 1);
    }

    // Re-apply active raster overlays
    overlayLayersRef.current.clear();
    overlays.forEach((overlay) => {
      if (overlay.visible && overlay.url) {
        const provider = new Cesium.UrlTemplateImageryProvider({ url: overlay.url });
        const layer = viewer.imageryLayers.addImageryProvider(provider);
        overlayLayersRef.current.set(overlay.id, layer);
      }
    });

    activeModeRef.current = mode;
  };

  useEffect(() => {
    const Cesium = (window as any).Cesium;
    if (!Cesium) return;

    Cesium.Ion.defaultAccessToken = '';

    const viewer = new Cesium.Viewer('cesiumContainer', {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      baseLayer: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
    });

    viewerRef.current = viewer;

    // Default to vector map mode on startup
    applyBaseLayerMode('map');

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  const handleSelectBaseMap = (id: string) => {
    const selected = MAP_OPTIONS.find((m) => m.id === id);
    if (!selected) return;

    applyBaseLayerMode(selected.category);
    setActiveBaseMapId(id);
  };

  const handleToggleOverlay = (id: string) => {
    const Cesium = (window as any).Cesium;
    const viewer = viewerRef.current;
    if (!viewer || !Cesium) return;

    setOverlays((prev) =>
      prev.map((overlay) => {
        if (overlay.id !== id) return overlay;

        const nextVisibility = !overlay.visible;

        if (nextVisibility && overlay.url) {
          const provider = new Cesium.UrlTemplateImageryProvider({ url: overlay.url });
          const layer = viewer.imageryLayers.addImageryProvider(provider);
          overlayLayersRef.current.set(id, layer);
        } else {
          const existingLayer = overlayLayersRef.current.get(id);
          if (existingLayer) {
            viewer.imageryLayers.remove(existingLayer, true);
            overlayLayersRef.current.delete(id);
          }
        }

        return { ...overlay, visible: nextVisibility };
      })
    );
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
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        userSelect: 'none',
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
            background: '#1a1a1a',
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', letterSpacing: '0.5px', color: '#888888' }}>
            ORBAT TREE
          </h3>
          <div style={{ fontSize: '13px', color: '#aaaaaa' }}>• Command Hierarchy</div>
        </div>

        {/* Globe Viewport */}
        <div style={{ flex: 1, position: 'relative', background: '#000000', overflow: 'hidden' }}>
          <LayerPicker
            baseMaps={MAP_OPTIONS}
            activeBaseMapId={activeBaseMapId}
            onSelectBaseMap={handleSelectBaseMap}
            overlays={overlays}
            onToggleOverlay={handleToggleOverlay}
          />

          <div id="cesiumContainer" style={{ width: '100%', height: '100%' }} />
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
          background: '#161616',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', letterSpacing: '0.5px', color: '#888888' }}>
          TELEMETRY LOG
        </h3>
        <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#0adb6b' }}>
          [OK] OpenMilDB spatial framework initialized.
        </div>
      </div>
    </div>
  );
}