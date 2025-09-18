'use client';

import React, { useEffect, useState } from 'react';

interface A3PageProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showFooter?: boolean;
  className?: string;
}

export default function A3Page({
  children,
  title,
  subtitle,
  showFooter = true,
  className = '',
}: A3PageProps) {
  const [isInsideContainer, setIsInsideContainer] = useState(false);

  useEffect(() => {
    // PresentationContainer内にいるかチェック
    const container = document.querySelector('.presentation-wrapper');
    setIsInsideContainer(!!container);
  }, []);

  // PresentationContainer内の場合はシンプルなレイアウト
  if (isInsideContainer) {
    return (
      <div
        className="a3-page-simple"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ヘッダー */}
        {(title || subtitle) && (
          <div
            style={{
              padding: '40px 60px 20px',
              borderBottom: '2px solid #e0e0e0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div>
                <div style={{ color: '#c41e3a', fontWeight: 'bold', fontSize: '18px' }}>
                  G-HOUSE
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>プレゼンテーション</div>
              </div>
              {(title || subtitle) && (
                <>
                  <div
                    style={{
                      width: '2px',
                      height: '40px',
                      background: 'linear-gradient(to bottom, transparent, #c41e3a, transparent)',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    {title && (
                      <h1
                        style={{
                          margin: 0,
                          fontSize: '28px',
                          fontWeight: 'bold',
                          color: '#222',
                        }}
                      >
                        {title}
                      </h1>
                    )}
                    {subtitle && (
                      <p
                        style={{
                          margin: '4px 0 0',
                          fontSize: '16px',
                          color: '#666',
                        }}
                      >
                        {subtitle}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* メインコンテンツ */}
        <div
          style={{
            flex: 1,
            padding: '40px 60px',
            overflow: 'auto',
            height: showFooter ? 'calc(100% - 160px)' : 'calc(100% - 100px)',
          }}
        >
          {children}
        </div>

        {/* フッター */}
        {showFooter && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'space-between',
              padding: '20px 60px',
              borderTop: '1px solid #e0e0e0',
              fontSize: '14px',
              color: '#666',
            }}
          >
            <span>© G-HOUSE</span>
            <span>{new Date().toLocaleDateString('ja-JP')}</span>
          </div>
        )}
      </div>
    );
  }

  // スタンドアロン版（編集画面など）
  return (
    <>
      <style jsx>{`
        @import url('/styles/a3.css');
      `}</style>
      <div className={`viewport no-print-bg ${className}`}>
        <div className="zoom-wrap">
          <section className="page-a3">
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
