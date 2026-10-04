import { useEffect, useRef } from 'react';
import { BASE_MAPS } from '../config/mapConfig';
import { OverlayOption } from '../types/layers';

export function useMapLayers(
  viewer: any,
  isReady: boolean,
  activeBaseMapId: string,
  overlays: OverlayOption[]
) {
  const overlayLayersRef = useRef<Map<string, any>>(new Map());
  const activeRequestIdRef = useRef<number>(0);

  useEffect(() => {
    if (!isReady || !viewer || viewer.isDestroyed()) return;

    const Cesium = (window as any).Cesium;
    if (!Cesium) return;

    const currentRequestId = ++activeRequestIdRef.current;

    // Check runtime config.json first, then fall back to Vite env variables
    const ionToken =
      window.APP_CONFIG?.CESIUM_ION_TOKEN ||
      import.meta.env.VITE_CESIUM_ION_TOKEN ||
      '';

    const cartoApiKey =
      window.APP_CONFIG?.CARTO_API_KEY ||
      import.meta.env.VITE_CARTO_API_KEY ||
      '';

    const mapOption =
      BASE_MAPS.find((m) => m.id === activeBaseMapId) ||
      BASE_MAPS.find((m) => m.id === 'blue_marble_nasa') ||
      BASE_MAPS[0];

    async function applyLayers() {
      let baseProvider: any;

      try {
        if (mapOption.id === 'bing_aerial') {
          if (ionToken) {
            Cesium.Ion.defaultAccessToken = ionToken;
            baseProvider = await Cesium.IonImageryProvider.fromAssetId(2);
          } else {
            baseProvider = new Cesium.UrlTemplateImageryProvider({
              url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg',
              minimumLevel: 0,
              maximumLevel: 8,
            });
          }
        } else if (mapOption.id === 'blue_marble_nasa') {
          baseProvider = new Cesium.UrlTemplateImageryProvider({
            url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg',
            minimumLevel: 0,
            maximumLevel: 8,
          });
        } else if (mapOption.id === 'usgs_topo') {
          baseProvider = new Cesium.UrlTemplateImageryProvider({
            url: mapOption.url,
            maximumLevel: 16,
          });
        } else if (mapOption.id === 'osm') {
          baseProvider = new Cesium.OpenStreetMapImageryProvider({
            url: 'https://tile.openstreetmap.org/',
            maximumLevel: 18,
          });
        }
      } catch (err) {
        console.warn('Failed to load requested base layer, falling back to NASA GIBS:', err);
        baseProvider = new Cesium.UrlTemplateImageryProvider({
          url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg',
          minimumLevel: 0,
          maximumLevel: 8,
        });
      }

      if (currentRequestId !== activeRequestIdRef.current || !viewer || viewer.isDestroyed()) {
        return;
      }

      viewer.imageryLayers.removeAll(false);
      if (baseProvider) {
        viewer.imageryLayers.addImageryProvider(baseProvider, 0);
      }

      overlayLayersRef.current.clear();
      overlays.forEach((overlay) => {
        if (overlay.visible && overlay.url) {
          // Replace tile template subdomain if needed
          let overlayUrl = overlay.url.replace('{s}', 'a');

          // Append API key if required and present
          if (overlay.requiresCartoKey && cartoApiKey) {
            const separator = overlayUrl.includes('?') ? '&' : '?';
            overlayUrl = `${overlayUrl}${separator}api_key=${cartoApiKey}`;
          }

          const overlayProvider = new Cesium.UrlTemplateImageryProvider({
            url: overlayUrl,
            maximumLevel: 18,
            hasAlphaChannel: true,
          });
          const layer = viewer.imageryLayers.addImageryProvider(overlayProvider);
          overlayLayersRef.current.set(overlay.id, layer);
        }
      });
    }

    applyLayers();
  }, [viewer, isReady, activeBaseMapId, overlays]);
}