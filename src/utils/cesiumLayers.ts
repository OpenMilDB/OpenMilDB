export function attachFallbackErrorHandler(provider: any) {
  if (provider && provider.errorEvent) {
    provider.errorEvent.addEventListener((error: any) => {
      // Suppress tile load errors from breaking viewer loop
      if (error && typeof error === 'object') {
        error.retry = false;
      }
    });
  }
}

export function createBlankTileDiscardPolicy() {
  return {
    isReady: () => true,
    shouldDiscardImage: () => false,
  };
}

/**
 * Robust Terrain Provider Loader
 * Tries Cesium World Terrain (Ion Asset 1), then falls back to Ellipsoid if network/token fails.
 */
export async function createNonIonTerrainProvider(Cesium: any): Promise<any> {
  // Option 1: Cesium World Terrain via Ion Asset ID 1
  try {
    if (Cesium.CesiumTerrainProvider?.fromIonAssetId) {
      return await Cesium.CesiumTerrainProvider.fromIonAssetId(1, {
        requestWaterMask: true,
        requestVertexNormals: true,
      });
    }
    if (typeof Cesium.createWorldTerrain === 'function') {
      return Cesium.createWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true,
      });
    }
  } catch (err) {
    console.warn('World Terrain load failed, falling back to Ellipsoid:', err);
  }

  // Option 2: Fallback to Ellipsoid (Flat Globe) without throwing errors
  try {
    if (Cesium.EllipsoidTerrainProvider?.fromEllipsoid) {
      return await Cesium.EllipsoidTerrainProvider.fromEllipsoid(Cesium.Ellipsoid.WGS84);
    }
  } catch (err) {
    console.warn('Ellipsoid terrain initialization error:', err);
  }

  return new Cesium.EllipsoidTerrainProvider();
}