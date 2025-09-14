'use client';

import React from 'react';

interface A3ContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A3横サイズ（420mm × 297mm）のコンテナ
 * アスペクト比: 1.414:1
 */
export function A3Container({ children, className = '' }: A3ContainerProps) {
  return (
    <div
      className={`w-full h-full bg-white ${className}`}
      style={{
        aspectRatio: '1.414 / 1',
        maxWidth: '1190px', // A3横のピクセル換算（約420mm）
        maxHeight: '842px', // A3縦のピクセル換算（約297mm）
        margin: '0 auto',
      }}
    >
      <div className="w-full h-full relative overflow-hidden">
        {children}
      </div>
    </div>
  );
}