export function getCesiumIonToken(): string {
  return localStorage.getItem('CESIUM_ION_TOKEN') || import.meta.env.VITE_CESIUM_ION_TOKEN || '';
}

export function getCartoApiKey(): string {
  return localStorage.getItem('CARTO_API_KEY') || import.meta.env.VITE_CARTO_API_KEY || '';
}

export function setCesiumIonToken(token: string): void {
  localStorage.setItem('CESIUM_ION_TOKEN', token);
}

export function setCartoApiKey(key: string): void {
  localStorage.setItem('CARTO_API_KEY', key);
}