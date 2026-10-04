// src/hooks/useCoordinateTracker.ts
import { useState, useEffect } from 'react';
import * as mgrsModule from 'mgrs';

export interface CoordinateData {
  lat: number | null;
  lon: number | null;
  elevation: number | null;
  cameraAlt: number | null;
  mgrsString: string;
}

// Maximum eye altitude (in meters) before terrain elevation sampling turns on
const ELEVATION_MIN_CAMERA_ALT = 100000; // 100 km (~ Level 10 zoom)

export function useCoordinateTracker(viewer: any, isReady: boolean): CoordinateData {
  const [coords, setCoords] = useState<CoordinateData>({
    lat: null,
    lon: null,
    elevation: null,
    cameraAlt: null,
    mgrsString: 'OFF GLOBE',
  });

  useEffect(() => {
    if (!isReady || !viewer || viewer.isDestroyed()) return;

    const Cesium = (window as any).Cesium;
    if (!Cesium) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((movement: { endPosition: any }) => {
      const ray = viewer.camera.getPickRay(movement.endPosition);
      if (!ray) return;

      const cartesian = viewer.scene.globe.pick(ray, viewer.scene);

      const cameraCartographic = viewer.camera.positionCartographic;
      const cameraAlt = cameraCartographic ? Math.round(cameraCartographic.height) : null;

      if (cartesian) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        const lon = Cesium.Math.toDegrees(cartographic.longitude);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);

        let elevation: number | null = null;

        // Only query terrain elevation when zoomed in close enough (< 100km eye altitude)
        if (cameraAlt !== null && cameraAlt < ELEVATION_MIN_CAMERA_ALT) {
          const sampledHeight = viewer.scene.globe.getHeight(cartographic);

          if (sampledHeight !== undefined) {
            const rawElevation = Math.round(sampledHeight);

            // Filter out ray-miss glitches and minor ellipsoidal noise on inland terrain
            if (rawElevation >= -10500 && rawElevation <= 9000) {
              if (rawElevation < 0 && rawElevation > -120) {
                elevation = 0;
              } else {
                elevation = rawElevation;
              }
            }
          }
        }
        // When cameraAlt >= 100km, elevation remains null, rendering '-- m' in the HUD

        let mgrsFormatted = 'N/A';
        try {
          const mgrsFn = (mgrsModule as any).default?.forward || (mgrsModule as any).forward;
          if (typeof mgrsFn === 'function') {
            const rawMgrs = mgrsFn([lon, lat], 5);
            mgrsFormatted = `${rawMgrs.substring(0, 3)} ${rawMgrs.substring(3, 5)} ${rawMgrs.substring(5, 10)} ${rawMgrs.substring(10)}`;
          }
        } catch {
          mgrsFormatted = 'OUT OF BOUNDS';
        }

        setCoords({
          lat,
          lon,
          elevation,
          cameraAlt,
          mgrsString: mgrsFormatted,
        });
      } else {
        setCoords({
          lat: null,
          lon: null,
          elevation: null,
          cameraAlt,
          mgrsString: 'OFF GLOBE',
        });
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    return () => {
      if (!handler.isDestroyed()) {
        handler.destroy();
      }
    };
  }, [viewer, isReady]);

  return coords;
}