'use client';

import { ReactNode, useEffect, useState } from 'react';

interface PresentationContainerProps {
  children: ReactNode;
  fullscreen?: boolean;
}

export function PresentationContainer({ children, fullscreen = false }: PresentationContainerProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (fullscreen) {
        // For fullscreen, use viewport dimensions directly
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const contentWidth = 1190; // A3横の基準幅(px)
        const contentHeight = 842; // A3横の基準高さ(px)

        // A3横 (1.414:1) - scale to fill screen while maintaining aspect ratio
        const aspectRatio = contentWidth / contentHeight; // 1.414:1 for A3 horizontal

        // No padding in fullscreen - fill the entire screen
        const availableWidth = viewportWidth;
        const availableHeight = viewportHeight;

        // Calculate scale to fill either width or height completely while maintaining A3 aspect ratio
        const scaleX = availableWidth / contentWidth;
        const scaleY = availableHeight / contentHeight;
        const newScale = Math.min(scaleX, scaleY); // Fill screen completely while maintaining aspect ratio

        setScale(newScale);
        return;
      }

      const container = document.querySelector('.presentation-wrapper');
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const contentWidth = 1190; // A3横の基準幅(px)
      const contentHeight = 842; // A3横の基準高さ(px)

      // Add padding to ensure content doesn't touch viewport edges
      const paddingX = 16;
      const paddingY = 16;
      const availableWidth = containerWidth - paddingX;
      const availableHeight = containerHeight - paddingY;

      const scaleX = availableWidth / contentWidth;
      const scaleY = availableHeight / contentHeight;
      const newScale = Math.min(scaleX, scaleY, 0.95);

      setScale(newScale);
    };

    // Delay initial calculation to ensure DOM is ready
    setTimeout(calculateScale, 100);
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [fullscreen]);

  return (
    <div
      className={`presentation-wrapper ${fullscreen ? 'w-screen h-screen bg-black' : 'w-full h-full bg-white'} overflow-hidden`}
      style={fullscreen ? {
        width: '100vw',
        height: '100vh',
        maxWidth: 'none',
        maxHeight: 'none',
        margin: 0,
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black'
      } : {
        width: '100%',
        height: '100%',
        aspectRatio: '1.414 / 1', // A3横サイズ比率
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: '1190px',
          height: '842px',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {children}
      </div>
    </div>
  );
}