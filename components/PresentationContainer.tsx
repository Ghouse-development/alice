'use client';

import { ReactNode, useEffect, useState } from 'react';

interface PresentationContainerProps {
  children: ReactNode;
  fullscreen?: boolean;
}

export function PresentationContainer({
  children,
  fullscreen = false,
}: PresentationContainerProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      // A3横サイズ（固定）
      const A3_WIDTH = 1587;
      const A3_HEIGHT = 1123;

      // ビューポートサイズ取得
      const viewportWidth = fullscreen ? window.innerWidth : window.innerWidth * 0.9;
      const viewportHeight = fullscreen ? window.innerHeight : window.innerHeight * 0.85;

      // アスペクト比を維持してスケール計算
      const scaleX = viewportWidth / A3_WIDTH;
      const scaleY = viewportHeight / A3_HEIGHT;
      const newScale = Math.min(scaleX, scaleY, 1); // 最大1倍まで

      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [fullscreen]);

  return (
    <div
      className="presentation-wrapper"
      style={{
        width: '100%',
        height: fullscreen ? '100vh' : '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: fullscreen ? '#000' : 'transparent',
        position: fullscreen ? 'fixed' : 'relative',
        top: fullscreen ? 0 : 'auto',
        left: fullscreen ? 0 : 'auto',
        zIndex: fullscreen ? 9999 : 'auto',
        overflow: 'hidden',
      }}
    >
      <div
        className="presentation-scaler"
        style={{
          width: '1587px',
          height: '1123px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          backgroundColor: 'white',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}
