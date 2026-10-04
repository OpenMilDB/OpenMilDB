import * as Cesium from 'cesium';
import { OverlayOption } from '../types/layers';

export function addTransparentOverlay(
  viewer: Cesium.Viewer,
  overlay: OverlayOption
): Cesium.ImageryLayer | null {
  if (!viewer || !overlay.url) return null;

  const provider = new Cesium.UrlTemplateImageryProvider({
    url: overlay.url,
    maximumLevel: 19,
    hasAlphaChannel: true, // Guarantees proper PNG transparency blending over terrain/imagery
  });

  const layer = viewer.imageryLayers.addImageryProvider(provider);
  layer.alpha = overlay.alpha ?? 1.0;

  return layer;
}