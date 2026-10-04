import * as Cesium from 'cesium';

/**
 * Creates a tile discard policy that drops blank 1x1 pixel placeholder tiles.
 */
export function createBlankTileDiscardPolicy() {
  return {
    isReady: () => true,
    shouldDiscardImage: (image: HTMLImageElement | ImageBitmap) => {
      return image.width === 1 && image.height === 1;
    },
  };
}

/**
 * Catches tile loading errors (404/500/CORS) silently so 
 * missing high-res tiles reveal the base layer beneath.
 */
export function attachFallbackErrorHandler(provider: Cesium.ImageryProvider) {
  if (!provider || !provider.errorEvent) return;

  provider.errorEvent.addEventListener((error: any) => {
    error.retry = false;
    error.ignore = true;
  });
}