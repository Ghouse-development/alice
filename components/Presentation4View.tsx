'use client';

import { useEffect, useState } from 'react';
import { Calculator, Home, Hammer, FileText, Landmark } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Presentation4 } from '@/types';
import A3Page from './A3Page';

interface Presentation4ViewProps {
  projectId: string;
}

// デザインシステム定数 - A3横(420mm x 297mm)対応
const CROWN_DESIGN = {
  // A3横サイズ設定 - 96dpi基準
  dimensions: {
    width: '1587px', // 420mm at 96dpi
    height: '1123px', // 297mm at 96dpi
    aspectRatio: '1.414',
  },
  // CROWN カラーパレット
  colors: {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    accent: '#c41e3a', // CROWN レッド
    gold: '#b8860b', // CROWN ゴールド
    platinum: '#e5e4e2', // プラチナシルバー
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
      accent: '#c41e3a',
    },
    gradients: {
      black: 'bg-gradient-to-b from-gray-900 via-black to-gray-900',
      premium: 'bg-gradient-to-r from-black via-gray-900 to-black',
      accent: 'bg-gradient-to-br from-red-900/10 to-red-800/5',
    },
  },
  // CROWN タイポグラフィ
  typography: {
    heading: 'font-bold tracking-[0.15em] uppercase',
    subheading: 'font-light tracking-[0.1em]',
    body: 'font-light tracking-wide',
    accent: 'font-medium tracking-[0.2em] uppercase',
    japanese: 'font-medium',
  },
  // レイアウト設定
  layout: {
    padding: 'px-12 py-8',
    grid: 'grid-cols-12',
    spacing: 'gap-6',
  },
};

const categoryIcons = {
  建物本体工事費: Home,
  付帯工事費: Hammer,
  諸費用: FileText,
  土地費用: Landmark,
};

