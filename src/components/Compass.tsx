import React, { useEffect, useState } from 'react';

interface CompassProps {
  viewer: any;
  onResetNorth: () => void;
}

export const Compass: React.FC<CompassProps> = ({ viewer, onResetNorth }) => {
  const [headingDegrees, setHeadingDegrees] = useState<number>(0);
  const [pitchDegrees, setPitchDegrees] = useState<number>(-90);

  useEffect(() => {
    if (!viewer) return;

    const updateOrientation = () => {
      if (viewer.isDestroyed()) return;
      const camera = viewer.camera;
      
      const heading = (camera.heading * 180) / Math.PI;
      const pitch = (camera.pitch * 180) / Math.PI;

      setHeadingDegrees(heading);
      setPitchDegrees(pitch);
    };

    const removeListener = viewer.scene.postRender.addEventListener(updateOrientation);
    updateOrientation();

    return () => {
      if (removeListener) removeListener();
    };
  }, [viewer]);

  return (
    <div
      onClick={onResetNorth}
      title="Click to Reset North"
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        backgroundColor: 'rgba(26, 26, 26, 0.85)',
        border: '1px solid #444444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 100 100"
        style={{
          transform: `rotate(${-headingDegrees}deg)`,
          transformOrigin: 'center center',
          transition: 'transform 0.05s linear',
        }}
      >
        <circle cx="50" cy="50" r="45" stroke="#666" strokeWidth="3" fill="none" />
        <polygon points="50,12 60,50 50,44" fill="#ff4d4d" />
        <polygon points="50,12 40,50 50,44" fill="#d63030" />
        <polygon points="50,88 60,50 50,56" fill="#cccccc" />
        <polygon points="50,88 40,50 50,56" fill="#888888" />
        <circle cx="50" cy="50" r="4" fill="#ffffff" />
        <text x="50" y="28" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
          N
        </text>
      </svg>
      <div
        style={{
          position: 'absolute',
          bottom: '-18px',
          fontSize: '10px',
          fontFamily: 'monospace',
          color: '#aaa',
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: '1px 4px',
          borderRadius: '3px',
        }}
      >
        {Math.round(pitchDegrees)}°
      </div>
    </div>
  );
};