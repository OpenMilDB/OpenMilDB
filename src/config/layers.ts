import { BaseMapOption, OverlayOption } from '../types/layers';

export const BASE_MAPS: BaseMapOption[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap (Vector Map)',
    category: 'map',
    type: 'osm',
    url: 'https://tile.openstreetmap.org/',
  },
  {
    id: 'satellite_composite',
    name: 'Satellite / Aerial (ArcGIS + USGS NAIP High-Res)',
    category: 'imagery',
    type: 'urlTemplate',
  },
];

export const INITIAL_OVERLAYS: OverlayOption[] = [
  {
    id: 'esri_transportation',
    name: 'Esri Roads & Highways Network (Transparent)',
    type: 'urlTemplate',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
    visible: true,
  },
  {
    id: 'esri_boundaries_places',
    name: 'Esri Borders & Place Names',
    type: 'urlTemplate',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    visible: true,
  },
];