export function Presentation4View({ projectId }: Presentation4ViewProps) {
  const { currentProject, theme } = useStore();
  const [presentation, setPresentation] = useState<Presentation4 | null>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (currentProject?.presentation4) {
      setPresentation(currentProject.presentation4);
    } else {
      // デフォルトデータを設定
      const defaultPresentation: Presentation4 = {
        id: `pres4-${Date.now()}`,
        projectId,
        buildingCost: 25000000,
        constructionCost: 5000000,
        otherCosts: 2000000,
        landCost: 15000000,
        totalCost: 47000000,
        costBreakdown: [
          { id: '1', item: '建物本体工事', amount: 25000000, category: '建物本体工事費' },
          { id: '2', item: '外構工事', amount: 3000000, category: '付帯工事費' },
          { id: '3', item: '設備工事', amount: 2000000, category: '付帯工事費' },
          { id: '4', item: '登記費用', amount: 500000, category: '諸費用' },
          { id: '5', item: '税金・保険', amount: 1500000, category: '諸費用' },
        ],
        loanAmount: 40000000,
        downPayment: 7000000,
        interestRate: 0.5,
        loanPeriod: 35,
        monthlyPayment: 103834,
      };
      setPresentation(defaultPresentation);
    }
  }, [currentProject, projectId]);

  if (!presentation) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-xl text-gray-500">資金計画データを読み込み中...</p>
      </div>
    );
  }

  const categories = [
    { key: 'buildingCost', label: '建物本体工事費', value: presentation.buildingCost },
    { key: 'constructionCost', label: '付帯工事費', value: presentation.constructionCost },
    { key: 'otherCosts', label: '諸費用', value: presentation.otherCosts },
    { key: 'landCost', label: '土地費用', value: presentation.landCost },
  ];

  return (
    <A3Page title="資金計画" subtitle="住宅建築における総費用とローン計画">
      {/* 背景パターン */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-br from-black via-gray-950 to-black'
              : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
          }`}
        />
        {isDark && (
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(196,30,58,0.03) 50px, rgba(196,30,58,0.03) 51px),
                repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(184,134,11,0.02) 50px, rgba(184,134,11,0.02) 51px)
              `,
              }}
            />
          </div>
        )}
      </div>

      {/* ヘッダー - Presentation2と統一 */}
      <div
        className={`relative border-b ${isDark ? 'bg-gradient-to-r from-black via-gray-900 to-black border-red-900/30' : 'bg-gradient-to-r from-white via-gray-50 to-white border-gray-200'}`}
      >
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.4em] text-red-600 uppercase">
                  G-HOUSE
                </span>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
              <span
                className={`text-[11px] font-bold tracking-[0.2em] uppercase border-b-2 border-red-600 pb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                資金計画
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ - A3横レイアウト最適化 */}
      <div className="relative px-8 py-6" style={{ height: 'auto', overflow: 'visible' }}>
        {/* 見出し：資金計画概要 */}
        <div className="text-center mb-6">
          <h1
            className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
            style={{ color: isDark ? CROWN_DESIGN.colors.accent : '#dc2626' }}
          >
            資金計画
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            住宅建築における総費用とローン計画
          </p>
        </div>

        {/* 表：費用構成（2列レイアウト） */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          {/* 左列：費用構成 */}
          <div
            className={`rounded-lg border ${
              isDark
                ? 'bg-gradient-to-br from-gray-900/60 to-gray-800/30 border-gray-700/50'
                : 'bg-gradient-to-br from-gray-50 to-white border-gray-300'
            }`}
          >
            <div
              className={`px-4 py-3 border-b ${
                isDark
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'
                  : 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300'
              }`}
            >
              <h2
                className={`text-xl font-bold flex items-center gap-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                <Home
                  className="h-6 w-6"
                  style={{
                    color: isDark ? CROWN_DESIGN.colors.accent : '#dc2626',
                  }}
                />
                建築費用構成
              </h2>
            </div>
            <div className="p-4">
              <table className="table block">
                <tbody>
                  {categories.map((category, index) => {
                    const Icon =
                      categoryIcons[category.label as keyof typeof categoryIcons] || FileText;
                    return (
                      <tr
                        key={category.key}
                        className={`border-b last:border-0 ${
                          isDark ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: isDark
                                  ? `${CROWN_DESIGN.colors.accent}20`
                                  : 'rgba(220,38,38,0.1)',
                                color: isDark ? CROWN_DESIGN.colors.accent : '#dc2626',
                              }}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <span
                              className={`text-base font-medium ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              {category.label}
                            </span>
                          </div>
                        </td>
                        <td
                          className={`py-3 text-right text-xl font-bold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          ¥{category.value.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className={`border-t-2 ${isDark ? 'border-red-600' : 'border-red-700'}`}>
                    <td
                      className={`py-4 text-xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      総建築費用
                    </td>
                    <td
                      className={`py-4 text-right text-3xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                      style={{ color: isDark ? CROWN_DESIGN.colors.accent : '#dc2626' }}
                    >
                      ¥{presentation.totalCost.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 右列：ローンシミュレーション */}
          <div
            className={`rounded-lg border ${
              isDark
                ? 'bg-gradient-to-br from-gray-900/60 to-gray-800/30 border-gray-700/50'
                : 'bg-gradient-to-br from-gray-50 to-white border-gray-300'
            }`}
          >
            <div
              className={`px-4 py-3 border-b ${
                isDark
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'
                  : 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300'
              }`}
            >
              <h2
                className={`text-xl font-bold flex items-center gap-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                <Calculator
                  className="h-6 w-6"
                  style={{
                    color: isDark ? CROWN_DESIGN.colors.gold : '#eab308',
                  }}
                />
                ローンシミュレーション
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div
                  className={`p-3 rounded border ${
                    isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    借入金額
                  </p>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ¥{presentation.loanAmount.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`p-3 rounded border ${
                    isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    頭金
                  </p>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ¥{presentation.downPayment.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`p-3 rounded border ${
                    isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    金利
                  </p>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {presentation.interestRate.toFixed(1)}%
                  </p>
                </div>
                <div
                  className={`p-3 rounded border ${
                    isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    返済期間
                  </p>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {presentation.loanPeriod}年
                  </p>
                </div>
              </div>

              <div
                className={`p-6 rounded-lg text-center border-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
                style={{
                  background: isDark
                    ? `linear-gradient(135deg, ${CROWN_DESIGN.colors.gold}30 0%, rgba(184,134,11,0.1) 100%)`
                    : `linear-gradient(135deg, rgba(234,179,8,0.2) 0%, rgba(234,179,8,0.1) 100%)`,
                  borderColor: isDark ? CROWN_DESIGN.colors.gold : '#eab308',
                }}
              >
                <p className="text-lg font-bold mb-2">月々のお支払い</p>
                <p
                  className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  style={{ color: isDark ? CROWN_DESIGN.colors.gold : '#eab308' }}
                >
                  ¥{presentation.monthlyPayment.toLocaleString()}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  ※ボーナス払いなし、元利均等返済の場合
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 補足説明：資金計画のポイント */}
        <div
          className={`rounded-lg p-6 border ${
            isDark
              ? 'bg-gradient-to-br from-gray-900/60 to-gray-800/30 border-gray-700/50'
              : 'bg-gradient-to-br from-blue-50 to-white border-blue-300'
          }`}
        >
          <h3
            className={`text-xl font-bold mb-4 flex items-center gap-3 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            <FileText className="h-6 w-6 text-blue-600" />
            資金計画のポイント
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {((presentation.downPayment / presentation.totalCost) * 100).toFixed(1)}%
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                自己資金比率
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {presentation.loanPeriod}年
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>返済期間</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {((presentation.monthlyPayment * 12) / 10000).toFixed(0)}万円
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>年間返済額</p>
            </div>
          </div>
        </div>
      </div>

      {/* CROWN フッター */}
      <div className="absolute bottom-0 left-0 right-0">
        <div
          className={`px-3 py-1 border-t ${
            isDark
              ? 'bg-gradient-to-r from-black via-gray-900 to-black border-red-900/30'
              : 'bg-gradient-to-r from-gray-100 via-white to-gray-100 border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`h-3 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
            </div>
            <div className="flex items-center gap-2"></div>
          </div>
        </div>
      </div>
    </A3Page>
  );
}
