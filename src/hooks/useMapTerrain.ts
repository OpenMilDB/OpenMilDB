import { useEffect } from 'react';
import { createNonIonTerrainProvider } from '../utils/cesiumLayers';

export function useMapTerrain(
  viewer: any,
  isReady: boolean,
  terrainEnabled: boolean,
  sunlightEnabled: boolean,
  hillshadingEnabled: boolean
) {
  useEffect(() => {
    if (!isReady || !viewer || viewer.isDestroyed()) return;

    const Cesium = (window as any).Cesium;
    if (!Cesium) return;

    const updateTerrainAndLighting = async () => {
      const globe = viewer.scene.globe;

      if (terrainEnabled) {
        try {
          const terrainProvider = await createNonIonTerrainProvider(Cesium);
          if (!viewer.isDestroyed() && terrainProvider) {
            viewer.terrainProvider = terrainProvider;
            globe.depthTestAgainstTerrain = true;

            // Apply lighting & atmosphere when terrain is ACTIVE
            globe.enableLighting = sunlightEnabled;
            globe.showGroundAtmosphere = hillshadingEnabled;
            globe.dynamicAtmosphereLighting = hillshadingEnabled;
            globe.dynamicAtmosphereLightingFromSun = sunlightEnabled && hillshadingEnabled;
            return;
          }
        } catch (err) {
          console.warn('Terrain initialization failed:', err);
        }
      }

      // Fallback: Disable 3D terrain and reset lighting flags
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

        globe.depthTestAgainstTerrain = false;
        globe.enableLighting = false;
        globe.showGroundAtmosphere = false;
      }
    };

    updateTerrainAndLighting();
  }, [viewer, isReady, terrainEnabled, sunlightEnabled, hillshadingEnabled]);
}