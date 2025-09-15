'use client';

import { useEffect, useState } from 'react';
import { Calculator, Home, Hammer, FileText, Landmark } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Presentation4 } from '@/types';

interface Presentation4ViewProps {
  projectId: string;
}

// デザインシステム定数 - A3横(420mm x 297mm)対応
const CROWN_DESIGN = {
  // A3横サイズ設定 - PresentationContainerと統一
  dimensions: {
    width: '1190px', // A3横の基準幅(px)
    height: '842px',  // A3横の基準高さ(px)
    aspectRatio: '1.414',
    scale: 'scale(1)',
    printScale: '@media print { transform: scale(1); }'
  },
  // CROWN カラーパレット
  colors: {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    accent: '#c41e3a',  // CROWN レッド
    gold: '#b8860b',    // CROWN ゴールド
    platinum: '#e5e4e2', // プラチナシルバー
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
      accent: '#c41e3a'
    },
    gradients: {
      black: 'bg-gradient-to-b from-gray-900 via-black to-gray-900',
      premium: 'bg-gradient-to-r from-black via-gray-900 to-black',
      accent: 'bg-gradient-to-br from-red-900/10 to-red-800/5'
    }
  },
  // CROWN タイポグラフィ
  typography: {
    heading: 'font-bold tracking-[0.15em] uppercase',
    subheading: 'font-light tracking-[0.1em]',
    body: 'font-light tracking-wide',
    accent: 'font-medium tracking-[0.2em] uppercase',
    japanese: 'font-medium'
  },
  // レイアウト設定
  layout: {
    padding: 'px-12 py-8',
    grid: 'grid-cols-12',
    spacing: 'gap-6'
  }
};

