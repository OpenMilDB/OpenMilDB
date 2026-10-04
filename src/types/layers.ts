export interface BaseMapOption {
  id: string;
  name: string;
  category: 'map' | 'imagery';
  type: 'osm' | 'urlTemplate';
  url?: string;
}

export interface OverlayOption {
  id: string;
  name: string;
  type: 'urlTemplate';
  url: string;
  visible: boolean;
  alpha?: number;
}