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
      const contentWidth = 1190; // A3横の基準幅(px)
      const contentHeight = 842; // A3横の基準高さ(px)

      if (fullscreen) {
        // For fullscreen, use viewport dimensions directly
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate scale to fill height 100% while maintaining aspect ratio
        const scaleByHeight = viewportHeight / contentHeight;
        const scaledWidth = contentWidth * scaleByHeight;

        // If scaled width exceeds viewport width, scale by width instead
        if (scaledWidth > viewportWidth) {
          const scaleByWidth = viewportWidth / contentWidth;
          setScale(scaleByWidth);
        } else {
          setScale(scaleByHeight);
        }
        return;
      }

      const container = document.querySelector('.presentation-wrapper');
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Calculate scale to fill height 100% while maintaining aspect ratio
      const scaleByHeight = containerHeight / contentHeight;
      const scaledWidth = contentWidth * scaleByHeight;

      // If scaled width exceeds container width, scale by width instead
      if (scaledWidth > containerWidth) {
        const scaleByWidth = containerWidth / contentWidth;
        setScale(scaleByWidth);
      } else {
        setScale(scaleByHeight);
      }
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