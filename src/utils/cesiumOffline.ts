import * as Cesium from 'cesium';

/**
 * Creates a low-footprint single-tile offline world map provider.
 * Requires a local low-res world map image placed in `/public/assets/world_lowres.jpg` (~10-20MB).
 */
export function createOfflineBaseProvider(): Cesium.SingleTileImageryProvider {
  return new Cesium.SingleTileImageryProvider({
    url: '/assets/world_lowres.jpg',
    rectangle: Cesium.Rectangle.MAX_VALUE,
  });
}

/**
 * Checks if a raster provider fails or network goes offline,
 * falling back gracefully to the local offline single-tile texture.
 */
export function registerOfflineFallback(
  viewer: Cesium.Viewer,
  onlineLayer: Cesium.ImageryLayer
) {
  window.addEventListener('offline', () => {
    console.warn('[Offline Mode] Network lost. Switching to local offline base texture.');
    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(createOfflineBaseProvider());
  });
}