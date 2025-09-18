'use client';

import React, { useEffect, useRef, useState } from 'react';

interface A3PageProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showFooter?: boolean;
  className?: string;
}

// 全スライドの親コンポーネント - 指示書v2準拠
export default function A3Page({
  children,
  title,
  subtitle,
  showFooter = true,
  className = '',
}: A3PageProps) {
  const zoomWrapRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);
  const [isAutoFit, setIsAutoFit] = useState(false);
  const [isInsideContainer, setIsInsideContainer] = useState(false);

  // PresentationContainer内にいるかチェック
  useEffect(() => {
    const checkContainer = () => {
      const container = document.querySelector('.presentation-wrapper');
      setIsInsideContainer(!!container);
    };
    checkContainer();
  }, []);

  // 実寸表示（指示書v2のshowActualSize()）
  const showActualSize = () => {
    if (isInsideContainer) return; // PresentationContainer内では無効化
    document.querySelectorAll('.zoom-wrap').forEach((w) => {
      (w as HTMLElement).style.transform = 'none';
    });
    setScale(1);
    setIsAutoFit(false);
  };

  // 画面フィット（指示書v2のfitToScreen()）
  const fitToScreen = () => {
    if (isInsideContainer) return; // PresentationContainer内では無効化
    const page = document.querySelector('.page-a3') as HTMLElement;
    const wrap = document.querySelector('.zoom-wrap') as HTMLElement;
    if (!page || !wrap) return;

    const vw = window.innerWidth - 48;
    const vh = window.innerHeight - 48;
    const scale = Math.min(vw / page.offsetWidth, vh / page.offsetHeight);
    wrap.style.transform = `scale(${scale})`;
    setScale(scale);
    setIsAutoFit(true);
  };

  // ウィンドウリサイズ時の処理（指示書v2準拠）
  useEffect(() => {
    if (isInsideContainer) {
      // PresentationContainer内の場合はスケーリングを無効化
      const wrap = zoomWrapRef.current;
      if (wrap) {
        wrap.style.transform = 'none';
      }
      return;
    }

    const handleResize = () => {
      const wrap = document.querySelector('.zoom-wrap') as HTMLElement;
      if (wrap?.style.transform.startsWith('scale')) {
        fitToScreen();
      }
    };

    // 初期表示時に画面幅に合わせる
    fitToScreen();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isInsideContainer]);

  // 印刷処理
  const handlePrint = () => {
    window.print();
  };

  // PDF出力
  const handleExportPDF = async () => {
    if (pageRef.current) {
      try {
        const { exportA3LandscapePDF } = await import('@/lib/pdf-export-client');
        const filename = `${title?.replace(/\s+/g, '_') || 'document'}_${new Date().toISOString().split('T')[0]}.pdf`;
        await exportA3LandscapePDF(pageRef.current, filename);
      } catch (error) {
        console.error('PDF export failed:', error);
        handlePrint(); // フォールバック
      }
    }
  };

  return (
    <>
      {/* ツールバー（印刷時非表示、PresentationContainer内では非表示） */}
      {!isInsideContainer && (
        <div className="toolbar no-print">
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
      )}

      {/* スケール表示（印刷時非表示、PresentationContainer内では非表示） */}
      {!isInsideContainer && (
        <div className="scale-indicator no-print">表示倍率: {Math.round(scale * 100)}%</div>
      )}

      {/* 指示書v2準拠: viewport → zoom-wrap → page-a3 → safe */}
      <div className={`viewport no-print-bg ${className}`}>
        <div className="zoom-wrap" ref={zoomWrapRef}>
          <section className="page-a3" ref={pageRef}>
            <div className="safe">
              {/* ヘッダー */}
              {(title || subtitle) && (
                <div className="page-header">
                  <div className="header-brand">
                    <span className="brand-text">G-HOUSE</span>
                    <span className="brand-sub">プレゼンテーション</span>
                  </div>
                  {(title || subtitle) && (
                    <>
                      <div className="header-divider" />
                      <div className="header-content">
                        {title && <h1 className="header-title">{title}</h1>}
                        {subtitle && <p className="header-subtitle">{subtitle}</p>}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* メインコンテンツ */}
              <div className="page-main">{children}</div>

              {/* フッター */}
              {showFooter && (
                <div className="page-footer">
                  <span>© G-HOUSE</span>
                  <span>{new Date().toLocaleDateString('ja-JP')}</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
