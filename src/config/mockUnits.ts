// src/config/mockUnits.ts
import { TacticalUnit } from '../hooks/useSymbolLayer';

export const INITIAL_TACTICAL_UNITS: TacticalUnit[] = [
  {
    id: 'unit-01',
    name: '1-12 IN',
    sidc: 'SFGPUCI---*****', // Friendly Infantry Battalion
    lat: 38.8977,
    lon: -77.0365,
    elevation: 0,
    higherFormation: '4 BCT',
  },
  {
    id: 'unit-02',
    name: '2-70 AR',
    sidc: 'SFGPUCA---*****', // Friendly Armor Battalion
    lat: 38.9072,
    lon: -77.0369,
    elevation: 0,
    higherFormation: '1 ABCT',
  },
  {
    id: 'unit-03',
    name: 'OPFOR OP-1',
    sidc: 'SHGPUCI---*****', // Hostile Infantry Unit
    lat: 38.915,
    lon: -77.012,
    elevation: 0,
    higherFormation: '80 MSR',
  },
  {
    id: 'unit-04',
    name: 'UN MEDEVAC',
    sidc: 'SNGPUUM-----***', // Neutral Medical Unit
    lat: 38.885,
    lon: -77.05,
    elevation: 0,
  },
  {
    id: 'unit-05',
    name: 'DUSTOFF 21',
    sidc: 'SFAPMH------*****', // Friendly Rotary Wing Helicopter
    lat: 38.892,
    lon: -77.025,
    elevation: 1200, // 1,200m MSL
    higherFormation: '10 CAB',
  },
];