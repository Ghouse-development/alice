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
              padding: '12px 24px',
              borderBottom: '2px solid #e0e0e0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#c41e3a', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  G-HOUSE
                </span>
                <span style={{ color: '#999', fontSize: '10px' }}>プレゼンテーション</span>
              </div>
              {(title || subtitle) && (
                <>
                  <div
                    style={{
                      width: '1px',
                      height: '32px',
                      background: 'linear-gradient(to bottom, transparent, #c41e3a, transparent)',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    {title && (
                      <h1
                        style={{
                          margin: 0,
                          fontSize: '20px',
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
                          margin: '2px 0 0',
                          fontSize: '14px',
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
            padding: '24px 40px',
            overflow: 'auto',
            height: showFooter ? 'calc(100% - 100px)' : 'calc(100% - 60px)',
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

  // スタンドアロン版（編集画面など）- インラインスタイルで統一
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          width: '1587px',
          height: '1123px',
          backgroundColor: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* ヘッダー */}
        {(title || subtitle) && (
          <div
            style={{
              padding: '12px 24px',
              borderBottom: '2px solid #e0e0e0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#c41e3a', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  G-HOUSE
                </span>
                <span style={{ color: '#999', fontSize: '10px' }}>プレゼンテーション</span>
              </div>
              {(title || subtitle) && (
                <>
                  <div
                    style={{
                      width: '1px',
                      height: '32px',
                      background: 'linear-gradient(to bottom, transparent, #c41e3a, transparent)',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    {title && (
                      <h1
                        style={{
                          margin: 0,
                          fontSize: '20px',
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
                          margin: '2px 0 0',
                          fontSize: '14px',
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
            padding: '24px 40px',
            height: title || subtitle ? 'calc(100% - 120px)' : 'calc(100% - 80px)',
            overflowY: 'auto',
            overflowX: 'hidden',
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
              backgroundColor: 'white',
            }}
          >
            <span>© G-HOUSE</span>
            <span>{new Date().toLocaleDateString('ja-JP')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
