export interface BaseMapOption {
  id: string;
  name: string;
  category: 'map' | 'imagery';
  type: 'osm' | 'urlTemplate' | 'usgs_wms';
  url?: string;
  layerName?: string;
}

export interface OverlayOption {
  id: string;
  name: string;
  type: 'urlTemplate' | 'wms';
  url: string;
  layers?: string;
  visible: boolean;
}