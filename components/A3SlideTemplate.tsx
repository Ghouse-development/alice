'use client';

import React from 'react';
import { A3PrintContainer } from './A3PrintContainer';

interface A3SlideTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

// 統一されたA3スライドテンプレート
export const A3SlideTemplate: React.FC<A3SlideTemplateProps> = ({ title, subtitle, children }) => {
  return (
    <A3PrintContainer title={title} subtitle={subtitle} className="bg-white" autoScale={true}>
      {/* A3横サイズの固定コンテナ - 420mm × 297mm */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{
          width: '420mm',
          height: '297mm',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
      >
        {/* 統一背景 - 白ベース */}
        <div className="absolute inset-0 bg-white" />

        {/* 統一ヘッダー - 20mm余白考慮 */}
        <div
          className="relative z-10 border-b-2 border-gray-200 bg-white w-full"
          style={{
            padding: '15mm 20mm 10mm 20mm',
            flexShrink: 0,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wider text-red-600">G-HOUSE</span>
                <span className="text-xs text-gray-500">プレゼンテーション</span>
              </div>
              <div className="h-12 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツエリア - 完全中央配置、はみ出し防止 */}
        <div
          className="relative z-10 flex-1 flex items-center justify-center"
          style={{
            width: '100%',
            maxWidth: 'calc(420mm - 40mm)',
            maxHeight: 'calc(297mm - 100mm)',
            padding: '20mm',
            margin: 'auto',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              overflow: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {children}
          </div>
        </div>

        {/* 統一フッター - 20mm余白考慮 */}
        <div
          className="relative z-10 border-t border-gray-200 bg-white w-full"
          style={{
            padding: '10mm 20mm 15mm 20mm',
            flexShrink: 0,
          }}
        >
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>© G-HOUSE</span>
            <span>{new Date().toLocaleDateString('ja-JP')}</span>
          </div>
        </div>
      </div>
    </A3PrintContainer>
  );
};

export default A3SlideTemplate;
