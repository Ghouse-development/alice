'use client';

import React, { useEffect, useRef, useState } from 'react';
import '../styles/a3-print.css';

interface A3PrintContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: string;
  className?: string;
  autoScale?: boolean;
}

export const A3PrintContainer: React.FC<A3PrintContainerProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  autoScale = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!autoScale || !containerRef.current || !wrapperRef.current) return;

    const calculateScale = () => {
      const wrapper = wrapperRef.current;
      const container = containerRef.current;

      if (!wrapper || !container) return;

      // A3サイズ（96dpi）
      const a3Width = 1587;
      const a3Height = 1123;

      // 利用可能な幅（パディング考慮）
      const availableWidth = wrapper.clientWidth - 40;
      const availableHeight = window.innerHeight - 100;

      // スケール計算
      const scaleX = availableWidth / a3Width;
      const scaleY = availableHeight / a3Height;
      const newScale = Math.min(scaleX, scaleY, 1);

      setScale(newScale);

      // カスタムプロパティでスケール値を設定
      container.style.setProperty('--scale-factor', newScale.toString());
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [autoScale]);

  // PDF出力用関数
  const handlePrint = () => {
    window.print();
  };

  // PDF出力（動的インポート使用）
  const handleExportPDF = async () => {
    if (containerRef.current) {
      try {
        const { exportA3LandscapePDF } = await import('@/lib/pdf-export-client');
        const filename = `${title?.replace(/\s+/g, '_') || 'document'}_${new Date().toISOString().split('T')[0]}.pdf`;
        await exportA3LandscapePDF(containerRef.current, filename);
      } catch (error) {
        console.error('PDF export failed:', error);
        // フォールバック：ブラウザの印刷機能を使用
        handlePrint();
      }
    }
  };

  return (
    <>
      {/* 印刷ボタン（画面表示時のみ） */}
      <div className="no-print" style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px'
      }}>
        <button
          onClick={handlePrint}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
        >
          印刷
        </button>

        <button
          onClick={handleExportPDF}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          PDF出力
        </button>

        <button
          onClick={() => {
            if (containerRef.current) {
              containerRef.current.style.setProperty('--scale-factor', '1');
              setScale(1);
            }
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          実寸表示
        </button>

        <button
          onClick={() => {
            const wrapper = wrapperRef.current;
            const container = containerRef.current;
            if (!wrapper || !container) return;

            const availableWidth = wrapper.clientWidth - 40;
            const scaleX = availableWidth / 1587;
            const newScale = Math.min(scaleX, 1);

            setScale(newScale);
            container.style.setProperty('--scale-factor', newScale.toString());
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          画面幅に合わせる
        </button>
      </div>

      {/* スケール表示 */}
      {autoScale && (
        <div className="no-print" style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '14px',
          zIndex: 1000,
        }}>
          表示倍率: {Math.round(scale * 100)}%
        </div>
      )}

      {/* A3印刷コンテナ */}
      <div className="a3-print-wrapper" ref={wrapperRef}>
        <div
          ref={containerRef}
          className={`a3-print-container a3-print-scale ${className}`}
        >
          <div className="a3-content">
            {/* ヘッダー */}
            {(title || subtitle) && (
              <div className="a3-header">
                <div>
                  {title && <h1 className="a3-title">{title}</h1>}
                  {subtitle && <p className="a3-subtitle">{subtitle}</p>}
                </div>
              </div>
            )}

            {/* メインコンテンツ */}
            <div className="a3-main">
              {children}
            </div>

            {/* フッター */}
            {footer && (
              <div className="a3-footer">
                <span>{footer}</span>
                <span>{new Date().toLocaleDateString('ja-JP')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// レイアウトコンポーネント
export const A3TwoColumn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="a3-two-column">{children}</div>
);

export const A3ThreeColumn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="a3-three-column">{children}</div>
);

export const A3Section: React.FC<{
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = '' }) => (
  <div className={`a3-section ${className}`}>
    {title && <h2 className="a3-section-title">{title}</h2>}
    {children}
  </div>
);

export const A3Card: React.FC<{
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = '' }) => (
  <div className={`a3-card ${className}`}>
    {title && <div className="a3-card-header">{title}</div>}
    <div className="a3-card-body">{children}</div>
  </div>
);

// テーブルコンポーネント
export const A3Table: React.FC<{
  headers: string[];
  data: (string | number)[][];
  className?: string;
}> = ({ headers, data, className = '' }) => (
  <table className={`a3-table ${className}`}>
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th key={index}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

// グリッドレイアウト
export const A3Grid: React.FC<{
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}> = ({ columns = 2, children, className = '' }) => (
  <div className={`a3-grid a3-grid-${columns} ${className}`}>
    {children}
  </div>
);

export default A3PrintContainer;