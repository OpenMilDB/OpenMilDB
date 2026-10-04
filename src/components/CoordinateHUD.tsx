import React, { useState } from 'react';
import { CoordinateData } from '../hooks/useCoordinateTracker';

interface CoordinateHUDProps {
  coords: CoordinateData;
  activeBaseMapName: string;
}

export const CoordinateHUD: React.FC<CoordinateHUDProps> = ({
  coords,
  activeBaseMapName,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const formatDegrees = (val: number | null, positiveDir: string, negativeDir: string) => {
    if (val === null) return '--°--\'--"--';
    const dir = val >= 0 ? positiveDir : negativeDir;
    const abs = Math.abs(val);
    const deg = Math.floor(abs);
    const min = Math.floor((abs - deg) * 60);
    const sec = (((abs - deg) * 60 - min) * 60).toFixed(1);
    return `${deg}°${min.toString().padStart(2, '0')}'${sec.padStart(4, '0')}"${dir}`;
  };

  const formatMeters = (meters: number | null) => {
    if (meters === null) return '-- m';
    return `${meters.toLocaleString()} m`;
  };

  const getElevationColor = (elevation: number | null) => {
    if (elevation === null) return '#888';
    if (elevation < 0) return '#ff4d4d'; // Warning red for sub-sea or negative elevation
    return '#0adb6b'; // Standard green
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        zIndex: 90,
        background: 'rgba(18, 18, 18, 0.65)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(0, 220, 130, 0.3)',
        borderRadius: 4,
        padding: '8px 12px',
        color: '#0adb6b',
        fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
        fontSize: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        minWidth: 280,
        userSelect: 'none',
      }}
    >
      {/* HUD Header Bar & Collapse Toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: isExpanded ? '1px solid rgba(0, 220, 130, 0.2)' : 'none',
          paddingBottom: isExpanded ? 4 : 0,
          marginBottom: isExpanded ? 2 : 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#888', fontSize: 10, letterSpacing: 1 }}>GRID (MGRS)</span>
          <span style={{ color: '#fff', fontWeight: 'bold' }}>{coords.mgrsString}</span>
        </div>
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#0adb6b',
            cursor: 'pointer',
            fontSize: 12,
            padding: '0 2px',
            marginLeft: 12,
            lineHeight: 1,
          }}
          title={isExpanded ? 'Hide HUD Details' : 'Show HUD Details'}
        >
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {/* Collapsible Telemetry & Map Source Readout */}
      {isExpanded && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888', fontSize: 10 }}>SOURCE</span>
            <span style={{ color: '#00bfff', fontWeight: '500' }}>{activeBaseMapName}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888', fontSize: 10 }}>LAT/LON</span>
            <span style={{ color: '#e0e0e0' }}>
              {formatDegrees(coords.lat, 'N', 'S')} {formatDegrees(coords.lon, 'E', 'W')}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888', fontSize: 10 }}>DEC DEG</span>
            <span style={{ color: '#e0e0e0' }}>
              {coords.lat !== null ? coords.lat.toFixed(6) : '--.------'},{' '}
              {coords.lon !== null ? coords.lon.toFixed(6) : '--.------'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: 4,
              marginTop: 2,
            }}
          >
            <div>
              <span style={{ color: '#888', fontSize: 10 }}>ELEV: </span>
              <span
                style={{
                  color: getElevationColor(coords.elevation),
                  fontWeight: coords.elevation && coords.elevation < 0 ? 'bold' : 'normal',
                }}
              >
                {formatMeters(coords.elevation)}
              </span>
            </div>
            <div>
              <span style={{ color: '#888', fontSize: 10 }}>ALT (EYE): </span>
              <span style={{ color: '#00bfff' }}>{formatMeters(coords.cameraAlt)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};