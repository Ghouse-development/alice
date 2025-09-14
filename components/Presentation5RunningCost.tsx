'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Sun, Home, Calculator, Settings, Zap, DollarSign, Battery, BarChart3 } from 'lucide-react';

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

  // 30年間のシミュレーション
  const lifetimeSimulation = useMemo(() => {
    const years = 30;
    const data = [];
    const solarCost = solarCapacity * 250000;
    const batteryCost = hasBattery ? 1500000 : 0;
    const initialInvestment = solarCost + batteryCost;

    let cumulativeSavings = -initialInvestment;
    let cumulativeWithoutSolar = 0;

    for (let year = 1; year <= years; year++) {
      const inflationMultiplier = Math.pow(1 + inflationRate / 100, year - 1);
      const yearlyElectricity = monthlyElectricity * 12 * inflationMultiplier;

      const yearlySolarBenefit = calculateMonthlyBalance.net * 12 * (year <= 20 ? 1 : 0.8);

      cumulativeSavings += yearlySolarBenefit;
      cumulativeWithoutSolar += yearlyElectricity;

      data.push({
        year,
        withoutSolar: Math.round(cumulativeWithoutSolar),
        withSolar: Math.round(Math.max(0, cumulativeWithoutSolar - cumulativeSavings - initialInvestment)),
        savings: Math.round(cumulativeSavings),
        yearlyCost: Math.round(yearlyElectricity)
      });
    }

    return { data, initialInvestment };
  }, [solarCapacity, hasBattery, monthlyElectricity, inflationRate, calculateMonthlyBalance]);

  const totalSavings = lifetimeSimulation.data[lifetimeSimulation.data.length - 1].savings;
  const paybackPeriod = lifetimeSimulation.data.findIndex(d => d.savings > 0) + 1;

  return (
    <div
      className="relative bg-black text-white overflow-hidden"
      style={{
        width: '100%',
        height: '100%'
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
                光熱費・ランニングコスト
              </span>
            </div>
            <div className="flex items-center gap-8">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ - A3横レイアウト */}
      <div className="relative px-12 py-8 h-[calc(100%-108px)]">
        <div className="grid grid-cols-12 gap-8 h-full">
          {/* 左側：コントロールパネル */}
          <div className="col-span-4 space-y-6">
            {/* タイトル */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-gold-600/10 blur-xl rounded-lg" />
                <div className="relative bg-gradient-to-r from-red-900/20 to-gold-900/10 p-6 rounded-lg border border-red-600/30">
                  <h1 className="text-2xl font-bold tracking-wider text-white mb-2">
                    30年間の光熱費シミュレーション
                  </h1>
                  <p className="text-sm text-gray-400 tracking-wide">太陽光発電システムによる経済効果分析</p>
                </div>
              </div>
            </div>

            {/* システム設定表示 */}
            <div className="bg-gradient-to-br from-gray-900/60 to-black/40 backdrop-blur rounded-lg p-6 border border-gray-800/50">
              <div className="flex items-center gap-3 text-red-500 mb-4">
                <Sun className="h-5 w-5" />
                <span className="text-sm font-medium tracking-wide">太陽光発電システム設定</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm tracking-wide">発電容量</span>
                  <span className="text-xl font-bold text-white">{solarCapacity}<span className="text-sm text-gray-400 ml-1">kW</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm tracking-wide">蓄電池システム</span>
                  <span className="text-xl font-bold text-white">{hasBattery ? '搭載' : 'なし'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm tracking-wide">年間インフレ率</span>
                  <span className="text-xl font-bold text-white">{inflationRate}<span className="text-sm text-gray-400 ml-1">%/年</span></span>
                </div>
              </div>
            </div>

            {/* 月間エネルギー収支 */}
            <div className="bg-gradient-to-br from-red-900/20 to-gold-900/10 rounded-lg p-6 border border-red-600/30 shadow-2xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-gold-400">
                <Zap className="h-5 w-5 text-gold-500" />
                <span className="tracking-wide">月間エネルギー収支</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm tracking-wide">電力購入コスト</span>
                  <span className="text-red-400 font-bold">-¥{calculateMonthlyBalance.buy.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm tracking-wide">売電収入</span>
                  <span className="text-gold-400 font-bold">+¥{calculateMonthlyBalance.sell.toLocaleString()}</span>
                </div>
                <div className="border-t border-red-600/30 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium tracking-wide text-white">月間収支</span>
                    <span className={`text-2xl font-bold ${
                      calculateMonthlyBalance.net > 0 ? 'text-gold-400' : 'text-red-400'
                    }`}>
                      {calculateMonthlyBalance.net > 0 ? '+' : ''}¥{calculateMonthlyBalance.net.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI指標 */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gradient-to-r from-gray-900/60 to-black/40 backdrop-blur rounded-lg p-5 border border-gray-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-5 w-5 text-gold-500" />
                  <span className="text-xs text-gray-400 tracking-wide uppercase">Investment Recovery Period</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gold-400">{paybackPeriod > 0 ? paybackPeriod : '---'}</p>
                  <span className="text-sm text-gray-400">年</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-900/60 to-black/40 backdrop-blur rounded-lg p-5 border border-gray-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="h-5 w-5 text-red-500" />
                  <span className="text-xs text-gray-400 tracking-wide uppercase">30-Year Total Profit</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-red-400">
                    {(totalSavings / 10000).toFixed(0)}
                  </p>
                  <span className="text-sm text-gray-400">万円</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：チャート＆分析 */}
          <div className="col-span-8">
            <div className="bg-gradient-to-br from-gray-900/60 to-black/40 backdrop-blur rounded-lg p-8 border border-gray-800/50 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <BarChart3 className="h-7 w-7 text-red-500" />
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">30-Year Cost Analysis</h3>
                    <p className="text-sm text-gray-400 tracking-wide">光熱費累積比較チャート</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
                    <span className="text-gray-400 tracking-wide">従来住宅</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gold-500 rounded-full shadow-lg"></div>
                    <span className="text-gray-400 tracking-wide">G-HOUSE</span>
                  </div>
                </div>
              </div>

              {/* チャートエリア */}
              <div className="relative h-[400px] bg-black/30 rounded-lg p-6 border border-red-900/30">
                <svg className="w-full h-full" viewBox="0 0 800 350">
                  {/* グリッドライン */}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <g key={i}>
                      <line
                        x1="60"
                        y1={50 + i * 50}
                        x2="740"
                        y2={50 + i * 50}
                        stroke="#4B5563"
                        strokeWidth="0.5"
                        strokeDasharray="3,3"
                      />
                      <text
                        x="45"
                        y={55 + i * 50}
                        fill="#9CA3AF"
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

                  {/* 従来住宅ライン */}
                  <polyline
                    points={lifetimeSimulation.data
                      .map((d, i) => `${60 + (i * 680) / 30},${300 - (d.withoutSolar / 100000) * 250}`)
                      .join(' ')}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                    className="drop-shadow-lg"
                  />

                  {/* G-HOUSE仕様ライン */}
                  <polyline
                    points={lifetimeSimulation.data
                      .map((d, i) => `${60 + (i * 680) / 30},${300 - (d.withSolar / 100000) * 250}`)
                      .join(' ')}
                    fill="none"
                    stroke="#B8860B"
                    strokeWidth="3"
                    className="drop-shadow-lg"
                  />

                  {/* 削減効果エリア */}
                  <polygon
                    points={`60,300 ${lifetimeSimulation.data
                      .map((d, i) => `${60 + (i * 680) / 30},${300 - (d.withoutSolar / 100000) * 250}`)
                      .join(' ')} ${60 + 680},300`}
                    fill="url(#crownSavingsGradient)"
                    opacity="0.3"
                  />

                  <defs>
                    <linearGradient id="crownSavingsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#B8860B" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#B8860B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* パフォーマンス指標 */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gradient-to-br from-red-900/20 to-black/40 backdrop-blur rounded-lg p-4 border border-red-600/30">
                  <p className="text-gray-400 text-xs mb-2 tracking-wide uppercase">Initial Investment</p>
                  <p className="text-lg font-bold text-white">
                    ¥{(lifetimeSimulation.initialInvestment / 10000).toFixed(0)}<span className="text-sm text-gray-400 ml-1">万円</span>
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gold-900/20 to-black/40 backdrop-blur rounded-lg p-4 border border-gold-600/30">
                  <p className="text-gray-400 text-xs mb-2 tracking-wide uppercase">30-Year Savings</p>
                  <p className="text-lg font-bold text-gold-400">
                    ¥{((lifetimeSimulation.data[29].withoutSolar - lifetimeSimulation.data[29].withSolar) / 10000).toFixed(0)}<span className="text-sm text-gray-400 ml-1">万円</span>
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-900/20 to-black/40 backdrop-blur rounded-lg p-4 border border-red-600/30">
                  <p className="text-gray-400 text-xs mb-2 tracking-wide uppercase">ROI Rate</p>
                  <p className="text-lg font-bold text-red-400">
                    {((totalSavings / lifetimeSimulation.initialInvestment) * 100).toFixed(1)}<span className="text-sm text-gray-400 ml-1">%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 設定パネル */}
        {showSettings && (
          <div className="absolute top-24 right-12 w-[400px] bg-gradient-to-br from-gray-900/95 to-black/90 backdrop-blur rounded-lg shadow-2xl border border-red-600/30 p-6 z-50">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-white">
              <Settings className="h-5 w-5 text-red-500" />
              <span className="tracking-wide">Simulation Settings</span>
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-400 mb-3 block tracking-wide">太陽光発電容量 (kW)</label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="0.1"
                  value={solarCapacity}
                  onChange={(e) => setSolarCapacity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #c41e3a 0%, #c41e3a ${(solarCapacity - 3) / 12 * 100}%, #374151 ${(solarCapacity - 3) / 12 * 100}%, #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>3kW</span>
                  <span className="font-bold text-red-400">{solarCapacity}kW</span>
                  <span>15kW</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-3 block tracking-wide">蓄電池システム</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setHasBattery(false)}
                    className={`flex-1 py-3 rounded-lg font-medium tracking-wide transition-all ${
                      !hasBattery
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    STANDARD
                  </button>
                  <button
                    onClick={() => setHasBattery(true)}
                    className={`flex-1 py-3 rounded-lg font-medium tracking-wide transition-all ${
                      hasBattery
                        ? 'bg-gradient-to-r from-gold-600 to-gold-700 text-white shadow-lg'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    PREMIUM
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-3 block tracking-wide">月額電気代 (円)</label>
                <input
                  type="number"
                  value={monthlyElectricity}
                  onChange={(e) => setMonthlyElectricity(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="16,533"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-3 block tracking-wide">年間インフレ率 (%)</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #b8860b 0%, #b8860b ${inflationRate / 5 * 100}%, #374151 ${inflationRate / 5 * 100}%, #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0%</span>
                  <span className="font-bold text-gold-400">{inflationRate}%</span>
                  <span>5%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* フッター */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-black via-gray-900 to-black border-t border-red-900/30">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <span className="text-xs font-bold tracking-[0.3em] text-red-600">G-HOUSE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presentation5RunningCost;