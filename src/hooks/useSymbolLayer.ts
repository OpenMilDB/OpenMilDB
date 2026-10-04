// src/hooks/useSymbolLayer.ts
import { useEffect, useRef } from 'react';
import { createSymbolResource } from '../utils/symbolUtils';

export interface TacticalUnit {
  id: string;
  name: string;
  sidc: string;
  lat: number;
  lon: number;
  elevation?: number;
  higherFormation?: string;
  echelon?: string;
}

const ICON_ALTITUDE_THRESHOLD = 100000;   // 100 km
const DOT_MAX_ALTITUDE_THRESHOLD = 1000000; // 1,000 km

function getAffiliationColor(sidc: string, Cesium: any) {
  const affiliation = sidc.charAt(1)?.toUpperCase() || sidc.charAt(3)?.toUpperCase();
  switch (affiliation) {
    case 'F':
    case 'A':
    case 'D':
    case 'M':
      return Cesium.Color.fromCssColorString('#00aaff'); // Friendly Blue
    case 'H':
    case 'J':
    case 'K':
      return Cesium.Color.fromCssColorString('#ff3333'); // Hostile Red
    case 'N':
    case 'L':
      return Cesium.Color.fromCssColorString('#00dc82'); // Neutral Green
    default:
      return Cesium.Color.fromCssColorString('#ffcc00'); // Unknown Yellow
  }
}

export function useSymbolLayer(
  viewer: any,
  isReady: boolean,
  units: TacticalUnit[]
) {
  const entityCollectionRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!isReady || !viewer || viewer.isDestroyed()) return;

    const Cesium = (window as any).Cesium;
    if (!Cesium) return;

    const currentEntityIds = new Set(units.map((u) => u.id));

    entityCollectionRef.current.forEach((entity, id) => {
      if (!currentEntityIds.has(id)) {
        viewer.entities.remove(entity);
        entityCollectionRef.current.delete(id);
      }
    });

    const currentCameraAlt = viewer.camera.positionCartographic?.height || 0;
    const showIcons = currentCameraAlt < ICON_ALTITUDE_THRESHOLD;
    const showDots =
      currentCameraAlt >= ICON_ALTITUDE_THRESHOLD &&
      currentCameraAlt < DOT_MAX_ALTITUDE_THRESHOLD;

    units.forEach((unit) => {
      const unitElevation = unit.elevation || 0;

      const position = Cesium.Cartesian3.fromDegrees(
        unit.lon,
        unit.lat,
        unitElevation
      );

      const groundPosition = Cesium.Cartesian3.fromDegrees(
        unit.lon,
        unit.lat,
        0
      );

      const { dataUrl, pixelOffset } = createSymbolResource({
        sidc: unit.sidc,
        size: 32,
        uniqueDesignation: unit.name,
        higherFormation: unit.higherFormation,
      });

      const dotColor = getAffiliationColor(unit.sidc, Cesium);
      const isAirUnit = unitElevation > 0;

      let entity = entityCollectionRef.current.get(unit.id);

      if (entity) {
        entity.position = position;
        entity.billboard.image = dataUrl;
        entity.billboard.pixelOffset = new Cesium.Cartesian2(pixelOffset.x, pixelOffset.y);
      } else {
        entity = viewer.entities.add({
          id: unit.id,
          name: unit.name,
          position: position,

          billboard: {
            image: dataUrl,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            pixelOffset: new Cesium.Cartesian2(pixelOffset.x, pixelOffset.y),
            heightReference: Cesium.HeightReference.NONE,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 100000, 0.2),
            show: showIcons,
          },

          point: {
            pixelSize: 8,
            color: dotColor,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1.5,
            heightReference: Cesium.HeightReference.NONE,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            show: showDots,
          },

          label: {
            text: unit.name,
            font: '11px Consolas, monospace',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            pixelOffset: new Cesium.Cartesian2(0, 18),
            heightReference: Cesium.HeightReference.NONE,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 100000, 0.2),
            show: showIcons,
          },

          polyline: isAirUnit
            ? {
                positions: [position, groundPosition],
                width: 1,
                material: new Cesium.PolylineDashMaterialProperty({
                  color: Cesium.Color.YELLOW.withAlpha(0.6),
                  dashLength: 8.0,
                }),
                show: showIcons,
              }
            : undefined,
        });

        entityCollectionRef.current.set(unit.id, entity);
      }
    });

    const updateVisibility = () => {
      if (!viewer || viewer.isDestroyed()) return;
      const cameraAlt = viewer.camera.positionCartographic?.height || 0;

      const shouldShowIcons = cameraAlt < ICON_ALTITUDE_THRESHOLD;
      const shouldShowDots =
        cameraAlt >= ICON_ALTITUDE_THRESHOLD &&
        cameraAlt < DOT_MAX_ALTITUDE_THRESHOLD;

      entityCollectionRef.current.forEach((entity) => {
        if (entity.billboard) entity.billboard.show = shouldShowIcons;
        if (entity.label) entity.label.show = shouldShowIcons;
        if (entity.polyline) entity.polyline.show = shouldShowIcons;
        if (entity.point) entity.point.show = shouldShowDots;
      });
    };

    viewer.camera.percentageChanged = 0.02;
    viewer.camera.changed.addEventListener(updateVisibility);

    updateVisibility();

    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.camera.changed.removeEventListener(updateVisibility);
        entityCollectionRef.current.forEach((entity) => {
          viewer.entities.remove(entity);
        });
      }
      entityCollectionRef.current.clear();
    };
  }, [viewer, isReady, units]);
}