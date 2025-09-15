'use client';

import React from 'react';

interface A3SlideLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A3SlideLayout - A3横向き印刷用の再利用可能テンプレート
 * 420mm × 297mm に最適化、重なり防止、中央配置
 */
export default function A3SlideLayout({ children, className = '' }: A3SlideLayoutProps) {
  return (
    <div className={`a3-sheet ${className}`}>
      <div className="a3-canvas">
        {children}
      </div>
    </div>
  );
}

// サブコンポーネント：ヘッダー
export const A3Header: React.FC<{
  title: string;
  subtitle?: { left?: string; right?: string };
  className?: string;
}> = ({ title, subtitle, className = '' }) => {
  return (
    <header className={`a3-header col-span-3 ${className}`}>
      <h1 className="a3-title">{title}</h1>
      {subtitle && (
        <div className="a3-subtitle-row">
          {subtitle.left && (
            <h2 className="a3-subtitle left">{subtitle.left}</h2>
          )}
          {subtitle.right && (
            <h2 className="a3-subtitle right">{subtitle.right}</h2>
          )}
        </div>
      )}
    </header>
  );
};

// サブコンポーネント：フッター（合計パネル用）
export const A3Footer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <footer className={`a3-footer col-span-3 ${className}`}>
      {children}
    </footer>
  );
};

// サブコンポーネント：カラム
export const A3Column: React.FC<{
  children: React.ReactNode;
  span?: 1 | 2 | 3;
  className?: string;
}> = ({ children, span = 1, className = '' }) => {
  return (
    <section className={`a3-column col-span-${span} ${className}`}>
      {children}
    </section>
  );
};