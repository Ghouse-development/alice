'use client';

import { useEffect, useState } from 'react';
import { Calculator, Home, Hammer, FileText, Landmark, Check, ChevronRight } from 'lucide-react';
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
  const { currentProject } = useStore();
  const [presentation, setPresentation] = useState<Presentation4 | null>(null);

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
          { id: '1', item: '建物本体工事', amount: 25000000 },
          { id: '2', item: '外構工事', amount: 3000000 },
          { id: '3', item: '設備工事', amount: 2000000 },
          { id: '4', item: '登記費用', amount: 500000 },
          { id: '5', item: '税金・保険', amount: 1500000 },
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
      className="relative bg-black text-white overflow-hidden"
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
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(196,30,58,0.03) 50px, rgba(196,30,58,0.03) 51px),
              repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(184,134,11,0.02) 50px, rgba(184,134,11,0.02) 51px)
            `,
          }} />
        </div>
      </div>

      {/* ヘッダー */}
      <div className="relative bg-gradient-to-r from-black via-gray-900 to-black border-b border-red-900/30">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.4em] text-red-600 uppercase">G-HOUSE</span>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-white uppercase border-b-2 border-red-600 pb-1">
                資金計画
              </span>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ - A3横レイアウト */}
      <div className="relative px-6 py-4 h-[calc(100%-100px)]">
        {/* 費用カテゴリー */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.label as keyof typeof categoryIcons] || FileText;
            return (
              <div
                key={category.key}
                className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm"
                style={{
                  background: `linear-gradient(135deg, rgba(30,30,30,0.8) 0%, rgba(60,60,60,0.3) 100%)`,
                  borderColor: index === 0 ? CROWN_DESIGN.colors.accent : 'rgba(115,115,115,0.3)'
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${CROWN_DESIGN.colors.accent}20`, color: CROWN_DESIGN.colors.accent }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className={`${CROWN_DESIGN.typography.japanese} text-white text-sm mb-2 font-medium`}>
                  {category.label}
                </h3>
                <p className="text-xl font-bold text-white">
                  ¥{category.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        {/* 総費用セクション */}
        <div
          className="p-5 rounded-lg text-white mb-6 border"
          style={{
            background: `linear-gradient(135deg, ${CROWN_DESIGN.colors.accent}20 0%, rgba(196,30,58,0.1) 100%)`,
            borderColor: CROWN_DESIGN.colors.accent
          }}
        >
          <h3 className={`${CROWN_DESIGN.typography.heading} text-lg mb-2`} style={{color: CROWN_DESIGN.colors.accent}}>
            TOTAL COST
          </h3>
          <p className="text-3xl font-bold text-white">
            ¥{presentation.totalCost.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* 費用内訳詳細 */}
          {presentation.costBreakdown && presentation.costBreakdown.length > 0 && (
            <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 border border-gray-700/50 rounded-lg overflow-hidden h-fit">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 border-b border-gray-700">
                <h3 className={`${CROWN_DESIGN.typography.japanese} text-sm font-semibold text-white`}>
                  費用内訳詳細
                </h3>
              </div>
              <div className="p-4">
                <table className="w-full">
                  <tbody>
                    {presentation.costBreakdown.slice(0, 5).map((item) => (
                      <tr key={item.id} className="border-b border-gray-800 last:border-0">
                        <td className="py-3 text-sm text-white">{item.item}</td>
                        <td className="py-3 text-sm text-right font-bold text-white">
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
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 border border-gray-700/50 rounded-lg p-4 h-fit">
            <h3 className={`${CROWN_DESIGN.typography.japanese} text-lg font-bold mb-4 flex items-center text-white`}>
              <Calculator className="mr-3 h-6 w-6" style={{ color: CROWN_DESIGN.colors.gold }} />
              ローンシミュレーション
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">借入金額</p>
                <p className="text-sm font-bold text-white">¥{presentation.loanAmount.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">頭金</p>
                <p className="text-sm font-bold text-white">¥{presentation.downPayment.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">金利</p>
                <p className="text-sm font-bold text-white">{presentation.interestRate.toFixed(1)}%</p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">返済期間</p>
                <p className="text-sm font-bold text-white">{presentation.loanPeriod}年</p>
              </div>
            </div>

            <div
              className="p-4 rounded-lg text-center text-white border"
              style={{
                background: `linear-gradient(135deg, ${CROWN_DESIGN.colors.gold}30 0%, rgba(184,134,11,0.1) 100%)`,
                borderColor: CROWN_DESIGN.colors.gold
              }}
            >
              <p className={`${CROWN_DESIGN.typography.japanese} text-sm mb-2`}>月々のお支払い</p>
              <p className="text-2xl font-bold text-white">
                ¥{presentation.monthlyPayment.toLocaleString()}
              </p>
              <p className="text-xs mt-2 text-gray-300">
                ※ボーナス払いなし、元利均等返済の場合
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CROWN フッター */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="bg-gradient-to-r from-black via-gray-900 to-black border-t border-red-900/30 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-red-500" />
                <span className="text-xs text-gray-400 tracking-wider"></span>
              </div>
              <div className="h-4 w-px bg-gray-700" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-red-400 tracking-wider">資金計画</span>
              <ChevronRight className="w-3 h-3 text-red-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}