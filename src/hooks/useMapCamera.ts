import { useCallback } from 'react';

export function useMapCamera(viewer: any) {
  const adjustTilt = useCallback((deltaDegrees: number) => {
    const Cesium = (window as any).Cesium;
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
  }, [viewer]);

  const resetTilt = useCallback(() => {
    const Cesium = (window as any).Cesium;
    if (!viewer || viewer.isDestroyed() || !Cesium) return;

    viewer.camera.setView({
      orientation: {
        heading: viewer.camera.heading,
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0,
      },
    });
  }, [viewer]);

  const resetNorthNadir = useCallback(() => {
    const Cesium = (window as any).Cesium;
    if (!viewer || viewer.isDestroyed() || !Cesium) return;

    viewer.camera.setView({
      orientation: {
        heading: 0.0,
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0,
      },
    });
  }, [viewer]);

  return { adjustTilt, resetTilt, resetNorthNadir };
}