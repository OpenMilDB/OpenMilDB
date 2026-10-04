import { useEffect, useRef } from 'react';
import { BASE_MAPS } from '../config/mapConfig';
import { BaseMapOption, OverlayOption } from '../types/layers';

export function useMapLayers(
  viewer: any,
  isReady: boolean,
  activeBaseMapId: string,
  overlays: OverlayOption[]
) {
  const overlayLayersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!isReady || !viewer || viewer.isDestroyed()) return;

    const Cesium = (window as any).Cesium;
    if (!Cesium) return;

    // Find active basemap configuration
    const mapOption = BASE_MAPS.find((m) => m.id === activeBaseMapId) || BASE_MAPS[0];

    // Clear existing base layer
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

    // Add base layer at index 0
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
        const layer = viewer.imageryLayers.addImageryProvider(overlayProvider);
        overlayLayersRef.current.set(overlay.id, layer);
      }
    });
  }, [viewer, isReady, activeBaseMapId, overlays]);
}