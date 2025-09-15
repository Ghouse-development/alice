'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Sun, Settings, Zap, DollarSign, BarChart3 } from 'lucide-react';
import { useStore } from '@/lib/store';

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

const Presentation5RunningCost: React.FC = () => {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const [solarCapacity, setSolarCapacity] = useState(8.3);
  const [hasBattery, setHasBattery] = useState(false);
  const [monthlyElectricity, setMonthlyElectricity] = useState(16533);
  const [inflationRate, setInflationRate] = useState(2);
  const [showSettings, setShowSettings] = useState(false);

  // 実績データに基づく売電・買電計算
  const calculateMonthlyBalance = useMemo(() => {
    const capacityFactor = solarCapacity / 8.3;
    const baseBuyElectricity = 58435 / 8;
    const baseSellElectricity = 85548 / 8;

    const buyElectricity = baseBuyElectricity * (1 - capacityFactor * 0.3);
    const sellElectricity = baseSellElectricity * capacityFactor * (hasBattery ? 1.2 : 1);

    return {
      buy: Math.round(buyElectricity),
      sell: Math.round(sellElectricity),
      net: Math.round(sellElectricity - buyElectricity)
    };
  }, [solarCapacity, hasBattery]);

  // 3パターンの30年間シミュレーション
  const lifetimeSimulation = useMemo(() => {
    const years = 30;
    const data = [];

    // パターン1: 太陽光なし（標準住宅）
    // パターン2: 太陽光のみ
    // パターン3: 太陽光 + 蓄電池

    const solarOnlyCost = solarCapacity * 250000;
    const solarBatteryCost = solarCapacity * 250000 + 1500000;

    let cumulativePattern1 = 0; // 太陽光なし
    let cumulativePattern2 = solarOnlyCost; // 太陽光のみ（初期投資）
    let cumulativePattern3 = solarBatteryCost; // 太陽光 + 蓄電池（初期投資）

    for (let year = 1; year <= years; year++) {
      const inflationMultiplier = Math.pow(1 + inflationRate / 100, year - 1);
      const yearlyElectricity = monthlyElectricity * 12 * inflationMultiplier;

      // パターン1: 標準電気代のみ
      cumulativePattern1 += yearlyElectricity;

      // パターン2: 太陽光のみ（自家消費率30%）
      const solarOnlySavings = calculateMonthlyBalance.net * 12 * 0.8 * (year <= 20 ? 1 : 0.8);
      cumulativePattern2 += Math.max(0, yearlyElectricity - solarOnlySavings);

      // パターン3: 太陽光 + 蓄電池（自家消費率70%）
      const solarBatterySavings = calculateMonthlyBalance.net * 12 * 1.4 * (year <= 20 ? 1 : 0.8);
      cumulativePattern3 += Math.max(0, yearlyElectricity - solarBatterySavings);

      data.push({
        year,
        pattern1: Math.round(cumulativePattern1), // 標準住宅
        pattern2: Math.round(cumulativePattern2), // 太陽光のみ
        pattern3: Math.round(cumulativePattern3), // 太陽光 + 蓄電池
        yearlyElectricity: Math.round(yearlyElectricity)
      });
    }

    return {
      data,
      initialInvestments: {
        solarOnly: solarOnlyCost,
        solarBattery: solarBatteryCost
      }
    };
  }, [solarCapacity, monthlyElectricity, inflationRate, calculateMonthlyBalance]);

  const finalYear = lifetimeSimulation.data[lifetimeSimulation.data.length - 1];
  const totalSavingsPattern2 = finalYear.pattern1 - finalYear.pattern2;
  const totalSavingsPattern3 = finalYear.pattern1 - finalYear.pattern3;
  const paybackPeriodPattern2 = lifetimeSimulation.data.findIndex(d => d.pattern1 > d.pattern2) + 1;
  const paybackPeriodPattern3 = lifetimeSimulation.data.findIndex(d => d.pattern1 > d.pattern3) + 1;

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
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex flex-col">
                <span className={`text-[10px] font-bold tracking-[0.4em] uppercase ${
                  isDark ? 'text-red-600' : 'text-red-700'
                }`}>G-HOUSE</span>
              </div>
              <div className={`h-12 w-px bg-gradient-to-b from-transparent ${
                isDark ? 'via-red-600/50' : 'via-red-700/50'
              } to-transparent`} />
              <span className={`text-[11px] font-bold tracking-[0.2em] uppercase border-b-2 pb-1 ${
                isDark
                  ? 'text-white border-red-600'
                  : 'text-gray-900 border-red-700'
              }`}>
                光熱費・ランニングコスト
              </span>
            </div>
            <div className="flex items-center gap-8">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                }`}
              >
                <Settings className={`h-5 w-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ - A3横レイアウト */}
      <div className="relative px-8 py-4 h-[calc(100%-100px)] overflow-hidden">
        <div className="grid grid-cols-12 gap-8 h-full">
          {/* 左側：コントロールパネル */}
          <div className="col-span-4 space-y-4">
            {/* タイトル */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-gold-600/10 blur-xl rounded-lg" />
                <div className={`relative p-4 rounded-lg border ${
                  isDark
                    ? 'bg-gradient-to-r from-red-900/20 to-gold-900/10 border-red-600/30'
                    : 'bg-gradient-to-r from-red-100 to-yellow-50 border-red-400'
                }`}>
                  <h1 className={`text-2xl font-bold tracking-wider mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    30年間の光熱費シミュレーション
                  </h1>
                  <p className={`text-sm tracking-wide ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>太陽光発電システムによる経済効果分析</p>
                </div>
              </div>
            </div>

            {/* システム設定表示 */}
            <div className={`backdrop-blur rounded-lg p-4 border ${
              isDark
                ? 'bg-gradient-to-br from-gray-900/60 to-black/40 border-gray-800/50'
                : 'bg-gradient-to-br from-gray-100 to-white border-gray-300'
            }`}>
              <div className={`flex items-center gap-3 mb-4 ${
                isDark ? 'text-red-500' : 'text-red-600'
              }`}>
                <Sun className="h-5 w-5" />
                <span className="text-sm font-medium tracking-wide">太陽光発電システム設定</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`text-sm tracking-wide ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>発電容量</span>
                  <span className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{solarCapacity}<span className={`text-sm ml-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>kW</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm tracking-wide ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>蓄電池システム</span>
                  <span className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{hasBattery ? '搭載' : 'なし'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm tracking-wide ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>年間インフレ率</span>
                  <span className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{inflationRate}<span className={`text-sm ml-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>%/年</span></span>
                </div>
              </div>
            </div>

            {/* 月間エネルギー収支 */}
            <div className={`rounded-lg p-4 border shadow-2xl ${
              isDark
                ? 'bg-gradient-to-br from-red-900/20 to-yellow-900/10 border-red-600/30'
                : 'bg-gradient-to-br from-red-100 to-yellow-50 border-red-400'
            }`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-3" style={{
                color: isDark ? '#B8860B' : '#eab308'
              }}>
                <Zap className="h-5 w-5" style={{
                  color: isDark ? '#B8860B' : '#eab308'
                }} />
                <span className="tracking-wide">月間エネルギー収支</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`text-sm tracking-wide ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>電力購入コスト</span>
                  <span className={`font-bold ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`}>-¥{calculateMonthlyBalance.buy.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm tracking-wide ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>売電収入</span>
                  <span className="font-bold" style={{
                    color: isDark ? '#B8860B' : '#eab308'
                  }}>+¥{calculateMonthlyBalance.sell.toLocaleString()}</span>
                </div>
                <div className={`border-t pt-4 ${
                  isDark ? 'border-red-600/30' : 'border-red-400'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium tracking-wide ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>月間収支</span>
                    <span className="text-2xl font-bold" style={{
                      color: calculateMonthlyBalance.net > 0 ? (isDark ? '#B8860B' : '#eab308') : (isDark ? '#EF4444' : '#ef4444')
                    }}>
                      {calculateMonthlyBalance.net > 0 ? '+' : ''}¥{calculateMonthlyBalance.net.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI指標 */}
            <div className="grid grid-cols-1 gap-3">
              <div className={`backdrop-blur rounded-lg p-4 border ${
                isDark
                  ? 'bg-gradient-to-r from-gray-900/60 to-black/40 border-gray-800/50'
                  : 'bg-gradient-to-r from-gray-100 to-white border-gray-300'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-5 w-5" style={{
                    color: isDark ? '#B8860B' : '#eab308'
                  }} />
                  <span className={`text-xs tracking-wide uppercase ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>投資回収期間</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>太陽光のみ</span>
                    <span className="text-lg font-bold" style={{
                      color: isDark ? '#B8860B' : '#eab308'
                    }}>{paybackPeriodPattern2 > 0 ? paybackPeriodPattern2 : '---'}年</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>太陽光+蓄電池</span>
                    <span className="text-lg font-bold" style={{
                      color: isDark ? '#B8860B' : '#eab308'
                    }}>{paybackPeriodPattern3 > 0 ? paybackPeriodPattern3 : '---'}年</span>
                  </div>
                </div>
              </div>
              <div className={`backdrop-blur rounded-lg p-4 border ${
                isDark
                  ? 'bg-gradient-to-r from-gray-900/60 to-black/40 border-gray-800/50'
                  : 'bg-gradient-to-r from-gray-100 to-white border-gray-300'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className={`h-5 w-5 ${
                    isDark ? 'text-red-500' : 'text-red-600'
                  }`} />
                  <span className={`text-xs tracking-wide uppercase ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>30年間総利益</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>太陽光のみ</span>
                    <span className={`text-lg font-bold ${
                      isDark ? 'text-red-400' : 'text-red-600'
                    }`}>{(totalSavingsPattern2 / 10000).toFixed(0)}万</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>太陽光+蓄電池</span>
                    <span className={`text-lg font-bold ${
                      isDark ? 'text-red-400' : 'text-red-600'
                    }`}>{(totalSavingsPattern3 / 10000).toFixed(0)}万</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：チャート＆分析 */}
          <div className="col-span-8">
            <div className={`backdrop-blur rounded-lg p-4 border h-full ${
              isDark
                ? 'bg-gradient-to-br from-gray-900/60 to-black/40 border-gray-800/50'
                : 'bg-gradient-to-br from-gray-50 to-white border-gray-300'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <BarChart3 className={`h-7 w-7 ${
                    isDark ? 'text-red-500' : 'text-red-600'
                  }`} />
                  <div>
                    <h3 className={`text-xl font-bold tracking-wide ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>30年間コスト分析</h3>
                    <p className={`text-sm tracking-wide ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>光熱費累積比較チャート</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full shadow-lg ${
                      isDark ? 'bg-red-500' : 'bg-red-600'
                    }`}></div>
                    <span className={`tracking-wide ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>従来住宅</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full shadow-lg ${
                      isDark ? 'bg-blue-500' : 'bg-blue-600'
                    }`}></div>
                    <span className={`tracking-wide ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>太陽光あり</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shadow-lg" style={{
                      backgroundColor: isDark ? '#B8860B' : '#eab308'
                    }}></div>
                    <span className={`tracking-wide ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>太陽光＋蓄電池</span>
                  </div>
                </div>
              </div>

              {/* チャートエリア */}
              <div className={`relative h-[320px] rounded-lg p-4 border ${
                isDark
                  ? 'bg-black/30 border-red-900/30'
                  : 'bg-gray-50 border-gray-300'
              }`}>
                <svg className="w-full h-full" viewBox="0 0 800 350">
                  {/* グリッドライン */}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <g key={i}>
                      <line
                        x1="60"
                        y1={50 + i * 50}
                        x2="740"
                        y2={50 + i * 50}
                        stroke={isDark ? '#4B5563' : '#d1d5db'}
                        strokeWidth="0.5"
                        strokeDasharray="3,3"
                      />
                      <text
                        x="45"
                        y={55 + i * 50}
                        fill={isDark ? '#9CA3AF' : '#6b7280'}
                        fontSize="11"
                        textAnchor="end"
                        className="font-light"
                      >
                        {((5 - i) * 2000).toLocaleString()}万
                      </text>
                    </g>
                  ))}

                  {/* X軸ラベル */}
                  {[0, 5, 10, 15, 20, 25, 30].map((year) => (
                    <text
                      key={year}
                      x={60 + (year * 680) / 30}
                      y={330}
                      fill="#9CA3AF"
                      fontSize="11"
                      textAnchor="middle"
                      className="font-light"
                    >
                      {year}年
                    </text>
                  ))}

                  {/* パターン1: 従来住宅ライン */}
                  <polyline
                    points={lifetimeSimulation.data
                      .map((d, i) => `${60 + (i * 680) / 30},${300 - (d.pattern1 / 100000) * 250}`)
                      .join(' ')}
                    fill="none"
                    stroke={isDark ? '#EF4444' : '#dc2626'}
                    strokeWidth="3"
                    className="drop-shadow-lg"
                  />

                  {/* パターン2: 太陽光のみライン */}
                  <polyline
                    points={lifetimeSimulation.data
                      .map((d, i) => `${60 + (i * 680) / 30},${300 - (d.pattern2 / 100000) * 250}`)
                      .join(' ')}
                    fill="none"
                    stroke={isDark ? '#3B82F6' : '#2563eb'}
                    strokeWidth="3"
                    className="drop-shadow-lg"
                  />

                  {/* パターン3: 太陽光+蓄電池ライン */}
                  <polyline
                    points={lifetimeSimulation.data
                      .map((d, i) => `${60 + (i * 680) / 30},${300 - (d.pattern3 / 100000) * 250}`)
                      .join(' ')}
                    fill="none"
                    stroke={isDark ? '#B8860B' : '#eab308'}
                    strokeWidth="3"
                    className="drop-shadow-lg"
                  />

                  {/* 削減効果エリア（パターン1とパターン3の間） */}
                  <polygon
                    points={`${lifetimeSimulation.data
                      .map((d, i) => `${60 + (i * 680) / 30},${300 - (d.pattern1 / 100000) * 250}`)
                      .join(' ')} ${lifetimeSimulation.data
                      .reverse()
                      .map((d, i) => `${60 + ((29 - i) * 680) / 30},${300 - (d.pattern3 / 100000) * 250}`)
                      .join(' ')}`}
                    fill="url(#crownSavingsGradient)"
                    opacity="0.2"
                  />

                  <defs>
                    <linearGradient id="crownSavingsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={isDark ? '#B8860B' : '#eab308'} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={isDark ? '#B8860B' : '#eab308'} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* パフォーマンス指標 */}
              <div className="grid grid-cols-4 gap-3 mt-6">
                <div className={`backdrop-blur rounded-lg p-3 border ${
                  isDark
                    ? 'bg-gradient-to-br from-blue-900/20 to-black/40 border-blue-600/30'
                    : 'bg-gradient-to-br from-blue-100 to-white border-blue-400'
                }`}>
                  <p className={`text-xs mb-1 tracking-wide uppercase ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>太陽光投資額</p>
                  <p className={`text-sm font-bold ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    ¥{(lifetimeSimulation.initialInvestments.solarOnly / 10000).toFixed(0)}<span className={`text-xs ml-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>万円</span>
                  </p>
                </div>
                <div className={`backdrop-blur rounded-lg p-3 border ${
                  isDark
                    ? 'bg-gradient-to-br from-yellow-900/20 to-black/40 border-yellow-600/30'
                    : 'bg-gradient-to-br from-yellow-100 to-white border-yellow-400'
                }`}>
                  <p className={`text-xs mb-1 tracking-wide uppercase ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>太陽光+蓄電池投資額</p>
                  <p className="text-sm font-bold" style={{
                    color: isDark ? '#B8860B' : '#eab308'
                  }}>
                    ¥{(lifetimeSimulation.initialInvestments.solarBattery / 10000).toFixed(0)}<span className={`text-xs ml-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>万円</span>
                  </p>
                </div>
                <div className={`backdrop-blur rounded-lg p-3 border ${
                  isDark
                    ? 'bg-gradient-to-br from-blue-900/20 to-black/40 border-blue-600/30'
                    : 'bg-gradient-to-br from-blue-100 to-white border-blue-400'
                }`}>
                  <p className={`text-xs mb-1 tracking-wide uppercase ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>太陽光ROI</p>
                  <p className={`text-sm font-bold ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {((totalSavingsPattern2 / lifetimeSimulation.initialInvestments.solarOnly) * 100).toFixed(1)}<span className={`text-xs ml-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>%</span>
                  </p>
                </div>
                <div className={`backdrop-blur rounded-lg p-3 border ${
                  isDark
                    ? 'bg-gradient-to-br from-yellow-900/20 to-black/40 border-yellow-600/30'
                    : 'bg-gradient-to-br from-yellow-100 to-white border-yellow-400'
                }`}>
                  <p className={`text-xs mb-1 tracking-wide uppercase ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>蓄電池ROI</p>
                  <p className="text-sm font-bold" style={{
                    color: isDark ? '#B8860B' : '#eab308'
                  }}>
                    {((totalSavingsPattern3 / lifetimeSimulation.initialInvestments.solarBattery) * 100).toFixed(1)}<span className={`text-xs ml-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 設定パネル */}
        {showSettings && (
          <div className={`absolute top-20 right-8 w-[350px] backdrop-blur rounded-lg shadow-2xl border p-4 z-50 ${
            isDark
              ? 'bg-gradient-to-br from-gray-900/95 to-black/90 border-red-600/30'
              : 'bg-gradient-to-br from-white/95 to-gray-50/90 border-gray-400'
          }`}>
            <h3 className={`text-lg font-bold mb-6 flex items-center gap-3 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Settings className={`h-5 w-5 ${
                isDark ? 'text-red-500' : 'text-red-600'
              }`} />
              <span className="tracking-wide">シミュレーション設定</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className={`text-sm mb-3 block tracking-wide ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>太陽光発電容量 (kW)</label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="0.1"
                  value={solarCapacity}
                  onChange={(e) => setSolarCapacity(parseFloat(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer slider ${
                    isDark ? 'bg-gray-800' : 'bg-gray-300'
                  }`}
                  style={{
                    background: `linear-gradient(to right, ${isDark ? '#c41e3a' : '#dc2626'} 0%, ${isDark ? '#c41e3a' : '#dc2626'} ${(solarCapacity - 3) / 12 * 100}%, ${isDark ? '#374151' : '#d1d5db'} ${(solarCapacity - 3) / 12 * 100}%, ${isDark ? '#374151' : '#d1d5db'} 100%)`
                  }}
                />
                <div className={`flex justify-between text-xs mt-2 ${
                  isDark ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  <span>3kW</span>
                  <span className={`font-bold ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`}>{solarCapacity}kW</span>
                  <span>15kW</span>
                </div>
              </div>

              <div>
                <label className={`text-sm mb-3 block tracking-wide ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>蓄電池システム</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setHasBattery(false)}
                    className={`flex-1 py-3 rounded-lg font-medium tracking-wide transition-all ${
                      !hasBattery
                        ? (isDark ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg')
                        : (isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')
                    }`}
                  >
                    従来住宅
                  </button>
                  <button
                    onClick={() => setHasBattery(true)}
                    className={`flex-1 py-3 rounded-lg font-medium tracking-wide transition-all ${
                      hasBattery
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg'
                        : (isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')
                    }`}
                  >
                    太陽光＋蓄電池
                  </button>
                </div>
              </div>

              <div>
                <label className={`text-sm mb-3 block tracking-wide ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>月額電気代 (円)</label>
                <input
                  type="number"
                  value={monthlyElectricity}
                  onChange={(e) => setMonthlyElectricity(parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-red-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
                  }`}
                  placeholder="16,533"
                />
              </div>

              <div>
                <label className={`text-sm mb-3 block tracking-wide ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>年間インフレ率 (%)</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                    isDark ? 'bg-gray-800' : 'bg-gray-300'
                  }`}
                  style={{
                    background: `linear-gradient(to right, ${isDark ? '#b8860b' : '#eab308'} 0%, ${isDark ? '#b8860b' : '#eab308'} ${inflationRate / 5 * 100}%, ${isDark ? '#374151' : '#d1d5db'} ${inflationRate / 5 * 100}%, ${isDark ? '#374151' : '#d1d5db'} 100%)`
                  }}
                />
                <div className={`flex justify-between text-xs mt-2 ${
                  isDark ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  <span>0%</span>
                  <span className="font-bold" style={{
                    color: isDark ? '#b8860b' : '#eab308'
                  }}>{inflationRate}%</span>
                  <span>5%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* フッター */}
        <div className={`absolute bottom-0 left-0 right-0 border-t ${
          isDark
            ? 'bg-gradient-to-r from-black via-gray-900 to-black border-red-900/30'
            : 'bg-gradient-to-r from-gray-100 via-white to-gray-100 border-gray-300'
        }`}>
          <div className="px-4 py-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <span className={`text-xs font-bold tracking-[0.3em] ${
                  isDark ? 'text-red-600' : 'text-red-700'
                }`}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presentation5RunningCost;