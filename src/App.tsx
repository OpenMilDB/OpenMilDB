import React, { useState, useEffect, useRef } from 'react';
import { PanelDimensions } from './types/layout';
import { BaseMapOption, OverlayOption } from './types/layers';
import { LayerPicker } from './components/LayerPicker';
import {
  attachFallbackErrorHandler,
  createNonIonTerrainProvider,
} from './utils/cesiumLayers';

const MAP_OPTIONS: BaseMapOption[] = [
  {
    id: 'usgs_topo',
    name: 'USGS Topographic Map (Elevation Lines)',
    category: 'map',
    type: 'urlTemplate',
    url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
  },
  {
    id: 'osm',
    name: 'OpenStreetMap (Standard Vector)',
    category: 'map',
    type: 'osm',
    url: 'https://tile.openstreetmap.org/',
  },
  {
    id: 'satellite_composite',
    name: 'Satellite / Aerial Imagery',
    category: 'imagery',
    type: 'urlTemplate',
  },
];

const INITIAL_OVERLAYS: OverlayOption[] = [
  {
    id: 'esri_transportation',
    name: 'Esri Roads & Highways Network',
    type: 'urlTemplate',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
    visible: false,
  },
  {
    id: 'esri_boundaries_places',
    name: 'Esri Borders & Place Names',
    type: 'urlTemplate',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    visible: false,
  },
];

