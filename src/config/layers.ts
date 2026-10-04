export interface BaseMapOption {
  id: string;
  name: string;
  category: 'imagery' | 'map';
  type: 'urlTemplate' | 'ion' | 'osm';
  url?: string;
  assetId?: number;
}

export interface OverlayOption {
  id: string;
  name: string;
  type: 'urlTemplate';
  url: string;
  visible: boolean;
  requiresCartoKey?: boolean;
}