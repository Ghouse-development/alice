'use client';

import React from 'react';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  noPadding?: boolean;
}

/**
 * PageShell - 全ページ共通のレイアウト基盤
 *
 * 機能:
 * - 横スクロール防止
 * - 中央寄せと最大幅制御
 * - 統一された余白
 * - レスポンシブ対応
 */
export const PageShell: React.FC<PageShellProps> = ({
  children,
  className = '',
  maxWidth = 'xl',
  noPadding = false,
}) => {
  const maxWidthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={`page-shell ${className}`}
      style={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <main
        className={`page-container ${maxWidthClasses[maxWidth]} ${
          noPadding ? '' : 'px-4 sm:px-6 lg:px-8'
        }`}
        style={{
          margin: '0 auto',
          width: '100%',
          maxWidth: maxWidth === 'full' ? '100%' : undefined,
          boxSizing: 'border-box',
        }}
      >
        {/* min-width: 0 を全子要素に適用してFlex/Grid突き破りを防止 */}
        <div style={{ minWidth: 0 }}>{children}</div>
      </main>
    </div>
  );
};

/**
 * SectionContainer - セクション用のコンテナ
 */
export const SectionContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: string;
}> = ({ children, className = '', title }) => {
  return (
    <section className={`section-container ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold mb-4 text-center">
          <span className="border-b-2 border-red-600 pb-1 px-4">{title}</span>
        </h2>
      )}
      <div className="section-content">{children}</div>
    </section>
  );
};

/**
 * Grid3Columns - 3カラムグリッドレイアウト
 */
export const Grid3Columns: React.FC<{
  children: React.ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}> = ({ children, className = '', gap = 'md' }) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div
      className={`grid-3 ${gapClasses[gap]} ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        alignItems: 'start',
      }}
    >
      {React.Children.map(children, (child) => (
        <div style={{ minWidth: 0, minHeight: 0, boxSizing: 'border-box' }}>
          {child}
        </div>
      ))}
    </div>
  );
};

/**
 * ScrollableArea - スクロール可能エリア（画面のみ、印刷時は全量表示）
 */
export const ScrollableArea: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
}> = ({ children, className = '', maxHeight = 'clamp(400px, 60vh, 800px)' }) => {
  return (
    <div
      className={`scroll-y ${className}`}
      style={{
        maxHeight,
        overflowY: 'auto',
        paddingRight: '8px',
      }}
    >
      {children}
    </div>
  );
};

/**
 * Card - カードコンポーネント（overflow:visible で切れ防止）
 */
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}> = ({ children, className = '', noPadding = false }) => {
  return (
    <div
      className={`card ${className} ${noPadding ? '' : 'p-6'}`}
      style={{
        overflow: 'visible',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        background: 'white',
      }}
    >
      {children}
    </div>
  );
};

export default PageShell;