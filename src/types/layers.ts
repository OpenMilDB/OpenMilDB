export interface BaseMapOption {
  id: string;
  name: string;
  category: 'map' | 'imagery';
  type: string;
  url?: string;
}

export interface OverlayOption {
  id: string;
  name: string;
  type: string;
  url: string;
  visible: boolean;
}

export interface LayerPickerProps {
  baseMaps: BaseMapOption[];
  activeBaseMapId: string;
  onSelectBaseMap: (id: string) => void;
  overlays: OverlayOption[];
  onToggleOverlay: (id: string) => void;
  terrainEnabled: boolean;
  onToggleTerrain: () => void;
  sunlightEnabled: boolean;
  onToggleSunlight: () => void;
  hillshadingEnabled: boolean;
  onToggleHillshading: () => void;
  onTiltChange: (deltaDegrees: number) => void;
  onResetTilt: () => void;
  onResetNorthNadir: () => void;
}