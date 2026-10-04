import { useEffect, useRef, useState } from 'react';

export function useCesiumViewer(containerId: string) {
  const viewerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const Cesium = (window as any).Cesium;
    if (!Cesium) return;

    const viewer = new Cesium.Viewer(containerId, {
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
    setIsReady(true);

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [containerId]);

  return { viewer: viewerRef.current, isReady };
}