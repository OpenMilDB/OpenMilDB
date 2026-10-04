import * as Cesium from 'cesium';

/**
 * Loads a local or remote CZML file into the Cesium viewer.
 */
export async function loadCzmlBorders(
  viewer: Cesium.Viewer,
  czmlSource: string | object
): Promise<Cesium.CzmlDataSource> {
  try {
    const dataSource = await Cesium.CzmlDataSource.load(czmlSource);
    await viewer.dataSources.add(dataSource);
    return dataSource;
  } catch (error) {
    console.error('Failed to load CZML borders:', error);
    throw error;
  }
}