export default function App() {
  const [dim] = useState<PanelDimensions>({
    leftWidthPx: 300,
    bottomHeightPx: 200,
  });

  const viewerRef = useRef<any>(null);
  const overlayLayersRef = useRef<Map<string, any>>(new Map());

  const [activeBaseMapId, setActiveBaseMapId] = useState<string>('usgs_topo');
  const [overlays, setOverlays] = useState<OverlayOption[]>(INITIAL_OVERLAYS);

  const [terrainEnabled, setTerrainEnabled] = useState<boolean>(true);
  const [sunlightEnabled, setSunlightEnabled] = useState<boolean>(false);
  const [hillshadingEnabled, setHillshadingEnabled] = useState<boolean>(true);

  const applyLightingAndShading = () => {
    const Cesium = (window as any).Cesium;
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed() || !Cesium) return;

    const globe = viewer.scene.globe;
    globe.enableLighting = sunlightEnabled;

    if (sunlightEnabled) {
      globe.nightColor = new Cesium.Color(0.25, 0.25, 0.3, 1.0);
      globe.lightingFadeOutDistance = 10000000.0;
      globe.lightingFadeInDistance = 20000000.0;
    }

    globe.showGroundAtmosphere = hillshadingEnabled;
    globe.dynamicAtmosphereLighting = hillshadingEnabled;
    globe.dynamicAtmosphereLightingFromSun = sunlightEnabled && hillshadingEnabled;
  };

  const applyBaseLayer = (mapOption: BaseMapOption) => {
    const Cesium = (window as any).Cesium;
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed() || !Cesium) return;

    viewer.imageryLayers.removeAll(false);

    let provider: any;

    if (mapOption.id === 'usgs_topo') {
      provider = new Cesium.UrlTemplateImageryProvider({
        url: mapOption.url,
        maximumLevel: 16,
      });
    } else if (mapOption.id === 'osm') {
      provider = new Cesium.OpenStreetMapImageryProvider({
        url: 'https://tile.openstreetmap.org/',
        maximumLevel: 18,
      });
    } else {
      provider = new Cesium.UrlTemplateImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maximumLevel: 19,
      });
    }

    attachFallbackErrorHandler(provider);
    viewer.imageryLayers.addImageryProvider(provider, 0);

    // Re-attach active overlays
    overlayLayersRef.current.clear();
    overlays.forEach((overlay) => {
      if (overlay.visible && overlay.url) {
        const overlayProvider = new Cesium.UrlTemplateImageryProvider({
          url: overlay.url,
          maximumLevel: 18,
          hasAlphaChannel: true,
        });
        attachFallbackErrorHandler(overlayProvider);
        const layer = viewer.imageryLayers.addImageryProvider(overlayProvider);
        overlayLayersRef.current.set(overlay.id, layer);
      }
    });
  };

  const updateTerrainState = async (enabled: boolean) => {
    const Cesium = (window as any).Cesium;
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed() || !Cesium) return;

    if (enabled) {
      try {
        const terrainProvider = await createNonIonTerrainProvider(Cesium);
        if (!viewer.isDestroyed() && terrainProvider) {
          viewer.terrainProvider = terrainProvider;
          viewer.scene.globe.depthTestAgainstTerrain = true;
          applyLightingAndShading();
          return;
        }
      } catch (err) {
        console.warn('Terrain initialization failed:', err);
      }
    }

    if (!viewer.isDestroyed()) {
      try {
        if (Cesium.EllipsoidTerrainProvider?.fromEllipsoid) {
          viewer.terrainProvider = await Cesium.EllipsoidTerrainProvider.fromEllipsoid(
            Cesium.Ellipsoid.WGS84
          );
        } else {
          viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        }
      } catch (err) {
        console.warn('Ellipsoid fallback error:', err);
      }

      if (viewer.scene?.globe) {
        viewer.scene.globe.depthTestAgainstTerrain = false;
        viewer.scene.globe.enableLighting = false;
      }
    }
  };

  useEffect(() => {
    const Cesium = (window as any).Cesium;
    if (!Cesium) return;

    const viewer = new Cesium.Viewer('cesiumContainer', {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      baseLayer: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    });

    viewerRef.current = viewer;

    const initialMap = MAP_OPTIONS.find((m) => m.id === 'usgs_topo') || MAP_OPTIONS[0];
    applyBaseLayer(initialMap);
    updateTerrainState(terrainEnabled);

    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-121.7603, 46.8523, 10000),
      orientation: {
        heading: Cesium.Math.toRadians(45),
        pitch: Cesium.Math.toRadians(-20),
        roll: 0,
      },
    });

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    applyLightingAndShading();
  }, [sunlightEnabled, hillshadingEnabled]);

  const handleSelectBaseMap = (id: string) => {
    const selected = MAP_OPTIONS.find((m) => m.id === id);
    if (!selected) return;

    applyBaseLayer(selected);
    setActiveBaseMapId(id);
  };

  const handleToggleOverlay = (id: string) => {
    const Cesium = (window as any).Cesium;
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed() || !Cesium) return;

    setOverlays((prev) =>
      prev.map((overlay) => {
        if (overlay.id !== id) return overlay;

        const nextVisibility = !overlay.visible;

        if (nextVisibility && overlay.url) {
          const provider = new Cesium.UrlTemplateImageryProvider({
            url: overlay.url,
            maximumLevel: 18,
            hasAlphaChannel: true,
          });
          attachFallbackErrorHandler(provider);
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

  const handleToggleTerrain = () => {
    const nextState = !terrainEnabled;
    setTerrainEnabled(nextState);
    updateTerrainState(nextState);
  };

  const handleToggleSunlight = () => setSunlightEnabled((prev) => !prev);
  const handleToggleHillshading = () => setHillshadingEnabled((prev) => !prev);

  const handleTiltChange = (deltaDegrees: number) => {
    const Cesium = (window as any).Cesium;
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed() || !Cesium) return;

    const camera = viewer.camera;
    const currentPitch = Cesium.Math.toDegrees(camera.pitch);
    const newPitch = Math.min(Math.max(currentPitch + deltaDegrees, -90), -5);

    camera.setView({
      orientation: {
        heading: camera.heading,
        pitch: Cesium.Math.toRadians(newPitch),
        roll: camera.roll,
      },
    });
  };

  const handleResetTilt = () => {
    const Cesium = (window as any).Cesium;
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed() || !Cesium) return;

    viewer.camera.setView({
      orientation: {
        heading: viewer.camera.heading,
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0,
      },
    });
  };

  const handleResetNorthNadir = () => {
    const Cesium = (window as any).Cesium;
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed() || !Cesium) return;

    viewer.camera.setView({
      orientation: {
        heading: 0.0,
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0,
      },
    });
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

        <div style={{ flex: 1, position: 'relative', background: '#000000', overflow: 'hidden' }}>
          <LayerPicker
            baseMaps={MAP_OPTIONS}
            activeBaseMapId={activeBaseMapId}
            onSelectBaseMap={handleSelectBaseMap}
            overlays={overlays}
            onToggleOverlay={handleToggleOverlay}
            terrainEnabled={terrainEnabled}
            onToggleTerrain={handleToggleTerrain}
            sunlightEnabled={sunlightEnabled}
            onToggleSunlight={handleToggleSunlight}
            hillshadingEnabled={hillshadingEnabled}
            onToggleHillshading={handleToggleHillshading}
            onTiltChange={handleTiltChange}
            onResetTilt={handleResetTilt}
            onResetNorthNadir={handleResetNorthNadir}
          />

          <div id="cesiumContainer" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

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
          [OK] USGS Topo layer active.
        </div>
      </div>
    </div>
  );
}