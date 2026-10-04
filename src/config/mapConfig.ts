import { BaseMapOption, OverlayOption } from '../types/layers';

export const BASE_MAPS: BaseMapOption[] = [
  {
    id: 'usgs_topo',
    name: 'USGS Topographic Map (Elevation Lines)',
    category: 'map',
    type: 'urlTemplate',
    url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
  },
  {
    id: 'osm',
    name: 'OpenStreetMap (Standard Vector)',
    category: 'map',
    type: 'osm',
    url: 'https://tile.openstreetmap.org/',
  },
  {
    id: 'satellite_composite',
    name: 'Satellite / Aerial Imagery',
    category: 'imagery',
    type: 'urlTemplate',
  },
];

export const DEFAULT_OVERLAYS: OverlayOption[] = [
  {
    id: 'esri_transportation',
    name: 'Esri Roads & Highways Network',
    type: 'urlTemplate',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
    visible: false,
  },
  {
    id: 'esri_boundaries_places',
    name: 'Esri Borders & Place Names',
    type: 'urlTemplate',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    visible: false,
  },
];