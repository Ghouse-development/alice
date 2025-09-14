'use client';

import { ReactNode } from 'react';

interface PresentationContainerProps {
  children: ReactNode;
  fullscreen?: boolean;
}

export function PresentationContainer({ children, fullscreen = false }: PresentationContainerProps) {
  return (
    <div
      className="w-full h-full bg-white overflow-hidden"
      style={fullscreen ? {
        width: '100%',
        height: '100%'
      } : {
        width: '100%',
        height: '100%',
        aspectRatio: '1.414 / 1' // A3横サイズ比率
      }}
    >
      {children}
    </div>
  );
}