const categoryIcons = {
  '建物本体工事費': Home,
  '付帯工事費': Hammer,
  '諸費用': FileText,
  '土地費用': Landmark,
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
    <div
      className={`relative overflow-hidden ${
        isDark ? 'bg-black text-white' : 'bg-white text-gray-900'
      }`}
      style={{
        width: '1190px',
        height: '842px',
        maxWidth: '100%',
        maxHeight: '100%',
        margin: '0 auto',
        aspectRatio: '1.414 / 1',
        transformOrigin: 'center center'
      }}
    >
      {/* 背景パターン */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-br from-black via-gray-950 to-black'
            : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
        }`} />
        {isDark && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(196,30,58,0.03) 50px, rgba(196,30,58,0.03) 51px),
                repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(184,134,11,0.02) 50px, rgba(184,134,11,0.02) 51px)
              `,
            }} />
          </div>
        )}
      </div>

      {/* ヘッダー */}
      <div className={`relative border-b ${
        isDark
          ? 'bg-gradient-to-r from-black via-gray-900 to-black border-red-900/30'
          : 'bg-gradient-to-r from-gray-100 via-white to-gray-100 border-gray-300'
      }`}>
        <div className="px-3 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className={`text-[9px] font-bold tracking-[0.4em] uppercase ${
                  isDark ? 'text-red-600' : 'text-red-700'
                }`}>G-HOUSE</span>
              </div>
              <div className={`h-8 w-px bg-gradient-to-b from-transparent ${
                isDark ? 'via-red-600/50' : 'via-red-700/50'
              } to-transparent`} />
              <span className={`text-[10px] font-bold tracking-[0.2em] uppercase border-b-2 pb-1 ${
                isDark
                  ? 'text-white border-red-600'
                  : 'text-gray-900 border-red-700'
              }`}>
                資金計画
              </span>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ - A3横レイアウト */}
      <div className="relative px-4 py-3 h-[calc(100%-80px)]">
        {/* 費用カテゴリー */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.label as keyof typeof categoryIcons] || FileText;
            return (
              <div
                key={category.key}
                className={`rounded-lg p-3 backdrop-blur-sm border ${
                  isDark
                    ? 'bg-gradient-to-br from-gray-900/60 to-gray-800/40 border-gray-700/50'
                    : 'bg-gradient-to-br from-gray-100 to-white border-gray-300'
                }`}
                style={{
                  background: isDark
                    ? `linear-gradient(135deg, rgba(30,30,30,0.8) 0%, rgba(60,60,60,0.3) 100%)`
                    : `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(249,250,251,0.8) 100%)`,
                  borderColor: index === 0
                    ? (isDark ? CROWN_DESIGN.colors.accent : '#dc2626')
                    : (isDark ? 'rgba(115,115,115,0.3)' : '#d1d5db')
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: isDark ? `${CROWN_DESIGN.colors.accent}20` : 'rgba(220,38,38,0.1)',
                      color: isDark ? CROWN_DESIGN.colors.accent : '#dc2626'
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className={`${CROWN_DESIGN.typography.japanese} text-xs mb-1 font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {category.label}
                </h3>
                <p className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  ¥{category.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        {/* 総費用セクション */}
        <div
          className={`p-3 rounded-lg mb-4 border ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
          style={{
            background: isDark
              ? `linear-gradient(135deg, ${CROWN_DESIGN.colors.accent}20 0%, rgba(196,30,58,0.1) 100%)`
              : `linear-gradient(135deg, rgba(220,38,38,0.1) 0%, rgba(220,38,38,0.05) 100%)`,
            borderColor: isDark ? CROWN_DESIGN.colors.accent : '#dc2626'
          }}
        >
          <h3 className={`${CROWN_DESIGN.typography.heading} text-base mb-1`}
            style={{color: isDark ? CROWN_DESIGN.colors.accent : '#dc2626'}}>
            TOTAL COST
          </h3>
          <p className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            ¥{presentation.totalCost.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 費用内訳詳細 */}
          {presentation.costBreakdown && presentation.costBreakdown.length > 0 && (
            <div className={`rounded-lg overflow-hidden h-fit border ${
              isDark
                ? 'bg-gradient-to-br from-gray-900/60 to-gray-800/30 border-gray-700/50'
                : 'bg-gradient-to-br from-gray-50 to-white border-gray-300'
            }`}>
              <div className={`px-3 py-2 border-b ${
                isDark
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'
                  : 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300'
              }`}>
                <h3 className={`${CROWN_DESIGN.typography.japanese} text-xs font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  費用内訳詳細
                </h3>
              </div>
              <div className="p-3">
                <table className="w-full">
                  <tbody>
                    {presentation.costBreakdown.slice(0, 5).map((item) => (
                      <tr key={item.id} className={`border-b last:border-0 ${
                        isDark ? 'border-gray-800' : 'border-gray-200'
                      }`}>
                        <td className={`py-2 text-xs ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>{item.item}</td>
                        <td className={`py-2 text-xs text-right font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          ¥{item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ローンシミュレーション */}
          <div className={`rounded-lg p-3 h-fit border ${
            isDark
              ? 'bg-gradient-to-br from-gray-900/60 to-gray-800/30 border-gray-700/50'
              : 'bg-gradient-to-br from-gray-50 to-white border-gray-300'
          }`}>
            <h3 className={`${CROWN_DESIGN.typography.japanese} text-base font-bold mb-3 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Calculator className="mr-2 h-5 w-5" style={{
                color: isDark ? CROWN_DESIGN.colors.gold : '#eab308'
              }} />
              ローンシミュレーション
            </h3>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className={`p-2 rounded border ${
                isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
              }`}>
                <p className={`text-[10px] mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>借入金額</p>
                <p className={`text-xs font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>¥{presentation.loanAmount.toLocaleString()}</p>
              </div>
              <div className={`p-2 rounded border ${
                isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
              }`}>
                <p className={`text-[10px] mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>頭金</p>
                <p className={`text-xs font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>¥{presentation.downPayment.toLocaleString()}</p>
              </div>
              <div className={`p-2 rounded border ${
                isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
              }`}>
                <p className={`text-[10px] mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>金利</p>
                <p className={`text-xs font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{presentation.interestRate.toFixed(1)}%</p>
              </div>
              <div className={`p-2 rounded border ${
                isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
              }`}>
                <p className={`text-[10px] mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>返済期間</p>
                <p className={`text-xs font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{presentation.loanPeriod}年</p>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg text-center border ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
              style={{
                background: isDark
                  ? `linear-gradient(135deg, ${CROWN_DESIGN.colors.gold}30 0%, rgba(184,134,11,0.1) 100%)`
                  : `linear-gradient(135deg, rgba(234,179,8,0.2) 0%, rgba(234,179,8,0.1) 100%)`,
                borderColor: isDark ? CROWN_DESIGN.colors.gold : '#eab308'
              }}
            >
              <p className={`${CROWN_DESIGN.typography.japanese} text-xs mb-1`}>月々のお支払い</p>
              <p className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                ¥{presentation.monthlyPayment.toLocaleString()}
              </p>
              <p className={`text-[10px] mt-1 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                ※ボーナス払いなし、元利均等返済の場合
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CROWN フッター */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className={`px-3 py-1 border-t ${
          isDark
            ? 'bg-gradient-to-r from-black via-gray-900 to-black border-red-900/30'
            : 'bg-gradient-to-r from-gray-100 via-white to-gray-100 border-gray-300'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`h-3 w-px ${
                isDark ? 'bg-gray-700' : 'bg-gray-300'
              }`} />
            </div>
            <div className="flex items-center gap-2">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}