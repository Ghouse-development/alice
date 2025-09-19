'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Sun, Settings, Zap, DollarSign, BarChart3 } from 'lucide-react';
import { useStore } from '@/lib/store';
import A3Page from './A3Page';

// デザインシステム定数 - A3横(420mm x 297mm)対応
const CROWN_DESIGN = {
  // A3横サイズ設定 - PresentationContainerと統一
  dimensions: {
    width: '1587px', // A3横の基準幅(px)
    height: '1123px', // A3横の基準高さ(px)
    aspectRatio: '1.414',
    scale: 'scale(1)',
    printScale: '@media print { transform: scale(1); }',
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

const Presentation5RunningCost: React.FC = () => {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const [solarCapacity, setSolarCapacity] = useState(8.3);
  const [hasBattery, setHasBattery] = useState(false);
  const [monthlyElectricity, setMonthlyElectricity] = useState(16533);
  const [inflationRate, setInflationRate] = useState(2);

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
      net: Math.round(sellElectricity - buyElectricity),
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
        yearlyElectricity: Math.round(yearlyElectricity),
      });
    }

    return {
      data,
      initialInvestments: {
        solarOnly: solarOnlyCost,
        solarBattery: solarBatteryCost,
      },
    };
  }, [solarCapacity, monthlyElectricity, inflationRate, calculateMonthlyBalance]);

  const finalYear = lifetimeSimulation.data[lifetimeSimulation.data.length - 1];
  const totalSavingsPattern2 = finalYear.pattern1 - finalYear.pattern2;
  const totalSavingsPattern3 = finalYear.pattern1 - finalYear.pattern3;
  const paybackPeriodPattern2 =
    lifetimeSimulation.data.findIndex((d) => d.pattern1 > d.pattern2) + 1;
  const paybackPeriodPattern3 =
    lifetimeSimulation.data.findIndex((d) => d.pattern1 > d.pattern3) + 1;

  return (
    <A3Page
      title="光熱費・ランニングコスト"
      subtitle="太陽光発電システムによる30年間の経済効果分析"
    >
      <div
        className={`relative overflow-hidden ${
          isDark ? 'bg-black text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* メインコンテンツ - A3横レイアウト最適化 */}
        <div className="relative px-8 py-6" style={{ height: 'auto', overflow: 'visible' }}>
          {/* 表：システム構成と投資効果 */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* 左列：システム仕様（4列分） */}
            <div className="col-span-4">
              <div
                className={`rounded-lg border h-full ${
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
                    <Sun
                      className="h-6 w-6"
                      style={{
                        color: isDark ? CROWN_DESIGN.colors.accent : '#dc2626',
                      }}
                    />
                    システム仕様
                  </h2>
                </div>
                <div className="p-4 space-y-4">
                  <div
                    className={`p-4 rounded-lg border ${
                      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      太陽光発電容量
                    </p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {solarCapacity}kW
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-lg border ${
                      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      蓄電池システム
                    </p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {hasBattery ? '搭載' : 'なし'}
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-lg border ${
                      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      月間エネルギー収支
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        calculateMonthlyBalance.net > 0
                          ? isDark
                            ? 'text-yellow-400'
                            : 'text-yellow-600'
                          : isDark
                            ? 'text-red-400'
                            : 'text-red-600'
                      }`}
                    >
                      {calculateMonthlyBalance.net > 0 ? '+' : ''}¥
                      {calculateMonthlyBalance.net.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 中央列：投資回収期間（4列分） */}
            <div className="col-span-4">
              <div
                className={`rounded-lg border h-full ${
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
                    <TrendingUp
                      className="h-6 w-6"
                      style={{
                        color: isDark ? CROWN_DESIGN.colors.gold : '#eab308',
                      }}
                    />
                    投資回収分析
                  </h2>
                </div>
                <div className="p-4 space-y-4">
                  <div
                    className={`p-4 rounded-lg border ${
                      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      太陽光のみ 回収期間
                    </p>
                    <p
                      className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                    >
                      {paybackPeriodPattern2 > 0 ? paybackPeriodPattern2 : '---'}年
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-lg border ${
                      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      太陽光+蓄電池 回収期間
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        isDark ? 'text-yellow-400' : 'text-yellow-600'
                      }`}
                    >
                      {paybackPeriodPattern3 > 0 ? paybackPeriodPattern3 : '---'}年
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-lg border ${
                      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      初期投資額
                    </p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ¥{(lifetimeSimulation.initialInvestments.solarBattery / 10000).toFixed(0)}万円
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右列：30年間累積効果（4列分） */}
            <div className="col-span-4">
              <div
                className={`rounded-lg border h-full ${
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
                    <DollarSign className="h-6 w-6 text-green-600" />
                    30年間総効果
                  </h2>
                </div>
                <div className="p-4 space-y-4">
                  <div
                    className={`p-4 rounded-lg border ${
                      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      従来住宅総コスト
                    </p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      ¥{(finalYear.pattern1 / 10000).toFixed(0)}万円
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-lg border ${
                      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      太陽光+蓄電池総コスト
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        isDark ? 'text-yellow-400' : 'text-yellow-600'
                      }`}
                    >
                      ¥{(finalYear.pattern3 / 10000).toFixed(0)}万円
                    </p>
                  </div>
                  <div
                    className={`p-6 rounded-lg text-center border-2 ${
                      isDark ? 'bg-green-900/20 border-green-600' : 'bg-green-100 border-green-600'
                    }`}
                  >
                    <p
                      className={`text-lg font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      30年間削減額
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      ¥{(totalSavingsPattern3 / 10000).toFixed(0)}万円
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 補足説明：エネルギー効率のポイント */}
          <div
            className={`rounded-lg p-6 border ${
              isDark
                ? 'bg-gradient-to-br from-gray-900/60 to-gray-800/30 border-gray-700/50'
                : 'bg-gradient-to-br from-green-50 to-white border-green-300'
            }`}
          >
            <h3
              className={`text-xl font-bold mb-4 flex items-center gap-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              <Zap className="h-6 w-6 text-green-600" />
              エネルギー効率のポイント
            </h3>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {((calculateMonthlyBalance.sell / calculateMonthlyBalance.buy) * 100).toFixed(0)}%
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  売電収入率
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  CO₂-{((solarCapacity * 1200) / 1000).toFixed(1)}t
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  年間CO₂削減
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {solarCapacity * 1200}kWh
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  年間発電量
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {(
                    (totalSavingsPattern3 / lifetimeSimulation.initialInvestments.solarBattery) *
                    100
                  ).toFixed(1)}
                  %
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  投資収益率（ROI）
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </A3Page>
  );
};

export default Presentation5RunningCost;
