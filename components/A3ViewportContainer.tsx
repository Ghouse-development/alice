'use client';

import React, { useEffect, useRef, useState } from 'react';
import '../styles/a3-viewport.css';

interface A3ViewportContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: string;
  className?: string;
}

export const A3ViewportContainer: React.FC<A3ViewportContainerProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
}) => {
  const zoomWrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isAutoFit, setIsAutoFit] = useState(false);

  // 実寸表示：ズーム解除
  const showActualSize = () => {
    if (zoomWrapRef.current) {
      zoomWrapRef.current.style.transform = 'none';
      setScale(1);
      setIsAutoFit(false);
    }
  };

  // 画面幅に合わせる：ページ全体をウィンドウ内にフィット
  const fitToScreen = () => {
    if (!zoomWrapRef.current) return;

    const page = zoomWrapRef.current.querySelector('.page-a3');
    if (!page) return;

    const vw = window.innerWidth - 48; // viewport padding 分を控除
    const vh = window.innerHeight - 48;

    // mm to px conversion (96dpi)
    const pageWidthPx = 1587; // 420mm
    const pageHeightPx = 1123; // 297mm

    const scaleX = vw / pageWidthPx;
    const scaleY = vh / pageHeightPx;
    const newScale = Math.min(scaleX, scaleY, 1);

    zoomWrapRef.current.style.transform = `scale(${newScale})`;
    setScale(newScale);
    setIsAutoFit(true);
  };

  // ウィンドウリサイズ時の処理
  useEffect(() => {
    const handleResize = () => {
      if (isAutoFit) {
        fitToScreen();
      }
    };

    // 初期表示時に画面幅に合わせる
    fitToScreen();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isAutoFit]);

  // 印刷処理
  const handlePrint = () => {
    window.print();
  };

  // PDF出力
  const handleExportPDF = async () => {
    const page = zoomWrapRef.current?.querySelector('.page-a3');
    if (page) {
      try {
        const { exportA3LandscapePDF } = await import('@/lib/pdf-export-client');
        const filename = `${title?.replace(/\s+/g, '_') || 'document'}_${new Date().toISOString().split('T')[0]}.pdf`;
        await exportA3LandscapePDF(page as HTMLElement, filename);
      } catch (error) {
        console.error('PDF export failed:', error);
        handlePrint(); // フォールバック
      }
    }
  };

  return (
    <>
      {/* ツールバー（印刷時非表示） */}
      <div className="page-toolbar no-print">
        <button className="btn-print" onClick={handlePrint}>
          印刷
        </button>
        <button className="btn-pdf" onClick={handleExportPDF}>
          PDF出力
        </button>
        <button className="btn-actual" onClick={showActualSize}>
          実寸表示
        </button>
        <button className="btn-fit" onClick={fitToScreen}>
          画面幅に合わせる
        </button>
      </div>

      {/* スケール表示（印刷時非表示） */}
      <div className="scale-indicator no-print">表示倍率: {Math.round(scale * 100)}%</div>

      {/* ビューポート */}
      <div className={`viewport no-print-bg ${className}`}>
        <div className="zoom-wrap" ref={zoomWrapRef}>
          <section className="page-a3">
            <div className="safe">
              {/* ヘッダー */}
              {(title || subtitle) && (
                <div className="page-header">
                  <div className="page-header-content">
                    <div className="page-header-brand">
                      <div className="page-header-logo">
                        <span className="page-header-logo-text">G-HOUSE</span>
                        <span className="page-header-logo-sub">プレゼンテーション</span>
                      </div>
                      <div className="page-header-divider" />
                      <div>
                        {title && <h1 className="page-header-title">{title}</h1>}
                        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* メインコンテンツ */}
              <div className="page-content">
                <div className="page-content-inner">{children}</div>
              </div>

              {/* フッター */}
              {footer !== undefined && (
                <div className="page-footer">
                  <span>{footer || '© G-HOUSE'}</span>
                  <span>{new Date().toLocaleDateString('ja-JP')}</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

// グリッドレイアウトコンポーネント
export const A3Grid: React.FC<{
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}> = ({ columns = 2, children, className = '' }) => (
  <div className={`content-grid content-grid-${columns} ${className}`}>{children}</div>
);

// カードコンポーネント
export const A3Card: React.FC<{
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = '' }) => (
  <div className={`content-card ${className}`}>
    {title && <div className="content-card-title">{title}</div>}
    <div className="content-card-body">{children}</div>
  </div>
);

export default A3ViewportContainer;
