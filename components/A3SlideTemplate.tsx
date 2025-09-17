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
      {/* 統一背景 - 白ベース */}
      <div className="absolute inset-0 bg-white" />

      {/* 統一ヘッダー */}
      <div className="relative z-10 border-b-2 border-gray-200 bg-white">
        <div className="px-8 py-4">
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
      </div>

      {/* メインコンテンツエリア - 中央配置 */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[1400px] mx-auto">{children}</div>
      </div>

      {/* 統一フッター */}
      <div className="relative z-10 border-t border-gray-200 bg-white px-8 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>© G-HOUSE</span>
          <span>{new Date().toLocaleDateString('ja-JP')}</span>
        </div>
      </div>
    </A3PrintContainer>
  );
};

export default A3SlideTemplate;
