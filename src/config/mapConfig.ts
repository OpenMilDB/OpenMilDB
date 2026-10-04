import { BaseMapOption, OverlayOption } from '../types/layers';

export const BASE_MAPS: BaseMapOption[] = [
  {
    id: 'blue_marble_nasa',
    name: 'NASA Blue Marble',
    category: 'imagery',
    type: 'urlTemplate',
  },
  {
    id: 'bing_aerial',
    name: 'Bing Maps Aerial',
    category: 'imagery',
    type: 'ion',
    assetId: 2,
  },
  {
    id: 'usgs_topo',
    name: 'USGS Topographic Map',
    category: 'map',
    type: 'urlTemplate',
    url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
  },
  {
    id: 'osm',
    name: 'OpenStreetMap',
    category: 'map',
    type: 'osm',
    url: 'https://tile.openstreetmap.org/',
  },
];

export const DEFAULT_OVERLAYS: OverlayOption[] = [
  {
    id: 'esri_boundaries_places',
    name: 'Borders & Place Names (Esri Reference)',
    type: 'urlTemplate',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    visible: false,
  },
  {
    id: 'esri_transportation',
    name: 'Roads & Transportation (Esri Reference)',
    type: 'urlTemplate',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
    visible: false,
  },
];