import { useEffect, useRef, useState } from 'react';

export function configureCameraControls(viewer: any, Cesium: any) {
  if (!viewer || !Cesium) return;

  const controller = viewer.scene.screenSpaceCameraController;

  // 1. Unbind RIGHT_DRAG from Zoom (Zoom stays on Mouse Wheel & Pinch)
  controller.zoomEventTypes = [
    Cesium.CameraEventType.WHEEL,
    Cesium.CameraEventType.PINCH,
  ];

  // 2. Map RIGHT_DRAG to Tilt & Pitch
  controller.tiltEventTypes = [
    Cesium.CameraEventType.RIGHT_DRAG,
    Cesium.CameraEventType.PINCH,
    {
      eventType: Cesium.CameraEventType.RIGHT_DRAG,
      modifier: Cesium.KeyboardEventModifier.CTRL,
    },
  ];

  // 3. Map RIGHT_DRAG & LEFT_DRAG to Rotate / Orbit / Pan
  controller.rotateEventTypes = [
    Cesium.CameraEventType.RIGHT_DRAG,
    Cesium.CameraEventType.LEFT_DRAG,
  ];

  // 4. Suppress context menu on right-click to prevent Electron/Browser popups while dragging
  const container = viewer.container as HTMLElement;
  if (container) {
    container.addEventListener('contextmenu', (e) => e.preventDefault());
  }
}

export function useCesiumViewer(containerId: string) {
  const viewerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const Cesium = (window as any).Cesium;
    if (!Cesium) return;

    // Assign Ion access token before instantiating viewer
    const token = import.meta.env.VITE_CESIUM_ION_TOKEN;
    if (token) {
      Cesium.Ion.defaultAccessToken = token;
    }

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

    // Remap camera inputs to GIS/tactical controls
    configureCameraControls(viewer, Cesium);

    viewerRef.current = viewer;
    setIsReady(true);

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
      setIsReady(false);
    };
  }, [containerId]);

  return { viewer: viewerRef.current, isReady };
}